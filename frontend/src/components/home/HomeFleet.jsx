import React from 'react';
import { FaAmbulance, FaSearch, FaLock } from 'react-icons/fa';

export const HomeFleet = ({
  ambulances,
  loading,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  zoneFilter,
  setZoneFilter,
  page,
  setPage,
  totalPages,
  user,
  onDirectDispatch,
  onEmergencyNonLogin,
  onScheduleClick,
}) => {
  return (
    <section className="space-y-6 pt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-200 p-5 sm:p-6 rounded-3xl border border-base-300 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <FaAmbulance className="text-error" /> Available Dhaka Ambulance Fleet
          </h2>
          <p className="text-xs sm:text-sm opacity-70">
            Live available ambulances in Dhaka City • <strong>Login required for online booking & dispatch</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <input
              type="text"
              placeholder="Search plate or driver..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input input-bordered input-sm sm:input-md w-full pl-9 text-xs sm:text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
          </div>

          {/* Type Filter */}
          <select
            className="select select-bordered select-sm sm:select-md text-xs sm:text-sm"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="AC Ambulance">AC Ambulance</option>
            <option value="Non-AC Ambulance">Non-AC Ambulance</option>
            <option value="ICU Ambulance">ICU Ambulance</option>
            <option value="Freezer Van">Freezer Van</option>
          </select>

          {zoneFilter && (
            <button
              onClick={() => {
                setZoneFilter('');
                setPage(1);
              }}
              className="btn btn-xs btn-outline btn-error"
            >
              Clear Zone: {zoneFilter} ✕
            </button>
          )}
        </div>
      </div>

      {/* Ambulance Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-bars loading-lg text-error"></span>
        </div>
      ) : ambulances.length === 0 ? (
        <div className="text-center py-16 bg-base-200 rounded-3xl">
          <FaAmbulance className="text-5xl text-base-content/30 mx-auto mb-3" />
          <h4 className="font-bold text-lg">No Ambulances Found in This Area</h4>
          <p className="text-xs opacity-70">Try selecting another Dhaka area or call our 24/7 hotline 01303-446161.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ambulances.map((amb) => (
              <div
                key={amb.id}
                className="card bg-base-100 shadow-md border border-base-300 hover:border-error hover:shadow-xl transition-all duration-300 rounded-2xl"
              >
                <div className="card-body p-5 sm:p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="badge badge-error badge-outline font-bold text-xs uppercase mb-1">
                        {amb.ambulance_type}
                      </span>
                      <h3 className="card-title text-base sm:text-lg font-black">{amb.vehicle_number}</h3>
                    </div>
                    <span className="badge badge-success text-white font-medium text-xs">
                      ● {amb.status}
                    </span>
                  </div>

                  <div className="bg-base-200 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/70">Driver:</span>
                      <span className="font-bold">{amb.driver_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/70">Contact:</span>
                      <a href={`tel:${amb.driver_phone}`} className="text-primary font-bold hover:underline">
                        {amb.driver_phone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/70">Dhaka Hub:</span>
                      <span className="font-semibold text-right">{amb.base_location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-base-300">
                      <span className="text-base-content/70">Base Fare:</span>
                      <span className="font-black text-success text-sm">৳{amb.base_fare}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {user ? (
                      <button
                        onClick={() => onDirectDispatch(amb)}
                        className="btn btn-sm btn-error text-white w-full font-bold shadow-md gap-1.5"
                      >
                        <FaAmbulance className="text-xs" /> ⚡ Instant Direct Dispatch
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEmergencyNonLogin(amb)}
                          className="btn btn-sm btn-error text-white font-bold flex-1 gap-1 shadow-sm text-xs"
                          title="Emergency immediate dispatch requires user account"
                        >
                          <FaLock className="text-[10px]" /> Emergency (Login)
                        </button>
                        <button
                          onClick={() => onScheduleClick(amb)}
                          className="btn btn-sm btn-neutral text-white font-bold flex-1 gap-1 shadow-sm text-xs"
                          title="Schedule ambulance for upcoming days without login"
                        >
                          📅 Schedule Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join shadow-sm">
                <button
                  className="join-item btn btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  « Prev
                </button>
                <button className="join-item btn btn-sm btn-active">
                  Page {page} of {totalPages}
                </button>
                <button
                  className="join-item btn btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};
