import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../layouts/UserLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaMapMarkerAlt,
  FaHospital,
  FaPhoneAlt,
  FaRoute,
  FaCheckCircle,
  FaCrosshairs,
  FaClock,
} from 'react-icons/fa';

export const UserDispatch = () => {
  const { user } = useAuth();
  const { dhakaHubs, fetchMyRequests } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState(dhakaHubs[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [nearestDrivers, setNearestDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);

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

  const [selectedHospital, setSelectedHospital] = useState(dhakaHospitals[0]);

  const fetchNearestDrivers = async (location) => {
    setLoadingDrivers(true);
    setIsScanning(true);
    try {
      const res = await api.get(`/ambulances/nearest?location=${encodeURIComponent(location)}`);
      if (res.data?.drivers && res.data.drivers.length > 0) {
        setNearestDrivers(res.data.drivers);
      } else {
        // Fallback to query all available ambulances
        const allRes = await api.get(`/ambulances/all?limit=20&status=available`);
        setNearestDrivers(allRes.data?.data || []);
      }
    } catch (error) {
      console.warn('Nearest endpoint failed, falling back to catalog:', error);
      try {
        const allRes = await api.get(`/ambulances/all?limit=20&status=available`);
        setNearestDrivers(allRes.data?.data || []);
      } catch (err2) {
        console.error('All ambulances fallback failed', err2);
        toast.error('Could not load ambulances in this area');
      }
    } finally {
      setLoadingDrivers(false);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchNearestDrivers(selectedArea);
  }, [selectedArea]);

  const handleInstantDispatch = async (ambulanceId, vehicleNo, baseFare) => {
    setDispatchingId(ambulanceId);
    try {
      const pickup = customLocation.trim() ? customLocation : `${selectedArea}, Dhaka`;
      const res = await api.post('/emergency/request', {
        patient_name: user?.username || 'Emergency Patient',
        contact_number: user?.phone_number || '01303-446161',
        pickup_location: pickup,
        hospital_destination: selectedHospital,
        destination_hospital: selectedHospital,
        emergency_severity: 'Urgent',
        notes: `Instant Direct Dispatch for ${vehicleNo || 'Ambulance'}`,
        ambulance_id: ambulanceId,
        is_scheduled: false,
      });

      toast.success(res.data?.message || 'Emergency ambulance dispatched!', { icon: '🚨' });
      fetchMyRequests();

      const reqId = res.data?.request_id || res.data?.id;
      if (reqId) {
        navigate(`/track/${reqId}`);
      } else {
        navigate('/dashboard/history');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Failed to dispatch ambulance';
      toast.error(msg);
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location & Hospital Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Dhaka Hub Selector */}
        <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-base-content">
            <FaMapMarkerAlt className="text-error" /> Select Dhaka Area Hub
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {dhakaHubs.map((hub) => (
              <button
                key={hub}
                onClick={() => setSelectedArea(hub)}
                className={`btn btn-xs rounded-xl font-bold justify-start text-xs ${
                  selectedArea === hub
                    ? 'btn-error text-white shadow-sm'
                    : 'btn-ghost bg-base-200/60 hover:bg-base-300'
                }`}
              >
                📍 {hub}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-base-300">
            <label className="text-xs font-bold text-base-content/70">Custom Pickup Landmark</label>
            <input
              type="text"
              placeholder="e.g. House 14, Road 7, Dhanmondi"
              className="input input-bordered input-sm w-full text-xs font-medium"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Destination Hospital */}
        <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-base-content">
                <FaHospital className="text-primary" /> Destination Hospital in Dhaka
              </div>
              <span className="badge badge-primary badge-outline text-xs font-bold">24/7 ER Ready</span>
            </div>

            <select
              className="select select-bordered select-sm sm:select-md w-full font-semibold text-xs sm:text-sm"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              {dhakaHospitals.map((hosp) => (
                <option key={hosp} value={hosp}>
                  🏥 {hosp}
                </option>
              ))}
            </select>

            <div className="bg-base-200/60 p-3.5 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-base-content flex items-center gap-1.5">
                <FaCheckCircle className="text-success" /> Dispatch Summary:
              </p>
              <p className="text-base-content/70">
                <strong>Pickup:</strong> {customLocation.trim() ? customLocation : `${selectedArea}, Dhaka`}
              </p>
              <p className="text-base-content/70">
                <strong>Destination:</strong> {selectedHospital}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-base-300 text-xs">
            <span className="text-base-content/60">Live Radar Status:</span>
            <span className="font-bold text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-ping inline-block"></span>
              {nearestDrivers.length} Available Ambulances in {selectedArea}
            </span>
          </div>
        </div>
      </div>

      {/* Nearest Ambulances in Selected Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
            <span>Available Emergency Ambulances in {selectedArea}</span>
            {isScanning && <span className="loading loading-spinner loading-xs text-error"></span>}
          </h3>
          <button
            onClick={() => fetchNearestDrivers(selectedArea)}
            className="btn btn-ghost btn-xs font-bold text-error"
          >
            Refresh Radar
          </button>
        </div>

        {loadingDrivers ? (
          <div className="text-center py-12 bg-base-100 rounded-3xl border border-base-300">
            <span className="loading loading-dots loading-lg text-error"></span>
            <p className="text-xs font-bold mt-2 text-base-content/60">Scanning GPS coordinates in {selectedArea}...</p>
          </div>
        ) : nearestDrivers.length === 0 ? (
          <div className="text-center py-12 bg-base-100 rounded-3xl border border-base-300 space-y-2">
            <FaAmbulance className="text-4xl text-base-content/30 mx-auto" />
            <h4 className="font-bold text-base">No Ambulances Currently Idle in {selectedArea}</h4>
            <p className="text-xs text-base-content/60 max-w-md mx-auto">
              All fleet units in {selectedArea} are on active duty. Please call our 24/7 Dhaka Hotline at 01303-446161 for instant priority routing.
            </p>
            <a href="tel:01303446161" className="btn btn-primary btn-sm rounded-xl font-bold gap-2 mt-2">
              <FaPhoneAlt /> Call 24/7 Hotline
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearestDrivers.map((amb) => (
              <div
                key={amb.id}
                className="card bg-base-100 border border-base-300 shadow-md hover:border-error hover:shadow-xl transition-all duration-300 rounded-3xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="badge badge-error badge-outline font-extrabold text-[10px] uppercase">
                      {amb.ambulance_type}
                    </span>
                    <h4 className="font-black text-base mt-1">{amb.vehicle_number}</h4>
                  </div>
                  <span className="badge badge-success text-white text-[10px] font-bold">
                    ● Available
                  </span>
                </div>

                <div className="bg-base-200/70 p-3 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Driver:</span>
                    <span className="font-bold">{amb.driver_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Contact:</span>
                    <span className="font-bold text-primary">{amb.driver_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Base Fare:</span>
                    <span className="font-black text-success text-sm">৳{amb.base_fare}</span>
                  </div>
                </div>

                <button
                  disabled={dispatchingId === amb.id}
                  onClick={() => handleInstantDispatch(amb.id, amb.vehicle_number, amb.base_fare)}
                  className="btn btn-error text-white font-extrabold w-full rounded-2xl shadow-md gap-2"
                >
                  {dispatchingId === amb.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <FaAmbulance /> ⚡ Confirm Direct Dispatch
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDispatch;
