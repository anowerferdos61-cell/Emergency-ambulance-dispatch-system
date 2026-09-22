import { Link } from 'react-router-dom';
import { useAdmin } from '../../layouts/AdminLayout';
import {
  FaAmbulance,
  FaCheckCircle,
  FaClock,
  FaRoute,
  FaIdCard,
  FaArrowRight,
  FaPlus,
} from 'react-icons/fa';

export const AdminOverview = () => {
  const {
    stats,
    requests,
    driversList,
    pendingDriversCount,
    setAssigningReq,
  } = useAdmin();

  return (
    <div className="space-y-6">
      {/* 1. Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold uppercase text-base-content/60">Total Fleet</span>
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl text-xl">
              <FaAmbulance />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-4xl font-black text-primary">{stats.total_ambulances}</div>
            <p className="text-[11px] text-base-content/60 mt-0.5">Vehicles in Dhaka network</p>
          </div>
        </div>

        <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold uppercase text-base-content/60">Available Now</span>
            <div className="p-2.5 bg-success/10 text-success rounded-2xl text-xl">
              <FaCheckCircle />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-4xl font-black text-success">{stats.available_ambulances}</div>
            <p className="text-[11px] text-base-content/60 mt-0.5">Ready for instant dispatch</p>
          </div>
        </div>

        <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold uppercase text-base-content/60">Pending Calls</span>
            <div className="p-2.5 bg-error/10 text-error rounded-2xl text-xl">
              <FaClock />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-4xl font-black text-error">{stats.pending_requests}</div>
            <p className="text-[11px] text-base-content/60 mt-0.5">Awaiting driver assignment</p>
          </div>
        </div>

        <div className="bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs font-extrabold uppercase text-base-content/60">Completed Trips</span>
            <div className="p-2.5 bg-info/10 text-info rounded-2xl text-xl">
              <FaRoute />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-4xl font-black text-info">{stats.completed_requests}</div>
            <p className="text-[11px] text-base-content/60 mt-0.5">Safe patient transfers</p>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Urgent Requests Panel */}
        <div className="card bg-base-200 border border-base-300 shadow-sm p-5 rounded-3xl">
          <h3 className="font-extrabold text-base sm:text-lg mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FaRoute className="text-error" /> Urgent Dispatch Queue
            </span>
            <Link
              to="/admin/requests"
              className="btn btn-ghost btn-xs text-error font-bold gap-1"
            >
              View All ({requests.length}) <FaArrowRight className="text-[10px]" />
            </Link>
          </h3>

          {requests.slice(0, 4).length === 0 ? (
            <div className="text-center py-8 text-xs text-base-content/60">
              No emergency requests currently active.
            </div>
          ) : (
            <div className="space-y-2.5">
              {requests.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="bg-base-100 p-3.5 rounded-2xl border border-base-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm">{r.patient_name}</span>
                      <span
                        className={`badge badge-xs ${
                          r.emergency_severity === 'Critical'
                            ? 'badge-error text-white'
                            : 'badge-warning'
                        }`}
                      >
                        {r.emergency_severity}
                      </span>
                      {r.is_scheduled && (
                        <span className="badge badge-xs badge-info text-white font-bold">
                          📅 Scheduled
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-base-content/70">
                      {r.pickup_location} ➔ {r.hospital_destination}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`badge badge-sm font-bold uppercase ${
                        r.status === 'completed'
                          ? 'badge-success text-white'
                          : r.status === 'pending'
                          ? 'badge-error text-white'
                          : 'badge-info text-white'
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.status === 'pending' && (
                      <button
                        onClick={() => setAssigningReq(r)}
                        className="btn btn-xs btn-primary font-bold"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Drivers Panel */}
        <div className="card bg-base-200 border border-base-300 shadow-sm p-5 rounded-3xl">
          <h3 className="font-extrabold text-base sm:text-lg mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FaIdCard className="text-warning" /> Pending Driver Approvals
            </span>
            <Link
              to="/admin/drivers"
              className="btn btn-ghost btn-xs text-warning font-bold gap-1"
            >
              Review ({pendingDriversCount}) <FaArrowRight className="text-[10px]" />
            </Link>
          </h3>

          {driversList.filter((d) => !d.is_verified).slice(0, 4).length === 0 ? (
            <div className="text-center py-8 text-xs text-base-content/60">
              All registered ambulance drivers are verified!
            </div>
          ) : (
            <div className="space-y-2.5">
              {driversList
                .filter((d) => !d.is_verified)
                .slice(0, 4)
                .map((drv) => (
                  <div
                    key={drv.id}
                    className="bg-base-100 p-3.5 rounded-2xl border border-base-300 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{drv.username}</div>
                      <div className="text-xs text-base-content/60 font-mono">
                        License: {drv.driving_license || 'Pending submission'}
                      </div>
                    </div>
                    <Link
                      to="/admin/drivers"
                      className="btn btn-xs btn-warning text-red-950 font-black shadow-sm"
                    >
                      Verify
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
