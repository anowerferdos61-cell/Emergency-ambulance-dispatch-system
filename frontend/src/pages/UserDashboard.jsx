import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHospital,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaCrosshairs,
  FaPhoneVolume,
  FaRoute,
  FaExclamationTriangle,
  FaUserCheck,
  FaTrashAlt,
} from 'react-icons/fa';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected Location for Quick Search (Default: Dhanmondi, Dhaka)
  const [selectedArea, setSelectedArea] = useState('Dhanmondi');
  const [customLocation, setCustomLocation] = useState('');
  const [nearestDrivers, setNearestDrivers] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Pure Dhaka City Hubs (North & South)
  const dhakaHubs = [
    'Dhanmondi',
    'Gulshan',
    'Banani',
    'Uttara',
    'Mirpur',
    'Mohammadpur',
    'Bashundhara',
    'Mohakhali',
    'Shahbagh',
    'Old Dhaka',
    'Badda',
    'Motijheel',
    'Jatrabari',
    'Shantinagar',
    'Tejgaon',
    'Savar',
  ];

  // Fetch 5 Nearest Drivers in Dhaka
  const fetchNearestDrivers = async (location) => {
    setLoadingDrivers(true);
    setIsScanning(true);
    try {
      const loc = location || selectedArea;
      const res = await api.get(`/emergency/nearest?location=${encodeURIComponent(loc)}&limit=5`);
      setNearestDrivers(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Could not fetch nearest ambulances in Dhaka');
    } finally {
      setLoadingDrivers(false);
      setTimeout(() => setIsScanning(false), 500);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/emergency/my_requests');
      setMyRequests(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNearestDrivers(selectedArea);
    fetchMyRequests();
    // Live polling every 8 seconds
    const interval = setInterval(fetchMyRequests, 8000);
    return () => clearInterval(interval);
  }, [selectedArea]);

  // 1-Click Instant SOS Dispatch in Dhaka
  const handleInstantSOS = async (specificAmbulance = null) => {
    const activeLoc = customLocation || `${selectedArea}, Dhaka`;
    setDispatchingId(specificAmbulance?.id || 'sos');

    try {
      const payload = {
        pickup_location: activeLoc,
        contact_number: user?.phone_number || 'Emergency Caller',
        patient_name: user?.username || 'Emergency Patient',
        hospital_destination: 'Nearest Emergency Hospital in Dhaka',
        emergency_severity: 'Critical',
        ambulance_id: specificAmbulance ? specificAmbulance.id : null,
      };

      const res = await api.post('/emergency/quick_sos', payload);
      toast.success(res.data?.message || '🚨 Dhaka Emergency SOS Dispatched!');
      fetchMyRequests();
      fetchNearestDrivers(selectedArea);
      if (res.data?.request_id) {
        navigate(`/track/${res.data.request_id}`);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'SOS Dispatch failed';
      toast.error(msg);
    } finally {
      setDispatchingId(null);
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      await api.delete(`/emergency/cancel/${id}`);
      toast.success('Emergency request cancelled');
      setCancellingId(null);
      fetchMyRequests();
      fetchNearestDrivers(selectedArea);
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to cancel request';
      toast.error(msg);
    }
  };

  // GPS Detector
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    toast.loading('Detecting your Dhaka GPS location...', { id: 'gps' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss('gps');
        const detected = `GPS (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}) - Dhaka Central`;
        setSelectedArea('Dhanmondi');
        setCustomLocation(detected);
        toast.success('Dhaka GPS detected! Finding nearest ambulances.');
        fetchNearestDrivers('Dhaka');
      },
      () => {
        toast.dismiss('gps');
        toast.error('Unable to retrieve exact location. Selected default Dhaka zone.');
      }
    );
  };

  const getSimulatedETA = (index) => {
    const etas = [
      { dist: '0.9 km away', time: '5-7 mins ETA', color: 'text-success' },
      { dist: '1.5 km away', time: '8-10 mins ETA', color: 'text-success' },
      { dist: '2.2 km away', time: '10-12 mins ETA', color: 'text-primary' },
      { dist: '3.4 km away', time: '12-15 mins ETA', color: 'text-warning' },
      { dist: '4.6 km away', time: '15-18 mins ETA', color: 'text-warning' },
    ];
    return etas[index % etas.length];
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner: 1-Click SOS Action */}
      <section className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col xl:flex-row justify-between items-center gap-6 z-10 relative">
          <div className="space-y-2 text-center xl:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-300">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              Dhaka Live GPS Emergency Dispatcher
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              1-Click Dhaka Emergency Call
            </h1>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl">
              Instant <strong>Uber-style dispatch</strong> across Dhaka North & South. Click your area to see the <strong>5 nearest available drivers</strong>, call them directly, or dispatch immediately.
            </p>
          </div>

          {/* Big Pulsing SOS Button + Hotline */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={() => handleInstantSOS(null)}
              disabled={dispatchingId === 'sos'}
              className="btn btn-warning btn-md sm:btn-lg text-red-900 font-black text-sm sm:text-base shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 px-5 sm:px-6 border-2 sm:border-4 border-white/40"
            >
              <FaAmbulance className="text-xl sm:text-2xl text-red-600 shrink-0" />
              {dispatchingId === 'sos' ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <span>🚨 DISPATCH NEAREST AMBULANCE</span>
              )}
            </button>

            <a
              href="tel:01303446161"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-red-700 btn-md sm:btn-lg font-bold gap-2 whitespace-nowrap shrink-0"
            >
              <FaPhoneVolume /> 01303-446161
            </a>
          </div>
        </div>
      </section>

      {/* Dhaka Hubs Selector */}
      <section className="bg-base-200 p-4 sm:p-6 rounded-3xl border border-base-300 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-error text-xl" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Select Your Dhaka Location</h3>
              <p className="text-xs text-base-content/70">
                Finding available ambulances near <strong>{customLocation || `${selectedArea}, Dhaka`}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={handleDetectGPS}
            className="btn btn-sm btn-outline btn-primary gap-1 font-bold"
          >
            <FaCrosshairs /> Detect My GPS
          </button>
        </div>

        {/* Quick Location Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {dhakaHubs.map((hub) => (
            <button
              key={hub}
              onClick={() => {
                setSelectedArea(hub);
                setCustomLocation('');
              }}
              className={`btn btn-xs sm:btn-sm rounded-full font-medium ${
                selectedArea === hub && !customLocation
                  ? 'btn-error text-white font-bold shadow-md'
                  : 'btn-ghost bg-base-100 hover:bg-base-300'
              }`}
            >
              {hub}
            </button>
          ))}
        </div>
      </section>

      {/* 5 Nearest Drivers Cards (Uber Style with 1-Click Call) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <FaRoute className="text-error" /> 5 Nearest Drivers in {selectedArea}, Dhaka
            </h2>
            {isScanning && (
              <span className="badge badge-error badge-outline animate-pulse text-xs">
                Scanning Dhaka Fleet...
              </span>
            )}
          </div>
          <span className="text-xs text-base-content/60 hidden sm:inline">
            Direct 1-Click Driver Call & Instant Booking
          </span>
        </div>

        {loadingDrivers ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <span className="loading loading-spinner loading-lg text-error"></span>
            <p className="text-xs font-bold text-base-content/60 animate-pulse">
              Locating nearest ambulances in {selectedArea}, Dhaka...
            </p>
          </div>
        ) : nearestDrivers.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-3xl">
            <FaAmbulance className="text-5xl text-base-content/30 mx-auto mb-2" />
            <h4 className="font-bold text-base">No Ambulances Currently Available in This Hub</h4>
            <p className="text-xs opacity-70 mt-1">
              Please click another Dhaka area above or call our 24/7 hotline 01303-446161 directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearestDrivers.slice(0, 5).map((driver, index) => {
              const eta = getSimulatedETA(index);
              return (
                <div
                  key={driver.id}
                  className="card bg-base-100 border-2 border-base-300 hover:border-error shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <div className="card-body p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="badge badge-error badge-outline font-bold text-xs uppercase mb-1">
                          {driver.ambulance_type}
                        </span>
                        <h3 className="font-extrabold text-base">{driver.vehicle_number}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`font-black text-sm ${eta.color}`}>{eta.dist}</div>
                        <div className="text-[11px] text-base-content/60 font-semibold">{eta.time}</div>
                      </div>
                    </div>

                    <div className="bg-base-200 p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-base-content/70">Driver:</span>
                        <span className="font-bold flex items-center gap-1">
                          <FaUserCheck className="text-success" /> {driver.driver_name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-base-content/70">Dhaka Hub:</span>
                        <span className="font-semibold">{driver.base_location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-base-content/70">Fare:</span>
                        <span className="font-black text-success text-sm">৳{driver.base_fare}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${driver.driver_phone}`}
                        className="btn btn-success text-white btn-sm font-bold shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <FaPhoneAlt /> Call Driver
                      </a>

                      <button
                        onClick={() => handleInstantSOS(driver)}
                        disabled={dispatchingId === driver.id}
                        className="btn btn-error text-white btn-sm font-bold shadow-sm flex items-center justify-center gap-1.5"
                      >
                        {dispatchingId === driver.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <FaAmbulance /> Dispatch
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Live Dispatch Tracker & Recent Requests */}
      <section className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaClock className="text-primary" /> Live Dhaka Dispatch Status & Tracker
          </h2>
          <button onClick={fetchMyRequests} className="btn btn-ghost btn-xs">
            Refresh Status
          </button>
        </div>

        {myRequests.length === 0 ? (
          <div className="text-center py-10 bg-base-200 rounded-3xl">
            <p className="text-sm opacity-70">
              You have no active emergency requests. Use the buttons above to request an ambulance in Dhaka.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="card bg-base-100 border border-base-300 shadow-md p-4 sm:p-5 rounded-2xl"
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg">{req.patient_name}</h3>
                      <span className={`badge badge-xs sm:badge-sm font-bold ${req.emergency_severity === 'Critical' ? 'badge-error text-white' : 'badge-warning'}`}>
                        {req.emergency_severity}
                      </span>
                    </div>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Pickup: <strong>{req.pickup_location}</strong> ➔ Destination: <strong>{req.hospital_destination}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`badge font-bold uppercase text-xs ${
                        req.status === 'on_the_way'
                          ? 'badge-warning text-white animate-pulse'
                          : req.status === 'assigned'
                          ? 'badge-info text-white'
                          : req.status === 'completed'
                          ? 'badge-success text-white'
                          : 'badge-ghost'
                      }`}
                    >
                      ● {req.status === 'on_the_way' ? 'Ambulance On The Way' : req.status}
                    </span>

                    <Link
                      to={`/track/${req.id}`}
                      className="btn btn-xs btn-error text-white font-bold gap-1 shadow-sm rounded-lg"
                      title="Open Live GPS Dispatch Tracker"
                    >
                      <FaRoute /> Live Tracker
                    </Link>

                    {req.status === 'pending' && (
                      <button
                        onClick={() => setCancellingId(req.id)}
                        className="btn btn-ghost btn-xs text-error"
                        title="Cancel Request"
                      >
                        <FaTrashAlt />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Step Indicator */}
                <div className="mt-4 pt-3 border-t border-base-200">
                  <ul className="steps steps-horizontal w-full text-xs font-semibold">
                    <li className="step step-error">Requested</li>
                    <li className={`step ${req.status !== 'pending' && req.status !== 'cancelled' ? 'step-error' : ''}`}>
                      Assigned
                    </li>
                    <li className={`step ${req.status === 'on_the_way' || req.status === 'completed' ? 'step-error' : ''}`}>
                      On The Way
                    </li>
                    <li className={`step ${req.status === 'completed' ? 'step-error' : ''}`}>
                      Reached
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between items-center text-xs text-base-content/60 mt-3 pt-2">
                  <span>Requested at: {new Date(req.requested_at).toLocaleTimeString()}</span>
                  {req.total_fare > 0 && (
                    <span className="font-bold text-success text-sm">Fare: ৳{req.total_fare}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cancel Modal */}
      {cancellingId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error flex items-center gap-2">
              <FaExclamationTriangle /> Cancel Emergency Request?
            </h3>
            <p className="py-4 text-sm">
              Are you sure you want to cancel this dispatch request?
            </p>
            <div className="modal-action">
              <button onClick={() => setCancellingId(null)} className="btn btn-ghost btn-sm">
                Keep Active
              </button>
              <button
                onClick={() => handleCancelRequest(cancellingId)}
                className="btn btn-error text-white btn-sm font-bold"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
