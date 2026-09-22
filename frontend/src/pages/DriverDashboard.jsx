import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaHospital,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaIdCard,
  FaCarSide,
  FaMoneyBillWave,
  FaRoute,
  FaShieldAlt,
  FaExclamationTriangle,
  FaRedo,
  FaCheck,
  FaTimes,
  FaUser,
} from 'react-icons/fa';

export const DriverDashboard = () => {
  const { user } = useAuth();
  const [driverProfile, setDriverProfile] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myTripsData, setMyTripsData] = useState({ trips: [], completed_count: 0, total_earnings: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [driverStatus, setDriverStatus] = useState('available');

  const fetchDriverData = async () => {
    try {
      const [profileRes, incomingRes, tripsRes] = await Promise.all([
        api.get('/driver/me'),
        api.get('/driver/incoming_requests'),
        api.get('/driver/my_trips'),
      ]);

      setDriverProfile(profileRes.data || {});
      setIncomingRequests(incomingRes.data || []);
      setMyTripsData(tripsRes.data || { trips: [], completed_count: 0, total_earnings: 0 });
      if (profileRes.data?.ambulance?.status) {
        setDriverStatus(profileRes.data.ambulance.status);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
    const interval = setInterval(fetchDriverData, 6000); // 6s poll for live trips
    return () => clearInterval(interval);
  }, []);

  const handleStatusToggle = async (newStatus) => {
    try {
      await api.put('/driver/status', { status: newStatus });
      setDriverStatus(newStatus);
      toast.success(`Vehicle status set to: ${newStatus}`);
      fetchDriverData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Status update failed';
      toast.error(msg);
    }
  };

  const handleAcceptTrip = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await api.post(`/driver/accept_trip/${requestId}`);
      toast.success(res.data?.message || 'Trip accepted! Proceed to pickup location.');
      fetchDriverData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to accept trip';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancelTrip = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await api.post(`/driver/cancel_trip/${requestId}`);
      toast.success(res.data?.message || 'Trip cancelled and returned to queue');
      fetchDriverData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to cancel trip';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteTrip = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await api.post(`/driver/complete_trip/${requestId}`);
      toast.success(res.data?.message || 'Trip marked as completed! Fare recorded.');
      fetchDriverData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to complete trip';
      toast.error(msg);
    } finally {
      setProcessingId(null);
    }
  };

  // Find active ongoing trip
  const activeTrip = myTripsData.trips.find(
    (t) => t.status === 'on_the_way' || t.status === 'assigned'
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Verification Banner */}
      <div className="bg-base-200 border border-base-300 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-warning text-red-900 font-extrabold uppercase text-xs">
                Driver Portal
              </span>
              {driverProfile?.is_verified ? (
                <span className="badge badge-success text-white font-bold text-xs gap-1">
                  <FaCheckCircle /> Admin Verified
                </span>
              ) : (
                <span className="badge badge-error text-white font-bold text-xs gap-1 animate-pulse">
                  <FaExclamationTriangle /> Verification Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Welcome, {driverProfile?.username || user?.username}!
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70">
              Assigned Vehicle: <strong>{driverProfile?.vehicle_number || 'Default Dhaka Ambulance'}</strong> • License: <strong>{driverProfile?.driving_license || 'Verified'}</strong>
            </p>
          </div>

          {/* Live Vehicle Status Controls */}
          {driverProfile?.is_verified && (
            <div className="flex items-center gap-2 bg-base-100 p-2 rounded-2xl border border-base-300">
              <button
                onClick={() => handleStatusToggle('available')}
                className={`btn btn-xs sm:btn-sm rounded-xl font-bold ${
                  driverStatus === 'available' ? 'btn-success text-white shadow-sm' : 'btn-ghost'
                }`}
              >
                ● Available
              </button>
              <button
                onClick={() => handleStatusToggle('on_trip')}
                className={`btn btn-xs sm:btn-sm rounded-xl font-bold ${
                  driverStatus === 'on_trip' ? 'btn-warning text-white shadow-sm' : 'btn-ghost'
                }`}
              >
                ● On Trip
              </button>
              <button
                onClick={() => handleStatusToggle('maintenance')}
                className={`btn btn-xs sm:btn-sm rounded-xl font-bold ${
                  driverStatus === 'maintenance' ? 'btn-error text-white shadow-sm' : 'btn-ghost'
                }`}
              >
                ● Offline
              </button>
            </div>
          )}
        </div>

        {/* Verification Warning if unverified */}
        {!driverProfile?.is_verified && (
          <div className="alert alert-warning text-xs font-semibold rounded-2xl shadow-sm">
            <FaExclamationTriangle className="text-base" />
            <span>
              Your driver account is under review by Emergency Ambulance Service Dhaka administrators. Once verified, you will automatically receive live emergency patient dispatch requests in your station zone.
            </span>
          </div>
        )}
      </div>

      {/* Driver Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat bg-base-100 border border-base-300 rounded-3xl p-5 shadow-sm">
          <div className="stat-title text-xs font-bold uppercase">Completed Dispatches</div>
          <div className="stat-value text-primary font-black text-3xl">
            {myTripsData.completed_count}
          </div>
          <div className="stat-desc text-xs mt-1">Successful life-saving trips</div>
        </div>

        <div className="stat bg-base-100 border border-base-300 rounded-3xl p-5 shadow-sm">
          <div className="stat-title text-xs font-bold uppercase">Total Fare Recorded</div>
          <div className="stat-value text-success font-black text-3xl">
            ৳{myTripsData.total_earnings}
          </div>
          <div className="stat-desc text-xs mt-1">Trip earnings generated</div>
        </div>

        <div className="stat bg-base-100 border border-base-300 rounded-3xl p-5 shadow-sm">
          <div className="stat-title text-xs font-bold uppercase">Incoming Queue</div>
          <div className="stat-value text-error font-black text-3xl">
            {incomingRequests.filter((r) => r.status === 'pending').length}
          </div>
          <div className="stat-desc text-xs mt-1">Pending patient dispatches</div>
        </div>
      </div>

      {/* Active Ongoing Trip Banner */}
      {activeTrip && (
        <section className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4 border-2 border-yellow-300">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="badge badge-neutral bg-black/40 text-white font-bold text-xs uppercase px-3 py-2">
                Active Ongoing Mission
              </span>
              <span className="badge badge-error text-white font-bold text-xs animate-pulse">
                {activeTrip.emergency_severity}
              </span>
            </div>
            <span className="text-xs font-bold text-white/90">
              Trip ID: #{activeTrip.id}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 backdrop-blur-md p-5 rounded-2xl text-xs sm:text-sm">
            <div className="space-y-1">
              <div className="text-white/70">Patient Information:</div>
              <div className="font-extrabold text-base text-white">{activeTrip.patient_name}</div>
              <a
                href={`tel:${activeTrip.contact_number}`}
                className="btn btn-sm btn-success text-white font-bold gap-1 mt-2 inline-flex"
              >
                <FaPhoneAlt /> Call Patient ({activeTrip.contact_number})
              </a>
            </div>

            <div className="space-y-2">
              <div>
                <strong className="text-red-200">Pickup Location:</strong>
                <p className="font-semibold text-white">{activeTrip.pickup_location}</p>
              </div>
              <div>
                <strong className="text-blue-200">Hospital Destination:</strong>
                <p className="font-semibold text-white">{activeTrip.hospital_destination}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => handleCompleteTrip(activeTrip.id)}
              disabled={processingId === activeTrip.id}
              className="btn btn-neutral bg-black text-white font-black btn-md shadow-lg flex-1 gap-2 hover:bg-black/80"
            >
              <FaCheck /> Mark Patient Reached & Trip Completed
            </button>
            <button
              onClick={() => handleCancelTrip(activeTrip.id)}
              disabled={processingId === activeTrip.id}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-red-700 btn-md font-bold gap-1"
            >
              <FaTimes /> Cancel Trip
            </button>
          </div>
        </section>
      )}

      {/* Live Incoming Emergency Dispatches Queue */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <FaRoute className="text-error" /> Live Emergency Dispatch Requests
            </h2>
            <p className="text-xs text-base-content/60">
              Patients needing urgent ambulance transportation in Dhaka
            </p>
          </div>
          <button onClick={fetchDriverData} className="btn btn-ghost btn-xs gap-1">
            <FaRedo className="text-[10px]" /> Refresh
          </button>
        </div>

        {incomingRequests.filter((r) => r.status === 'pending').length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-3xl border border-base-300">
            <FaAmbulance className="text-5xl text-base-content/30 mx-auto mb-2" />
            <h4 className="font-bold text-base">No Pending Emergency Dispatches</h4>
            <p className="text-xs opacity-70">
              New patient requests in your Dhaka station will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests
              .filter((r) => r.status === 'pending')
              .map((req) => (
                <div
                  key={req.id}
                  className="card bg-base-100 border-2 border-error/40 shadow-md hover:shadow-xl transition-all rounded-2xl p-5 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-lg">{req.patient_name}</h3>
                        <span className={`badge badge-sm font-bold ${req.emergency_severity === 'Critical' ? 'badge-error text-white' : 'badge-warning'}`}>
                          {req.emergency_severity}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/70 mt-0.5">
                        Requested: {new Date(req.requested_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="badge badge-neutral text-xs font-bold">
                      Pending Dispatch
                    </span>
                  </div>

                  <div className="bg-base-200 p-3 rounded-xl space-y-1.5 text-xs">
                    <div>
                      <strong className="text-error">Pickup Point:</strong> {req.pickup_location}
                    </div>
                    <div>
                      <strong className="text-primary">Destination:</strong> {req.hospital_destination}
                    </div>
                    {req.notes && (
                      <div className="text-base-content/70 italic pt-1">
                        Note: {req.notes}
                      </div>
                    )}
                  </div>

                  {/* Accept / Reject Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={`tel:${req.contact_number}`}
                      className="btn btn-outline btn-sm font-bold gap-1"
                    >
                      <FaPhoneAlt /> Call Patient
                    </a>

                    <button
                      onClick={() => handleAcceptTrip(req.id)}
                      disabled={processingId === req.id || !driverProfile?.is_verified}
                      className="btn btn-error text-white btn-sm font-black shadow-md gap-1"
                    >
                      {processingId === req.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <FaCheck /> Accept Trip
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Driver Trip History Table */}
      <section className="space-y-4 pt-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <FaClock className="text-primary" /> My Completed Trip History
        </h3>

        <div className="overflow-x-auto bg-base-100 rounded-3xl border border-base-300">
          <table className="table table-zebra table-sm sm:table-md w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Patient Name</th>
                <th>Route (Pickup ➔ Destination)</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {myTripsData.trips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 opacity-60">
                    No completed trips yet.
                  </td>
                </tr>
              ) : (
                myTripsData.trips.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono font-bold">#{t.id}</td>
                    <td className="font-bold">{t.patient_name}</td>
                    <td>
                      <div>{t.pickup_location} ➔ {t.hospital_destination}</div>
                    </td>
                    <td className="font-bold text-success">৳{t.total_fare}</td>
                    <td>
                      <span className={`badge badge-sm font-bold ${t.status === 'completed' ? 'badge-success text-white' : 'badge-ghost'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {new Date(t.requested_at).toLocaleDateString()} {new Date(t.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
