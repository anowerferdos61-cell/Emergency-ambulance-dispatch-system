import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaAmbulance,
  FaSnowflake,
  FaHeartbeat,
  FaPlane,
  FaPhoneAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaUserNurse,
  FaLock,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookingService, setBookingService] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    pickup_location: '',
    hospital_name: '',
  });

  const handleBook = (service) => {
    if (!user) {
      toast.error('Please login to book or dispatch an ambulance', { icon: '🔒' });
      navigate('/login');
    } else {
      setBookingService(service);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.pickup_location.trim() || !bookingForm.hospital_name.trim()) {
      toast.error('Please fill in pickup location and hospital name');
      return;
    }

    setSubmittingBooking(true);
    try {
      const destination = bookingForm.hospital_name || bookingForm.hospital_destination || 'Nearest Emergency Hospital in Dhaka';
      const res = await api.post('/emergency/request', {
        patient_name: user?.username || 'Emergency Patient',
        contact_number: user?.phone_number || '01303-446161',
        pickup_location: bookingForm.pickup_location,
        hospital_destination: destination,
        destination_hospital: destination,
        emergency_severity: 'Urgent',
        emergency_type: bookingService ? bookingService.title : 'General Emergency',
        notes: `Service Category: ${bookingService?.title || 'Standard'} (Booked from Services page)`
      });

      const reqId = res.data?.request_id || res.data?.id;
      toast.success('Ambulance dispatch requested successfully!', { icon: '🚑' });
      setBookingService(null);
      setBookingForm({ pickup_location: '', hospital_name: '', hospital_destination: '' });
      if (reqId) {
        navigate(`/track/${reqId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to dispatch ambulance');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const services = [
    {
      id: 'regular',
      title: 'Regular (Non-AC) Ambulance',
      fare: '৳1,100 - ৳1,300 (Within Dhaka)',
      badge: 'Budget Friendly',
      icon: <FaAmbulance className="text-4xl text-error" />,
      desc: 'Economical and standard non-air-conditioned patient transportation service across Dhaka. Ideal for non-critical patient discharge, hospital visits, and routine clinical checkups.',
      features: [
        'Oxygen cylinder with regulator & mask',
        'Stretcher with safety belts & wheel-locks',
        'Experienced driver familiar with Dhaka shortcuts',
        'First-aid emergency kit on board',
        '24/7 Availability in all Dhaka zones',
      ],
    },
    {
      id: 'ac',
      title: 'Air Conditioned (A/C) Ambulance',
      fare: '৳1,400 - ৳1,600 (Within Dhaka)',
      badge: 'Most Popular',
      icon: <FaSnowflake className="text-4xl text-blue-500" />,
      desc: 'Modern climate-controlled emergency ambulance providing superior comfort and safety for patient transfers during Dhaka traffic and extreme weather conditions.',
      features: [
        'High-capacity central cooling system',
        'Continuous medical oxygen flow setup',
        'Shock-absorbing comfortable stretcher',
        'Space for 2-3 patient attendants',
        'GPS Real-Time vehicle tracking',
      ],
    },
    {
      id: 'icu',
      title: 'ICU / CCU Life Support Ambulance',
      fare: '৳3,600 - ৳4,000 (Within Dhaka)',
      badge: 'Critical Care',
      icon: <FaHeartbeat className="text-4xl text-error animate-pulse" />,
      desc: 'Fully equipped mobile Intensive Care Unit with portable ventilators, cardiac monitors, defibrillators, and certified ICU paramedics for transporting critical patients between Dhaka hospitals.',
      features: [
        'Transport Ventilator & Multi-Parameter Monitor',
        'Defibrillator & ECG machine setup',
        'Syringe infusion pumps & suction apparatus',
        'Certified critical care paramedic / nurse',
        'Direct emergency hospital coordination',
      ],
    },
    {
      id: 'freezer',
      title: 'Freezer Van (Mortuary Van)',
      fare: '৳2,400 - ৳2,600 (Within Dhaka)',
      badge: 'Preservation Unit',
      icon: <FaSnowflake className="text-4xl text-purple-600" />,
      desc: 'Specially designed temperature-controlled freezer chamber (-5°C to -10°C) for respectful and hygienic transportation of deceased bodies anywhere in Bangladesh from Dhaka.',
      features: [
        'Imported stainless steel cooling mortuary unit',
        'Maintains sub-zero temperature indefinitely',
        'Separate sanitized cabin for family members',
        'Available for inter-district long trips',
        '24-Hour immediate dispatch hotline',
      ],
    },
    {
      id: 'air',
      title: 'Air Ambulance & NICU Support',
      fare: 'On Request (24/7 Hotline)',
      badge: 'Air Support',
      icon: <FaPlane className="text-4xl text-emerald-600" />,
      desc: 'Emergency helicopter airlift and specialized neonatal incubator (NICU) ambulances for preterm babies and urgent inter-city medical evacuations.',
      features: [
        'Preterm infant incubator with oxygen & warmth',
        'Aero-medical evacuation coordination',
        'Pediatric specialist & doctor assistance',
        'Helipad to Dhaka Tertiary Hospital routing',
        'Fastest emergency medical transfer',
      ],
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-3">
        <span className="badge badge-warning font-bold text-xs uppercase tracking-wider py-2 px-3">
          24/7 Dhaka Medical Fleet
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">Our Ambulance Services in Dhaka</h1>
        <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
          We operate a versatile medical transport fleet equipped with advanced life-saving apparatus to serve every patient requirement across Dhaka City.
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-8">
        {services.map((srv, idx) => (
          <div
            key={srv.id}
            className={`card bg-base-100 border-2 border-base-300 hover:border-error shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl p-6 sm:p-8 ${
              srv.id === 'icu' ? 'bg-gradient-to-r from-red-50/20 via-base-100 to-base-100 border-error' : ''
            }`}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-4 bg-base-200 rounded-2xl shrink-0 shadow-inner">
                  {srv.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black">{srv.title}</h2>
                    <span className="badge badge-error text-white font-bold text-xs uppercase">
                      {srv.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed max-w-3xl">
                    {srv.desc}
                  </p>

                  {/* Feature Bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-base-content/70">
                        <FaCheckCircle className="text-success shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-base-200">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-base-content/60 font-semibold">Estimated Dhaka Fare</span>
                  <div className="text-lg sm:text-xl font-black text-success">{srv.fare}</div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <a
                    href="tel:01303446161"
                    className="btn btn-outline btn-error btn-sm font-bold gap-1"
                  >
                    <FaPhoneAlt /> Call
                  </a>
                  <button
                    onClick={() => handleBook(srv)}
                    className="btn btn-error text-white btn-sm font-bold shadow-md gap-1"
                  >
                    {!user && <FaLock className="text-xs" />}
                    {user ? 'Book Dispatch' : 'Login to Book'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Emergency Banner */}
      <div className="bg-base-200 p-8 rounded-3xl border border-base-300 text-center space-y-4">
        <h3 className="text-2xl font-black">Need Guidance on Choosing the Right Ambulance?</h3>
        <p className="text-xs sm:text-sm text-base-content/70 max-w-xl mx-auto">
          Our emergency hotline medical consultants will assess the patient condition and dispatch the appropriate ambulance instantly.
        </p>
        <a href="tel:01303446161" className="btn btn-error text-white font-bold btn-md shadow-lg gap-2">
          <FaPhoneAlt /> Call 24/7 Helpline: 01303-446161
        </a>
      </div>

      {/* EMERGENCY SERVICE BOOKING MODAL */}
      {bookingService && (
        <div className="modal modal-open z-50">
          <div className="modal-box max-w-md rounded-3xl border border-base-300 shadow-2xl p-6 bg-base-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-error/10 text-error flex items-center justify-center font-bold text-lg">
                  <FaAmbulance />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight">Request {bookingService.title}</h3>
                  <p className="text-xs text-base-content/60">Estimated Dhaka Fare: {bookingService.fare}</p>
                </div>
              </div>
              <button 
                onClick={() => setBookingService(null)} 
                className="btn btn-sm btn-circle btn-ghost"
              >✕</button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
                  Pickup Location <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 4, Road 11, Banani, Dhaka"
                  className="input input-bordered w-full text-sm"
                  value={bookingForm.pickup_location}
                  onChange={(e) => setBookingForm({ ...bookingForm, pickup_location: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
                  Destination Hospital <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Hospital / DMCH"
                  className="input input-bordered w-full text-sm"
                  value={bookingForm.hospital_name}
                  onChange={(e) => setBookingForm({ ...bookingForm, hospital_name: e.target.value })}
                />
              </div>

              <div className="bg-base-200 p-3.5 rounded-2xl space-y-1 text-xs text-base-content/80">
                <div className="flex justify-between">
                  <span className="opacity-70">Category:</span>
                  <span className="font-bold">{bookingService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Estimated Cost:</span>
                  <span className="font-bold text-error">{bookingService.fare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Dispatch Response:</span>
                  <span className="text-success font-semibold">Immediate / Under 15 Mins</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingService(null)}
                  className="btn btn-ghost flex-1 rounded-2xl"
                  disabled={submittingBooking}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="btn btn-error text-white flex-1 rounded-2xl shadow-lg shadow-error/30"
                >
                  {submittingBooking ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Confirm & Track'
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop bg-black/40" onClick={() => setBookingService(null)}></div>
        </div>
      )}
    </div>
  );
};
