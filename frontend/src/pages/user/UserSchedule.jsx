import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FaCalendarAlt,
  FaHospital,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaHeartbeat,
  FaClock,
  FaCheckCircle,
  FaInfoCircle,
  FaAmbulance,
  FaArrowLeft,
} from 'react-icons/fa';

export const UserSchedule = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Dates: minimum is tomorrow (strictly advance booking)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

  const paramAmbId = searchParams.get('ambulance_id');
  const paramType = searchParams.get('type') || 'AC Ambulance';
  const paramLocation = searchParams.get('location');

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: tomorrowDateStr,
    booking_time: '10:00',
    ambulance_type: paramType,
    ambulance_id: paramAmbId || null,
    patient_name: user?.username || '',
    contact_number: user?.phone_number || '',
    pickup_location: paramLocation ? `${paramLocation}, Dhaka` : 'Dhanmondi, Dhaka',
    destination_hospital: 'Dhaka Medical College Hospital (DMCH)',
    emergency_severity: 'Normal',
    notes: '',
  });

  const dhakaHospitals = [
    'Dhaka Medical College Hospital (DMCH)',
    'Square Hospital, Panthapath',
    'Evercare Hospital, Bashundhara',
    'United Hospital, Gulshan 2',
    'Birdem General Hospital, Shahbagh',
    'National Institute of Cardiovascular Diseases (NICVD)',
    'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
    'Kurmitola General Hospital, Dhaka Cantonment',
    'Ibn Sina Hospital, Dhanmondi',
    'Labaid Specialized Hospital, Dhanmondi',
    'Popular Medical College Hospital, Dhanmondi',
  ];

  const ambulanceTypes = [
    {
      type: 'AC Ambulance',
      fare: '৳2,500 Base',
      desc: 'Air conditioned, full oxygen cylinder, emergency stretcher.',
    },
    {
      type: 'ICU Ambulance',
      fare: '৳4,500 Base',
      desc: 'Ventilator, Cardiac Monitor, Defibrillator & Paramedic on board.',
    },
    {
      type: 'Non-AC Ambulance',
      fare: '৳1,800 Base',
      desc: 'Standard rapid patient transfer across Dhaka.',
    },
    {
      type: 'Freezer Van',
      fare: '৳4,000 Base',
      desc: 'Temperature controlled dead body carrier across Bangladesh.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.booking_date || formData.booking_date < tomorrowDateStr) {
      toast.error('📅 শিডিউল বুকিংয়ের জন্য অনুগ্রহ করে আগামীকালের বা তার পরের যেকোনো তারিখ নির্বাচন করুন।');
      return;
    }

    if (!formData.patient_name || !formData.contact_number || !formData.pickup_location) {
      toast.error('Please fill in all required fields marked with *');
      return;
    }

    setLoading(true);
    try {
      if (user) {
        // Logged-in user booking
        const res = await api.post('/emergency/request', {
          patient_name: formData.patient_name,
          contact_number: formData.contact_number,
          pickup_location: formData.pickup_location,
          hospital_destination: formData.destination_hospital,
          destination_hospital: formData.destination_hospital,
          emergency_severity: formData.emergency_severity,
          emergency_type: formData.ambulance_type,
          booking_date: formData.booking_date,
          is_scheduled: true,
          notes: `Schedule Time: ${formData.booking_time} | Type: ${formData.ambulance_type} | Notes: ${formData.notes || 'None'}`,
        });

        toast.success(res.data?.message || 'Advance scheduled booking confirmed!', { icon: '📅' });
        const reqId = res.data?.request_id || res.data?.id;
        if (reqId) {
          navigate(`/track/${reqId}`);
        } else {
          navigate('/dashboard/history');
        }
      } else {
        // Guest user booking
        const guestPayload = {
          patient_name: formData.patient_name,
          contact_number: formData.contact_number,
          pickup_location: formData.pickup_location,
          hospital_destination: formData.destination_hospital,
          emergency_severity: formData.emergency_severity,
          booking_date: formData.booking_date,
          is_scheduled: true,
          notes: `Guest Booking | Time: ${formData.booking_time} | Type: ${formData.ambulance_type} | Notes: ${formData.notes || 'None'}`,
        };

        const res = await api.post('/emergency/guest_booking', guestPayload);
        toast.success(res.data?.message || 'Advance schedule submitted for admin approval!', { icon: '📅' });
        const reqId = res.data?.request_id;
        if (reqId) {
          navigate(`/track/${reqId}`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Failed to submit scheduled booking';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-primary text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="badge badge-warning text-black font-extrabold text-xs uppercase tracking-wider">
            Advance Patient Transit
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            📅 Schedule Advance Ambulance Booking
          </h2>
          <p className="text-xs sm:text-sm text-blue-100">
            Book an ambulance in advance for hospital admission, diagnostic tests, therapy sessions, or discharge in Dhaka. Our admin dispatch team confirms and assigns your vehicle ahead of time.
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Form Fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Date & Time Selection */}
          <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-black text-base border-b border-base-300 pb-3">
              <FaCalendarAlt className="text-primary" /> Schedule Date & Time
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Required Date (আগামীকাল বা পরে) <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={tomorrowDateStr}
                  className="input input-bordered input-sm sm:input-md w-full font-bold text-xs sm:text-sm"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                />
                <span className="text-[10px] text-base-content/50 mt-1 block">
                  Advance bookings must be scheduled at least 1 day prior.
                </span>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Preferred Pickup Time <span className="text-error">*</span>
                </label>
                <input
                  type="time"
                  required
                  className="input input-bordered input-sm sm:input-md w-full font-bold text-xs sm:text-sm"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 2. Ambulance Type Selection */}
          <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-base-300 pb-3">
              <div className="flex items-center gap-2 font-black text-base">
                <FaAmbulance className="text-error" /> Select Ambulance Type
              </div>
              <span className="badge badge-ghost text-xs font-bold">{formData.ambulance_type}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ambulanceTypes.map((amb) => (
                <div
                  key={amb.type}
                  onClick={() => setFormData({ ...formData, ambulance_type: amb.type })}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 space-y-1.5 ${
                    formData.ambulance_type === amb.type
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-base-300 bg-base-100 hover:border-base-content/30'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm">{amb.type}</span>
                    <span className="badge badge-neutral text-[11px] font-black">{amb.fare}</span>
                  </div>
                  <p className="text-[11px] text-base-content/70">{amb.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Patient & Location Information */}
          <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-black text-base border-b border-base-300 pb-3">
              <FaUser className="text-info" /> Patient & Location Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Patient Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammad Ali"
                  className="input input-bordered input-sm sm:input-md w-full font-semibold"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Contact Phone Number <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  className="input input-bordered input-sm sm:input-md w-full font-semibold"
                  value={formData.contact_number}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Pickup Address in Dhaka <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 24, Road 8, Block C, Banani, Dhaka"
                  className="input input-bordered input-sm sm:input-md w-full font-semibold"
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Destination Hospital <span className="text-error">*</span>
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md w-full font-bold"
                  value={formData.destination_hospital}
                  onChange={(e) => setFormData({ ...formData, destination_hospital: e.target.value })}
                >
                  {dhakaHospitals.map((hosp) => (
                    <option key={hosp} value={hosp}>
                      🏥 {hosp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Special Notes / Doctor Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Patient requires wheelchair assistance / Post-surgery transfer"
                  className="textarea textarea-bordered w-full text-xs"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Summary & Submission */}
        <div className="space-y-4">
          <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 shadow-md space-y-4 sticky top-20">
            <h3 className="font-black text-base border-b border-base-300 pb-3 flex items-center gap-2">
              <FaCheckCircle className="text-success" /> Booking Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-base-200">
                <span className="text-base-content/60">Service Type:</span>
                <span className="font-bold">{formData.ambulance_type}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-base-200">
                <span className="text-base-content/60">Date & Time:</span>
                <span className="font-bold text-primary">
                  {formData.booking_date} at {formData.booking_time}
                </span>
              </div>

              <div className="py-1 border-b border-base-200 space-y-0.5">
                <span className="text-base-content/60 block">Pickup:</span>
                <span className="font-bold line-clamp-1">{formData.pickup_location}</span>
              </div>

              <div className="py-1 border-b border-base-200 space-y-0.5">
                <span className="text-base-content/60 block">Destination:</span>
                <span className="font-bold line-clamp-1">{formData.destination_hospital}</span>
              </div>

              <div className="bg-primary/5 p-3 rounded-2xl border border-primary/20 space-y-1 text-[11px]">
                <span className="font-bold text-primary flex items-center gap-1">
                  <FaInfoCircle /> Admin Assignment Notice:
                </span>
                <p className="text-base-content/70">
                  Your schedule request will be reviewed by Dhaka Dispatch Control, and an ambulance will be assigned ahead of your scheduled time.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-white font-extrabold w-full rounded-2xl shadow-lg gap-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <FaCalendarAlt /> Confirm Schedule Booking
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserSchedule;
