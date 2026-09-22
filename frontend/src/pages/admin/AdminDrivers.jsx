import { useState } from 'react';
import { useAdmin } from '../../layouts/AdminLayout';
import { FaIdCard } from 'react-icons/fa';

export const AdminDrivers = () => {
  const {
    driversList,
    pendingDriversCount,
    handleToggleDriverVerification,
  } = useAdmin();

  const [driverFilter, setDriverFilter] = useState('all');

  const filteredDrivers = driversList.filter((d) => {
    if (driverFilter === 'pending') return !d.is_verified;
    if (driverFilter === 'verified') return d.is_verified;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-base-200 p-4 rounded-3xl border border-base-300 flex flex-wrap gap-3 justify-between items-center shadow-sm">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
            <FaIdCard className="text-warning text-xl" /> Driver Registration & License Review
          </h3>
          <p className="text-xs text-base-content/60">
            Approve or revoke driver accounts to manage who can receive ambulance dispatch alerts.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDriverFilter('all')}
            className={`btn btn-xs sm:btn-sm font-bold ${driverFilter === 'all' ? 'btn-error text-white' : 'btn-ghost'}`}
          >
            All ({driversList.length})
          </button>
          <button
            onClick={() => setDriverFilter('pending')}
            className={`btn btn-xs sm:btn-sm font-bold ${driverFilter === 'pending' ? 'btn-warning text-red-900' : 'btn-ghost'}`}
          >
            Pending ({pendingDriversCount})
          </button>
          <button
            onClick={() => setDriverFilter('verified')}
            className={`btn btn-xs sm:btn-sm font-bold ${driverFilter === 'verified' ? 'btn-success text-white' : 'btn-ghost'}`}
          >
            Verified
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-base-200 border border-base-300 rounded-3xl p-3 sm:p-5 shadow-sm">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table table-zebra w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-base-300">
                <th>Driver Username</th>
                <th>Contact Info</th>
                <th>Driving License</th>
                <th>Ambulance Vehicle</th>
                <th>Station Hub</th>
                <th>Fleet Status</th>
                <th className="text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 opacity-60">
                    No drivers matching this filter.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((drv) => (
                  <tr key={drv.id} className="hover">
                    <td className="font-extrabold">{drv.username}</td>
                    <td>
                      <div>{drv.phone_number}</div>
                      <div className="text-xs text-base-content/60">{drv.email}</div>
                    </td>
                    <td>
                      <span className="font-mono font-bold bg-base-100 border border-base-300 px-2.5 py-1 rounded-lg">
                        {drv.driving_license || 'Not provided'}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold text-primary font-mono text-xs">
                        {drv.vehicle_number || 'Default Fleet'}
                      </div>
                      <div className="text-[11px] text-base-content/70 font-semibold">
                        {drv.ambulance_type || 'AC Ambulance'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-ghost font-bold">
                        {drv.base_location || 'Dhanmondi'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm font-bold ${
                          drv.is_verified ? 'badge-success text-white' : 'badge-warning text-red-900'
                        }`}
                      >
                        {drv.is_verified ? '✓ Active Fleet' : '⏳ Pending Approval'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleToggleDriverVerification(drv.id)}
                        className={`btn btn-xs font-bold ${
                          drv.is_verified
                            ? 'btn-outline btn-error'
                            : 'btn-success text-white shadow-sm'
                        }`}
                      >
                        {drv.is_verified ? 'Suspend Driver' : '✓ Approve & Activate Ambulance'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredDrivers.length === 0 ? (
            <div className="col-span-full text-center py-8 opacity-60 text-xs">
              No drivers found.
            </div>
          ) : (
            filteredDrivers.map((drv) => (
              <div
                key={drv.id}
                className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-extrabold text-sm">{drv.username}</div>
                    <div className="text-base-content/60 text-[11px]">{drv.phone_number}</div>
                  </div>
                  <span
                    className={`badge badge-xs font-bold ${
                      drv.is_verified ? 'badge-success text-white' : 'badge-warning text-red-900'
                    }`}
                  >
                    {drv.is_verified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>

                <div className="bg-base-200 p-2.5 rounded-xl space-y-1 text-xs">
                  <div><strong>License:</strong> <span className="font-mono font-bold">{drv.driving_license || 'N/A'}</span></div>
                  <div><strong>Vehicle:</strong> <span className="font-mono text-primary font-bold">{drv.vehicle_number || 'Standard'}</span> ({drv.ambulance_type || 'AC Ambulance'})</div>
                  <div><strong>Hub:</strong> <span className="font-semibold text-base-content">{drv.base_location || 'Dhanmondi'}</span></div>
                  <div className="text-[11px] text-base-content/60">{drv.email}</div>
                </div>

                <div className="pt-1 border-t border-base-200 flex justify-end">
                  <button
                    onClick={() => handleToggleDriverVerification(drv.id)}
                    className={`btn btn-xs w-full font-bold ${
                      drv.is_verified ? 'btn-outline btn-error' : 'btn-success text-white shadow-sm'
                    }`}
                  >
                    {drv.is_verified ? 'Suspend Driver' : '✓ Approve & Activate Ambulance'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDrivers;
