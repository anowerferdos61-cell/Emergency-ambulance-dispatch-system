import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../layouts/UserLayout';
import {
  FaAmbulance,
  FaRoute,
  FaPhoneAlt,
  FaHospital,
  FaHistory,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaHeartbeat,
  FaSnowflake,
  FaWind,
  FaArrowRight,
} from 'react-icons/fa';

export const UserOverview = () => {
  const { user } = useAuth();
  const { myRequests, activeRequest, stats, dhakaHubs } = useUser();

  const emergencyServices = [
    {
      title: 'ICU Life Support Ambulance',
      type: 'ICU',
      icon: FaHeartbeat,
      desc: 'Ventilator, Cardiac Monitor, Defibrillator & Paramedic on board.',
      fare: '৳4,500',
      color: 'border-error/30 hover:border-error bg-error/5 text-error',
    },
    {
      title: 'AC Emergency Ambulance',
      type: 'AC',
      icon: FaWind,
      desc: 'Air conditioned, full oxygen cylinder, emergency stretcher.',
      fare: '৳2,500',
      color: 'border-info/30 hover:border-info bg-info/5 text-info',
    },
    {
      title: 'Basic / Non-AC Ambulance',
      type: 'Non-AC',
      icon: FaAmbulance,
      desc: 'Rapid patient transfer across all areas in Dhaka.',
      fare: '৳1,800',
      color: 'border-warning/30 hover:border-warning bg-warning/5 text-warning',
    },
    {
      title: 'Freezer Van (Mortuary)',
      type: 'Freezer',
      icon: FaSnowflake,
      desc: 'Temperature controlled dead body carrier across Bangladesh.',
      fare: '৳4,000',
      color: 'border-primary/30 hover:border-primary bg-primary/5 text-primary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. ACTIVE RUNNING TRIP BANNER */}
      {activeRequest && (
        <div className="bg-gradient-to-r from-error/90 to-red-700 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="badge badge-warning font-black text-xs uppercase animate-pulse">
                  🚨 LIVE TRIP IN PROGRESS
                </span>
                <span className="text-xs opacity-80">Request #{activeRequest.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Ambulance En Route to Destination
              </h2>
              <p className="text-xs opacity-90">
                <strong>Pickup:</strong> {activeRequest.pickup_location} ➔{' '}
                <strong>Hospital:</strong> {activeRequest.hospital_destination}
              </p>
            </div>
            <Link
              to={`/track/${activeRequest.id}`}
              className="btn btn-warning text-black font-black shadow-lg gap-2 rounded-2xl w-full sm:w-auto"
            >
              <FaRoute className="animate-spin" /> Live Track Ambulance
            </Link>
          </div>
        </div>
      )}

      {/* 2. USER WELCOME & QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md border border-base-300 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60 font-bold uppercase">Total Dispatches</p>
              <h3 className="text-2xl sm:text-3xl font-black text-base-content mt-1">{stats.total}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center text-xl font-black">
              <FaAmbulance />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60 font-bold uppercase">Active Trips</p>
              <h3 className="text-2xl sm:text-3xl font-black text-error mt-1">{stats.active}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center text-xl font-black">
              <FaRoute />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60 font-bold uppercase">Completed</p>
              <h3 className="text-2xl sm:text-3xl font-black text-success mt-1">{stats.completed}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center text-xl font-black">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md border border-base-300 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-base-content/60 font-bold uppercase">24/7 Hotline</p>
              <a href="tel:01303446161" className="text-base sm:text-lg font-black text-primary hover:underline block mt-1">
                01303-446161
              </a>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
              <FaPhoneAlt />
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK 1-CLICK DISPATCH OPTIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black tracking-tight">
            ⚡ Quick Emergency Ambulance Dispatch
          </h3>
          <Link to="/dashboard/dispatch" className="text-xs font-bold text-error hover:underline flex items-center gap-1">
            Open Full Dispatch Console <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className={`card bg-base-100 border shadow-sm rounded-2xl p-4 space-y-3 hover:shadow-lg transition-all duration-300 ${srv.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-base-100 shadow-sm">
                    <Icon className="text-xl" />
                  </div>
                  <span className="badge badge-neutral text-xs font-black">{srv.fare}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-base-content">{srv.title}</h4>
                  <p className="text-[11px] text-base-content/70 mt-1 line-clamp-2">{srv.desc}</p>
                </div>
                <Link
                  to={`/dashboard/dispatch?type=${srv.type}`}
                  className="btn btn-sm btn-error text-white font-bold w-full rounded-xl gap-1 text-xs"
                >
                  <FaAmbulance className="text-xs" /> Dispatch Now
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECENT ACTIVITY PREVIEW */}
      <div className="card bg-base-100 shadow-md border border-base-300 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">Recent Dispatches & Bookings</h3>
            <p className="text-xs text-base-content/60">Your latest emergency and scheduled requests in Dhaka</p>
          </div>
          <Link to="/dashboard/history" className="btn btn-ghost btn-xs font-bold text-error">
            View All ({myRequests.length})
          </Link>
        </div>

        {myRequests.length === 0 ? (
          <div className="text-center py-10 bg-base-200/50 rounded-2xl space-y-2">
            <FaClock className="text-4xl text-base-content/30 mx-auto" />
            <h4 className="font-bold text-sm">No Emergency Dispatches Yet</h4>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Whenever you book or dispatch an ambulance, live status updates and receipts will appear here.
            </p>
            <Link to="/dashboard/dispatch" className="btn btn-error btn-xs text-white font-bold rounded-xl mt-2">
              Dispatch First Ambulance
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-base-300 text-xs text-base-content/60 uppercase">
                  <th>ID</th>
                  <th>Ambulance / Driver</th>
                  <th>Destination Hospital</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.slice(0, 4).map((req) => (
                  <tr key={req.id} className="hover:bg-base-200/40 border-base-300 text-xs">
                    <td className="font-black text-error">#{req.id}</td>
                    <td>
                      <div className="font-bold">{req.ambulance_type || 'Standard'}</div>
                      <div className="text-[10px] text-base-content/60">{req.vehicle_number || 'Auto-assigned'}</div>
                    </td>
                    <td className="font-medium max-w-xs truncate">{req.hospital_destination}</td>
                    <td className="text-base-content/70">
                      {req.booking_date || new Date(req.requested_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`badge badge-xs font-extrabold capitalize ${
                          req.status === 'completed'
                            ? 'badge-success text-white'
                            : req.status === 'cancelled'
                            ? 'badge-error text-white'
                            : req.status === 'on_the_way'
                            ? 'badge-warning'
                            : 'badge-info text-white'
                        }`}
                      >
                        {req.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/track/${req.id}`}
                        className="btn btn-xs btn-outline btn-error font-bold rounded-lg gap-1"
                      >
                        <FaRoute className="text-[10px]" /> Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
