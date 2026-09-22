import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHospital,
  FaCheckCircle,
  FaClock,
  FaUserShield,
  FaArrowLeft,
  FaTimesCircle,
  FaPhoneVolume,
  FaRoute,
  FaIdCard,
  FaShieldAlt,
  FaExclamationCircle,
  FaSync
} from 'react-icons/fa';

export const TripTracker = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchTripStatus = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get(`/emergency/status/${requestId}`);
      setTripData(res.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
      toast.error('Could not load trip tracking information');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripStatus(true);
    // Real-time polling every 3.5 seconds
    const interval = setInterval(() => {
      fetchTripStatus(false);
    }, 3500);
    return () => clearInterval(interval);
  }, [requestId]);

  const handleCancelTrip = async () => {
    if (!window.confirm('Are you sure you want to cancel this emergency ambulance request?')) {
      return;
    }
    setCancelling(true);
    try {
      await api.delete(`/emergency/cancel/${requestId}`);
      toast.success('Emergency request has been cancelled');
      fetchTripStatus(false);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to cancel request';
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <FaAmbulance className="text-5xl text-error animate-bounce" />
          <span className="loading loading-ping loading-lg text-error absolute -top-2 -left-2 opacity-50"></span>
        </div>
        <h3 className="text-lg font-bold text-base-content/80">Connecting to Live Dhaka Dispatch Control...</h3>
        <p className="text-xs text-base-content/60">Fetching real-time GPS & driver assignment</p>
      </div>
    );
  }

  if (!tripData || !tripData.request) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <FaExclamationCircle className="text-5xl text-warning mx-auto" />
        <h2 className="text-2xl font-black">Dispatch Record Not Found</h2>
        <p className="text-xs text-base-content/70">
          We couldn't locate request #{requestId}. It may have been expired or removed.
        </p>
        <Link to="/dashboard" className="btn btn-error text-white font-bold btn-sm">
          Return to Dispatch Dashboard
        </Link>
      </div>
    );
  }

  const req = tripData.request;
  const ambulance = tripData.ambulance;
  const driver = tripData.driver;

  // Determine Stepper Active Step
  // 1: Requested (pending), 2: Assigned (assigned), 3: On The Way (on_the_way), 4: Reached / Completed (completed)
  const getStepIndex = (status) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'assigned':
        return 2;
      case 'on_the_way':
        return 3;
      case 'completed':
        return 4;
      case 'cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(req.status);

  const driverPhone = driver?.phone_number || ambulance?.driver_phone || '01303446161';
  const driverName = driver?.username || ambulance?.driver_name || 'Assigned Driver';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 pt-2 px-2 sm:px-4">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-300">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
            {req.is_scheduled ? 'Scheduled Booking Tracker' : 'Live GPS Dispatch Tracker'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
            {req.is_scheduled ? '📅 Scheduled Booking' : 'Emergency Dispatch'} #{req.id}
          </h1>
          <p className="text-xs sm:text-sm text-white/80">
            {req.is_scheduled ? (
              <span>Target Schedule Date: <strong>{req.booking_date}</strong></span>
            ) : (
              <span>Requested at {new Date(req.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Auto-refreshing</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTripStatus(false)}
            className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-none rounded-xl font-bold gap-1"
            title="Refresh live status"
          >
            <FaSync className="text-xs" /> Sync
          </button>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="btn btn-sm bg-white/20 hover:bg-white text-white hover:text-red-700 border-none rounded-xl gap-2 font-bold shadow-md"
          >
            <FaArrowLeft /> {user ? 'Dashboard' : 'Home'}
          </button>
        </div>
      </div>

      {/* Scheduled Info Alert */}
      {req.is_scheduled && (
        <div className="bg-info/10 border border-info/30 p-4 rounded-3xl text-xs sm:text-sm text-info-content flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <strong>Advance Scheduled Booking:</strong>
            <p className="opacity-90">
              This ambulance request is scheduled for <strong>{req.booking_date}</strong>. Our Dhaka Admin Dispatch Command Team will assign the driver and ensure on-time arrival.
            </p>
          </div>
        </div>
      )}

      {/* Live Status Progress Stepper */}
      <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-lg sm:text-xl flex items-center gap-2">
            <FaRoute className="text-error" /> Trip Progress & Arrival Status
          </h3>
          <span
            className={`badge font-bold uppercase text-xs sm:text-sm py-3 px-3.5 ${
              req.status === 'completed'
                ? 'badge-success text-white'
                : req.status === 'cancelled'
                ? 'badge-ghost text-base-content/50'
                : req.status === 'on_the_way'
                ? 'badge-warning text-red-950 animate-pulse'
                : req.status === 'assigned'
                ? 'badge-info text-white'
                : 'badge-error text-white animate-pulse'
            }`}
          >
            {req.status === 'pending' && (req.is_scheduled ? '📅 Awaiting Admin Assignment' : '🚨 Searching Nearest Driver')}
            {req.status === 'assigned' && '👨‍✈️ Driver Assigned'}
            {req.status === 'on_the_way' && '🚑 Ambulance On The Way'}
            {req.status === 'completed' && '✓ Completed'}
            {req.status === 'cancelled' && '✕ Cancelled'}
          </span>
        </div>

        {/* 4-Step Animated Bar */}
        {req.status !== 'cancelled' ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative py-2">
            {/* Step 1: Requested */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-md transition-all ${
                currentStep >= 1 ? 'bg-error text-white scale-105' : 'bg-base-300 text-base-content/40'
              }`}>
                1
              </div>
              <span className={`text-[11px] sm:text-xs font-bold ${currentStep >= 1 ? 'text-error' : 'text-base-content/50'}`}>
                SOS Requested
              </span>
            </div>

            {/* Step 2: Assigned */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-md transition-all ${
                currentStep >= 2 ? 'bg-primary text-white scale-105' : 'bg-base-300 text-base-content/40'
              }`}>
                2
              </div>
              <span className={`text-[11px] sm:text-xs font-bold ${currentStep >= 2 ? 'text-primary' : 'text-base-content/50'}`}>
                Driver Assigned
              </span>
            </div>

            {/* Step 3: On The Way */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-md transition-all ${
                currentStep >= 3 ? 'bg-warning text-red-950 scale-110 animate-bounce' : 'bg-base-300 text-base-content/40'
              }`}>
                3
              </div>
              <span className={`text-[11px] sm:text-xs font-bold ${currentStep >= 3 ? 'text-warning-content font-extrabold' : 'text-base-content/50'}`}>
                On The Way
              </span>
            </div>

            {/* Step 4: Reached / Completed */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base shadow-md transition-all ${
                currentStep >= 4 ? 'bg-success text-white scale-105' : 'bg-base-300 text-base-content/40'
              }`}>
                4
              </div>
              <span className={`text-[11px] sm:text-xs font-bold ${currentStep >= 4 ? 'text-success' : 'text-base-content/50'}`}>
                Hospital Arrival
              </span>
            </div>
          </div>
        ) : (
          <div className="alert alert-error text-white font-bold rounded-2xl text-xs sm:text-sm">
            <FaTimesCircle className="text-lg" />
            <span>This emergency dispatch request was cancelled.</span>
          </div>
        )}

        {/* Dynamic Status Alert Message */}
        {req.status === 'pending' && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-2xl flex items-center gap-3">
            <span className="loading loading-spinner text-error"></span>
            <div>
              <h4 className="font-extrabold text-sm text-error">Dispatching Nearest Dhaka Emergency Unit...</h4>
              <p className="text-xs text-base-content/70">
                Central control room and nearby drivers have been notified. Your assigned driver details will appear here automatically.
              </p>
            </div>
          </div>
        )}

        {req.status === 'assigned' && (
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 rounded-2xl flex items-center gap-3">
            <FaCheckCircle className="text-primary text-2xl shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-primary">Ambulance & Driver Assigned!</h4>
              <p className="text-xs text-base-content/70">
                Driver <strong>{driverName}</strong> has been allocated to your emergency. You can call the driver directly below.
              </p>
            </div>
          </div>
        )}

        {req.status === 'on_the_way' && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaAmbulance className="text-warning text-3xl shrink-0 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm text-yellow-900 dark:text-yellow-200">
                  Ambulance En Route to Your Location!
                </h4>
                <p className="text-xs text-base-content/70">
                  Estimated Arrival Time: <strong>5 - 8 Minutes (~1.2 km away)</strong>. Please keep phone line open.
                </p>
              </div>
            </div>
          </div>
        )}

        {req.status === 'completed' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-4 rounded-2xl flex items-center gap-3">
            <FaCheckCircle className="text-success text-2xl shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-success">Patient Transport Successfully Completed</h4>
              <p className="text-xs text-base-content/70">
                The ambulance has reached the destination hospital. Thank you for using Emergency Ambulance Service Dhaka.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Driver & Vehicle Details + 1-Click Direct Call */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Driver Card */}
        <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="badge badge-warning text-red-950 font-extrabold text-[10px] uppercase tracking-wider mb-1">
                Assigned Driver
              </span>
              <h3 className="font-black text-xl text-base-content">{driverName}</h3>
              <p className="text-xs text-base-content/60">
                {driver?.driving_license ? `License: ${driver.driving_license}` : 'Certified Emergency Paramedic Driver'}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-warning/20 text-warning flex items-center justify-center text-2xl font-black shadow-inner">
              <FaIdCard />
            </div>
          </div>

          <div className="p-3 bg-base-200 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-base-content/60">Vehicle Plate:</span>
              <span className="font-mono font-bold text-primary">
                {ambulance?.vehicle_number || driver?.vehicle_number || 'Dhaka Metro Ambulance'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Ambulance Type:</span>
              <span className="font-bold">{ambulance?.ambulance_type || 'AC Emergency Ambulance'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Base Station Hub:</span>
              <span className="font-bold">{ambulance?.base_location || 'Dhanmondi / Dhaka Central'}</span>
            </div>
          </div>

          {/* Big Green 1-Click Call Button */}
          <a
            href={`tel:${driverPhone}`}
            className="btn btn-success text-white font-extrabold btn-md w-full shadow-lg gap-2 text-base hover:scale-102 transition-transform"
          >
            <FaPhoneAlt className="animate-pulse" />
            <span>Call Driver ({driverPhone})</span>
          </a>
        </div>

        {/* Trip Destination & Route Card */}
        <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="badge badge-error font-extrabold text-[10px] text-white uppercase tracking-wider mb-1">
                Emergency Route
              </span>
              <h3 className="font-black text-xl text-base-content">Pickup & Hospital</h3>
              <p className="text-xs text-base-content/60">Direct Navigation Coordinates</p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-error/20 text-error flex items-center justify-center text-2xl font-black shadow-inner">
              <FaHospital />
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-base-200 rounded-2xl flex items-start gap-2.5">
              <FaMapMarkerAlt className="text-error text-base mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-base-content/60 block text-[10px] uppercase">Patient Pickup Point</span>
                <span className="font-extrabold text-sm">{req.pickup_location}</span>
              </div>
            </div>

            <div className="p-3 bg-base-200 rounded-2xl flex items-start gap-2.5">
              <FaHospital className="text-primary text-base mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-base-content/60 block text-[10px] uppercase">Destination Hospital</span>
                <span className="font-extrabold text-sm">{req.hospital_destination}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-base-200 text-xs">
            <div>
              <span className="text-base-content/60 block text-[10px]">Estimated Base Fare</span>
              <span className="font-black text-base text-success">
                ৳{req.total_fare || ambulance?.base_fare || 1500}
              </span>
            </div>

            <a
              href="tel:01303446161"
              className="btn btn-outline btn-error btn-xs sm:btn-sm font-bold gap-1 rounded-xl"
            >
              <FaPhoneVolume /> 24/7 Hotline
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Emergency Action: Cancel Option if still pending */}
      {req.status === 'pending' && (
        <div className="text-center pt-4">
          <button
            onClick={handleCancelTrip}
            disabled={cancelling}
            className="btn btn-ghost btn-sm text-error font-bold hover:bg-error/10 gap-2"
          >
            {cancelling ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <FaTimesCircle />
            )}
            Cancel Emergency Request
          </button>
        </div>
      )}
    </div>
  );
};

export default TripTracker;
