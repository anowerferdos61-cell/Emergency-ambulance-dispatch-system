import { useState } from 'react';
import { useAdmin } from '../../layouts/AdminLayout';
import {
  FaRoute,
  FaAmbulance,
} from 'react-icons/fa';

export const AdminRequests = () => {
  const {
    requests,
    ambulances,
    assigningReq,
    setAssigningReq,
    handleUpdateStatus,
    handleAssignVehicle,
  } = useAdmin();

  const [requestFilter, setRequestFilter] = useState('');

  const filteredRequests = requests.filter((r) => {
    if (!requestFilter) return true;
    if (requestFilter === 'scheduled') return Boolean(r.is_scheduled);
    if (requestFilter === 'immediate') return !r.is_scheduled;
    return r.status === requestFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar & Filter Tabs */}
      <div className="bg-base-200 p-4 rounded-3xl border border-base-300 flex flex-wrap gap-3 justify-between items-center shadow-sm">
        <h3 className="font-extrabold text-base flex items-center gap-2">
          <FaRoute className="text-error" /> Live Emergency & Scheduled Requests ({requests.length})
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setRequestFilter('')}
            className={`btn btn-xs sm:btn-sm font-bold ${
              requestFilter === '' ? 'btn-error text-white' : 'btn-ghost'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setRequestFilter('immediate')}
            className={`btn btn-xs sm:btn-sm font-bold ${
              requestFilter === 'immediate' ? 'btn-error text-white' : 'btn-ghost'
            }`}
          >
            ⚡ Immediate ({requests.filter((r) => !r.is_scheduled).length})
          </button>
          <button
            onClick={() => setRequestFilter('scheduled')}
            className={`btn btn-xs sm:btn-sm font-bold ${
              requestFilter === 'scheduled' ? 'btn-info text-white' : 'btn-ghost'
            }`}
          >
            📅 Scheduled ({requests.filter((r) => Boolean(r.is_scheduled)).length})
          </button>
          <button
            onClick={() => setRequestFilter('pending')}
            className={`btn btn-xs sm:btn-sm font-bold ${
              requestFilter === 'pending' ? 'btn-warning text-red-950' : 'btn-ghost'
            }`}
          >
            Pending ({requests.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setRequestFilter('assigned')}
            className={`btn btn-xs sm:btn-sm font-bold ${
              requestFilter === 'assigned' ? 'btn-error text-white' : 'btn-ghost'
            }`}
          >
            Assigned
          </button>
          <button
            onClick={() => setRequestFilter('completed')}
            className={`btn btn-xs sm:btn-sm font-bold ${
              requestFilter === 'completed' ? 'btn-success text-white' : 'btn-ghost'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-base-200 border border-base-300 rounded-3xl p-3 sm:p-5 shadow-sm">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table table-zebra w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-base-300">
                <th>Patient Details</th>
                <th>Route / Hospital</th>
                <th>Booking Type / Date</th>
                <th>Severity</th>
                <th>Assigned Fleet</th>
                <th>Status</th>
                <th className="text-right">Dispatch Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 opacity-60">
                    No emergency requests found for this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover">
                    <td>
                      <div className="font-bold flex items-center gap-1.5">
                        {req.patient_name}
                        {req.is_guest && (
                          <span className="badge badge-xs badge-neutral opacity-80">Guest</span>
                        )}
                      </div>
                      <div className="text-xs text-base-content/60 font-mono">{req.contact_number}</div>
                    </td>
                    <td className="max-w-xs">
                      <div className="font-medium truncate"><strong className="text-error">From:</strong> {req.pickup_location}</div>
                      <div className="text-xs text-base-content/70 truncate"><strong className="text-primary">To:</strong> {req.hospital_destination}</div>
                    </td>
                    <td>
                      {req.is_scheduled ? (
                        <div className="badge badge-sm badge-info text-white font-bold gap-1">
                          📅 {req.booking_date || 'Scheduled'}
                        </div>
                      ) : (
                        <div className="badge badge-sm badge-error text-white font-bold gap-1">
                          ⚡ Immediate
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-bold ${
                          req.emergency_severity === 'Critical'
                            ? 'badge-error text-white'
                            : 'badge-warning text-red-900'
                        }`}
                      >
                        {req.emergency_severity}
                      </span>
                    </td>
                    <td>
                      {req.ambulance_id ? (
                        <span className="badge badge-sm badge-success text-white font-bold">
                          Vehicle #{req.ambulance_id}
                        </span>
                      ) : (
                        <button
                          onClick={() => setAssigningReq(req)}
                          className="btn btn-xs btn-outline btn-error font-bold"
                        >
                          Assign Fleet
                        </button>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm uppercase font-bold ${
                          req.status === 'completed'
                            ? 'badge-success text-white'
                            : req.status === 'pending'
                            ? 'badge-error text-white'
                            : 'badge-info text-white'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex gap-1">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => setAssigningReq(req)}
                            className="btn btn-xs btn-primary font-bold shadow-sm"
                          >
                            {req.is_scheduled ? 'Assign Vehicle' : 'Dispatch'}
                          </button>
                        )}
                        {req.status !== 'completed' && req.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'completed')}
                            className="btn btn-xs btn-success text-white font-bold"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredRequests.length === 0 ? (
            <div className="col-span-full text-center py-8 opacity-60 text-xs">
              No requests found.
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-extrabold text-sm">{req.patient_name}</div>
                    <div className="text-base-content/60 font-mono text-[11px]">{req.contact_number}</div>
                  </div>
                  <span
                    className={`badge badge-xs font-bold uppercase ${
                      req.status === 'completed'
                        ? 'badge-success text-white'
                        : req.status === 'pending'
                        ? 'badge-error text-white'
                        : 'badge-info text-white'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="bg-base-200 p-2.5 rounded-xl space-y-1">
                  <div className="truncate"><strong>From:</strong> {req.pickup_location}</div>
                  <div className="truncate"><strong>To:</strong> {req.hospital_destination}</div>
                  <div className="flex justify-between pt-1">
                    <span>Severity: <strong className="text-error">{req.emergency_severity}</strong></span>
                    {req.ambulance_id && (
                      <span className="text-success font-bold">Vehicle #{req.ambulance_id}</span>
                    )}
                  </div>
                  {req.is_scheduled && (
                    <div className="text-info font-bold text-[11px]">
                      📅 Scheduled Date: {req.booking_date}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-end gap-2 pt-1 border-t border-base-200">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => setAssigningReq(req)}
                      className="btn btn-error btn-xs text-white font-bold"
                    >
                      {req.is_scheduled ? 'Assign Ambulance' : 'Dispatch Ambulance'}
                    </button>
                  )}
                  {req.status !== 'completed' && req.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'completed')}
                      className="btn btn-success btn-xs text-white font-bold"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- ASSIGN AMBULANCE MODAL --- */}
      {assigningReq && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg rounded-3xl p-5 sm:p-7">
            <h3 className="font-extrabold text-lg mb-2 text-primary flex items-center gap-2">
              <FaAmbulance /> Dispatch Ambulance to Patient
            </h3>
            <div className="bg-base-200 p-3.5 rounded-2xl text-xs space-y-1.5 mb-4 border border-base-300">
              <div>
                <strong>Patient:</strong> {assigningReq.patient_name} ({assigningReq.contact_number})
              </div>
              <div>
                <strong className="text-error">Pickup:</strong> {assigningReq.pickup_location}
              </div>
              <div>
                <strong className="text-primary">Destination:</strong> {assigningReq.hospital_destination}
              </div>
              {assigningReq.is_scheduled && (
                <div>
                  <strong className="text-info">Target Date:</strong> {assigningReq.booking_date}
                </div>
              )}
            </div>

            <p className="text-xs font-bold text-base-content/70 mb-2">Available Dhaka Ambulances:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {ambulances.filter((a) => a.status === 'available').length === 0 ? (
                <div className="text-center py-6 text-xs opacity-60">
                  No ambulances currently available for dispatch.
                </div>
              ) : (
                ambulances
                  .filter((a) => a.status === 'available')
                  .map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleAssignVehicle(assigningReq.id, a.id)}
                      className="p-3 bg-base-100 border border-base-300 rounded-2xl flex justify-between items-center hover:border-primary hover:bg-primary/5 cursor-pointer text-xs transition"
                    >
                      <div>
                        <div className="font-extrabold text-sm text-error font-mono">{a.vehicle_number}</div>
                        <div className="text-[11px] text-base-content/70">
                          {a.ambulance_type} • {a.base_location} (Driver: {a.driver_name})
                        </div>
                      </div>
                      <button className="btn btn-xs btn-primary font-bold shadow-sm">
                        Assign Now
                      </button>
                    </div>
                  ))
              )}
            </div>

            <div className="modal-action mt-4">
              <button
                onClick={() => setAssigningReq(null)}
                className="btn btn-ghost btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
