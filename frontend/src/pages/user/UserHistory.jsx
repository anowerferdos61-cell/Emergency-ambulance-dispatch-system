import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../layouts/UserLayout';
import {
  FaRoute,
  FaPhoneAlt,
  FaHospital,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaAmbulance,
  FaInfoCircle,
} from 'react-icons/fa';

export const UserHistory = () => {
  const {
    myRequests,
    loadingRequests,
    fetchMyRequests,
    cancellingId,
    setCancellingId,
    handleCancelRequest,
  } = useUser();

  const [filterTab, setFilterTab] = useState('all'); // all, active, completed, cancelled

  const filteredRequests = myRequests.filter((req) => {
    if (filterTab === 'active') {
      return ['pending', 'assigned', 'on_the_way'].includes(req.status);
    }
    if (filterTab === 'completed') {
      return req.status === 'completed';
    }
    if (filterTab === 'cancelled') {
      return req.status === 'cancelled';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Tabs */}
      <div className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">📜 Trip & Booking History</h2>
          <p className="text-xs text-base-content/60">
            View status, live track active dispatches, and manage your ambulance bookings.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-base-200 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setFilterTab('all')}
            className={`btn btn-xs rounded-xl font-bold ${
              filterTab === 'all' ? 'btn-error text-white shadow-sm' : 'btn-ghost'
            }`}
          >
            All ({myRequests.length})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`btn btn-xs rounded-xl font-bold ${
              filterTab === 'active' ? 'btn-error text-white shadow-sm' : 'btn-ghost'
            }`}
          >
            Active ({myRequests.filter((r) => ['pending', 'assigned', 'on_the_way'].includes(r.status)).length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`btn btn-xs rounded-xl font-bold ${
              filterTab === 'completed' ? 'btn-error text-white shadow-sm' : 'btn-ghost'
            }`}
          >
            Completed ({myRequests.filter((r) => r.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilterTab('cancelled')}
            className={`btn btn-xs rounded-xl font-bold ${
              filterTab === 'cancelled' ? 'btn-error text-white shadow-sm' : 'btn-ghost'
            }`}
          >
            Cancelled ({myRequests.filter((r) => r.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loadingRequests ? (
        <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-300">
          <span className="loading loading-dots loading-lg text-error"></span>
          <p className="text-xs font-bold mt-2 text-base-content/60">Loading your history...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-base-100 rounded-3xl border border-base-300 space-y-3">
          <FaClock className="text-5xl text-base-content/30 mx-auto" />
          <h4 className="font-extrabold text-lg">No Dispatches Found in this Category</h4>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            You do not have any requests under the "{filterTab}" filter.
          </p>
          <Link to="/dashboard/dispatch" className="btn btn-error btn-sm text-white font-bold rounded-xl mt-2">
            Dispatch Emergency Ambulance
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isActive = ['pending', 'assigned', 'on_the_way'].includes(req.status);
            return (
              <div
                key={req.id}
                className={`card bg-base-100 border shadow-md rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
                  isActive ? 'border-error ring-1 ring-error/30' : 'border-base-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center font-black text-xl">
                      <FaAmbulance />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base sm:text-lg">
                          Request #{req.id}
                        </h4>
                        <span
                          className={`badge badge-sm font-black capitalize ${
                            req.status === 'completed'
                              ? 'badge-success text-white'
                              : req.status === 'cancelled'
                              ? 'badge-error text-white'
                              : req.status === 'on_the_way'
                              ? 'badge-warning text-black font-extrabold animate-pulse'
                              : 'badge-info text-white'
                          }`}
                        >
                          {req.status?.replace('_', ' ')}
                        </span>
                        {req.is_scheduled && (
                          <span className="badge badge-neutral text-xs font-bold">
                            📅 Scheduled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-base-content/60 font-semibold mt-0.5">
                        Requested: {new Date(req.requested_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/track/${req.id}`}
                      className="btn btn-sm btn-error text-white font-bold shadow-md rounded-xl gap-1.5"
                    >
                      <FaRoute /> Live Track
                    </Link>
                    {isActive && (
                      <button
                        onClick={() => setCancellingId(req.id)}
                        className="btn btn-sm btn-ghost text-error font-bold rounded-xl gap-1"
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Progress Steps */}
                <div className="py-4">
                  {req.status === 'completed' ? (
                    <ul className="steps steps-horizontal w-full text-xs font-bold">
                      <li className="step step-success">Requested</li>
                      <li className="step step-success">Assigned</li>
                      <li className="step step-success">En Route</li>
                      <li className="step step-success">Completed</li>
                    </ul>
                  ) : req.status === 'on_the_way' ? (
                    <ul className="steps steps-horizontal w-full text-xs font-bold">
                      <li className="step step-warning">Requested</li>
                      <li className="step step-warning">Assigned</li>
                      <li className="step step-warning">En Route (Live)</li>
                      <li className="step">Completed</li>
                    </ul>
                  ) : req.status === 'assigned' ? (
                    <ul className="steps steps-horizontal w-full text-xs font-bold">
                      <li className="step step-info">Requested</li>
                      <li className="step step-info">Assigned</li>
                      <li className="step">En Route</li>
                      <li className="step">Completed</li>
                    </ul>
                  ) : req.status === 'cancelled' ? (
                    <ul className="steps steps-horizontal w-full text-xs font-bold">
                      <li className="step step-error">Requested</li>
                      <li className="step step-error">Trip Cancelled</li>
                    </ul>
                  ) : (
                    <ul className="steps steps-horizontal w-full text-xs font-bold">
                      <li className="step step-info">Requested</li>
                      <li className="step">Awaiting Assignment</li>
                      <li className="step">En Route</li>
                      <li className="step">Completed</li>
                    </ul>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-base-200/50 p-4 rounded-2xl text-xs">
                  <div>
                    <span className="text-base-content/60 font-semibold block">Pickup Location:</span>
                    <span className="font-bold flex items-center gap-1 mt-0.5 text-base-content">
                      <FaMapMarkerAlt className="text-error" /> {req.pickup_location}
                    </span>
                  </div>

                  <div>
                    <span className="text-base-content/60 font-semibold block">Destination Hospital:</span>
                    <span className="font-bold flex items-center gap-1 mt-0.5 text-base-content">
                      <FaHospital className="text-primary" /> {req.hospital_destination}
                    </span>
                  </div>

                  <div>
                    <span className="text-base-content/60 font-semibold block">Assigned Vehicle:</span>
                    <span className="font-bold block mt-0.5 text-base-content">
                      {req.vehicle_number || (req.ambulance_id ? `Ambulance #${req.ambulance_id}` : 'Awaiting Assignment')}
                    </span>
                  </div>

                  <div>
                    <span className="text-base-content/60 font-semibold block">Total Fare:</span>
                    <span className="font-black text-success text-sm block mt-0.5">
                      {req.total_fare ? `৳${req.total_fare}` : 'Standard Fare'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingId && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-3xl p-6 border border-base-300 shadow-2xl">
            <div className="flex items-center gap-3 text-error mb-3">
              <FaExclamationTriangle className="text-2xl" />
              <h3 className="font-black text-lg">Cancel Emergency Request?</h3>
            </div>
            <p className="text-xs sm:text-sm text-base-content/80">
              Are you sure you want to cancel request <strong>#{cancellingId}</strong>? If this is an active medical emergency, please ensure alternative support is arranged.
            </p>
            <div className="modal-action mt-6 gap-2">
              <button
                onClick={() => setCancellingId(null)}
                className="btn btn-sm btn-ghost font-bold rounded-xl"
              >
                Keep Request
              </button>
              <button
                onClick={() => handleCancelRequest(cancellingId)}
                className="btn btn-sm btn-error text-white font-bold rounded-xl shadow-md"
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
