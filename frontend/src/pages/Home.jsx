import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

import { HomeHero } from '../components/home/HomeHero';
import { HomeServices } from '../components/home/HomeServices';
import { HomeCoverage } from '../components/home/HomeCoverage';
import { HomeHospitals } from '../components/home/HomeHospitals';
import { HomeFleet } from '../components/home/HomeFleet';
import { HomeAbout } from '../components/home/HomeAbout';
import { HomeFaq } from '../components/home/HomeFaq';
import { HomeDispatchModal } from '../components/home/HomeDispatchModal';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Booking Modal State
  const [bookingAmbulance, setBookingAmbulance] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDateStr = tomorrowDate.toISOString().split('T')[0];

  const [bookingForm, setBookingForm] = useState({
    patient_name: '',
    contact_number: '',
    pickup_location: 'Dhanmondi, Dhaka',
    hospital_destination: 'Nearest Emergency Hospital in Dhaka',
    emergency_severity: 'Urgent',
    booking_date: tomorrowDateStr,
    notes: '',
  });

  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      let url = `/ambulances/all?page=${page}&limit=6`;
      const combinedSearch = [search, zoneFilter].filter(Boolean).join(' ');
      if (combinedSearch) url += `&search=${encodeURIComponent(combinedSearch)}`;
      if (typeFilter) url += `&ambulance_type=${encodeURIComponent(typeFilter)}`;

      const res = await api.get(url);
      setAmbulances(res.data?.data || []);
      setTotalPages(res.data?.total_pages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load Dhaka ambulances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchAmbulances();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, typeFilter, zoneFilter, page]);

  // Handle Logged-in User Direct Dispatch Click
  const handleDirectDispatchClick = (amb) => {
    setBookingAmbulance(amb);
    setBookingForm({
      patient_name: user?.username || '',
      contact_number: user?.phone_number || '',
      pickup_location: `${amb.base_location || 'Gulshan'}, Dhaka`,
      hospital_destination: 'Dhaka Medical College Hospital',
      emergency_severity: 'Urgent',
      booking_date: todayDateStr,
      notes: '',
    });
  };

  // Handle Schedule Advance Booking Click -> Navigates directly to dedicated Schedule page
  const handleScheduleClick = (amb) => {
    const targetPath = user ? '/dashboard/schedule' : '/schedule';
    const params = new URLSearchParams();
    if (amb?.id) params.set('ambulance_id', amb.id);
    if (amb?.ambulance_type) params.set('type', amb.ambulance_type);
    if (amb?.base_location) params.set('location', amb.base_location);
    navigate(`${targetPath}?${params.toString()}`);
  };

  // Handle Emergency Click for Non-logged-in User
  const handleEmergencyNonLogin = (amb) => {
    toast.error('🚨 আজকের জরুরি অ্যাম্বুলেন্স সরাসরি ডিসপ্যাচ পেতে লগইন বা সাইন-আপ আবশ্যক!', {
      duration: 4000,
      icon: '🔒',
    });
    sessionStorage.setItem('pending_dispatch_amb', JSON.stringify({
      ambulance: amb,
      form: {
        pickup_location: `${amb.base_location || 'Gulshan'}, Dhaka`,
        hospital_destination: 'Dhaka Medical College Hospital',
        booking_date: todayDateStr,
      }
    }));
    navigate('/login');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingAmbulance) return;
    setSubmittingBooking(true);
    try {
      const destination = bookingForm.hospital_destination || 'Nearest Emergency Hospital in Dhaka';

      if (user) {
        // Logged-in User: Direct Emergency Dispatch
        const isScheduled = bookingForm.booking_date && bookingForm.booking_date > todayDateStr;
        const payload = {
          patient_name: bookingForm.patient_name || user?.username || 'Emergency Patient',
          contact_number: bookingForm.contact_number || user?.phone_number || '01303-446161',
          pickup_location: bookingForm.pickup_location || 'Dhaka, Bangladesh',
          hospital_destination: destination,
          destination_hospital: destination,
          emergency_severity: bookingForm.emergency_severity || 'Urgent',
          notes: bookingForm.notes || `Selected Ambulance: ${bookingAmbulance.vehicle_number}`,
          ambulance_id: bookingAmbulance.id,
          booking_date: bookingForm.booking_date || todayDateStr,
          is_scheduled: isScheduled,
        };
        const res = await api.post('/emergency/request', payload);
        toast.success(res.data?.message || 'Ambulance dispatch confirmed!', { icon: '🚨' });
        const reqId = res.data?.request_id || res.data?.id;
        setBookingAmbulance(null);
        if (reqId) {
          navigate(`/track/${reqId}`);
        } else {
          navigate('/dashboard');
        }
      } else {
        // Guest User: Advance Scheduled Booking ONLY
        if (!bookingForm.booking_date || bookingForm.booking_date <= todayDateStr) {
          toast.error('🚨 নন-লগইন ইউজাররা কেবল ভবিষ্যতের তারিখের জন্য শিডিউল বুকিং দিতে পারবেন। আজকের জন্য জরুরি ডিসপ্যাচ পেতে লগইন করুন।', {
            duration: 4500,
          });
          setSubmittingBooking(false);
          return;
        }

        const guestPayload = {
          patient_name: bookingForm.patient_name || 'Guest Patient',
          contact_number: bookingForm.contact_number || '01303-446161',
          pickup_location: bookingForm.pickup_location || 'Dhaka, Bangladesh',
          hospital_destination: destination,
          emergency_severity: bookingForm.emergency_severity || 'Normal',
          notes: bookingForm.notes || `Guest Scheduled for ${bookingForm.booking_date}`,
          ambulance_id: bookingAmbulance.id,
          booking_date: bookingForm.booking_date,
          is_scheduled: true,
        };
        const res = await api.post('/emergency/guest_booking', guestPayload);
        toast.success(res.data?.message || 'Schedule booking submitted for admin review!', { icon: '📅' });
        const reqId = res.data?.request_id;
        setBookingAmbulance(null);
        if (reqId) {
          navigate(`/track/${reqId}`);
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || error.message || 'Booking failed';
      toast.error(msg);
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Banner */}
      <HomeHero user={user} />

      {/* 2. Services Overview */}
      <HomeServices />

      {/* 3. Dhaka Coverage Zones */}
      <HomeCoverage zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />

      {/* 4. Connected Dhaka Hospitals */}
      <HomeHospitals />

      {/* 5. Live Fleet with Filters & Actions */}
      <HomeFleet
        ambulances={ambulances}
        loading={loading}
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        zoneFilter={zoneFilter}
        setZoneFilter={setZoneFilter}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        user={user}
        onDirectDispatch={handleDirectDispatchClick}
        onEmergencyNonLogin={handleEmergencyNonLogin}
        onScheduleClick={handleScheduleClick}
      />

      {/* 6. About Us & Emergency Hotlines */}
      <HomeAbout />

      {/* 7. FAQs */}
      <HomeFaq />

      {/* 8. Booking & Dispatch Modal */}
      <HomeDispatchModal
        bookingAmbulance={bookingAmbulance}
        setBookingAmbulance={setBookingAmbulance}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        submittingBooking={submittingBooking}
        user={user}
        todayDateStr={todayDateStr}
        tomorrowDateStr={tomorrowDateStr}
        handleConfirmBooking={handleConfirmBooking}
        navigate={navigate}
      />
    </div>
  );
};
