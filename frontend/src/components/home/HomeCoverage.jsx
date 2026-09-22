import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const HomeCoverage = ({ zoneFilter, setZoneFilter }) => {
  const northAreas = [
    'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Bashundhara R/A',
    'Mohakhali', 'Badda', 'Banasree', 'Tejgaon', 'Cantonment',
    'Farmgate', 'Kuril', 'Savar'
  ];

  const southAreas = [
    'Dhanmondi', 'Mohammadpur', 'Shahbagh', 'DMCH Area',
    'Old Dhaka (Chakbazar)', 'Motijheel', 'Jatrabari', 'Shantinagar',
    'Malibagh', 'Lalbagh', 'Demra'
  ];

  return (
    <section id="coverage" className="bg-base-200 p-6 sm:p-10 rounded-3xl border border-base-300 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="badge badge-primary font-bold text-xs uppercase tracking-wider">
          Dhaka Zone Network
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">
          24-Hour Dhaka Coverage Areas
        </h2>
        <p className="text-xs sm:text-sm text-base-content/70">
          Rapid ambulance dispatch stations located across every major intersection and hospital hub in Dhaka.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dhaka North Zone */}
        <div className="card bg-base-100 border border-base-300 shadow-md p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg text-primary flex items-center gap-2">
              <FaMapMarkerAlt /> Dhaka North City Corporation
            </h3>
            <span className="badge badge-primary badge-outline text-xs font-bold">10 Active Hubs</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {northAreas.map((area) => (
              <button
                key={area}
                onClick={() => setZoneFilter(area)}
                className={`btn btn-xs rounded-full ${zoneFilter === area ? 'btn-primary font-bold' : 'btn-ghost bg-base-200'}`}
              >
                {area}
              </button>
            ))}
          </div>

          <div className="text-xs text-base-content/70 flex items-center justify-between pt-2 border-t border-base-200">
            <span>Average response time: <strong>10-12 mins</strong></span>
            <a href="tel:01303446161" className="text-error font-bold hover:underline">
              Call North Station
            </a>
          </div>
        </div>

        {/* Dhaka South Zone */}
        <div className="card bg-base-100 border border-base-300 shadow-md p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg text-error flex items-center gap-2">
              <FaMapMarkerAlt /> Dhaka South City Corporation
            </h3>
            <span className="badge badge-error badge-outline text-xs font-bold">10 Active Hubs</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {southAreas.map((area) => (
              <button
                key={area}
                onClick={() => setZoneFilter(area)}
                className={`btn btn-xs rounded-full ${zoneFilter === area ? 'btn-error text-white font-bold' : 'btn-ghost bg-base-200'}`}
              >
                {area}
              </button>
            ))}
          </div>

          <div className="text-xs text-base-content/70 flex items-center justify-between pt-2 border-t border-base-200">
            <span>Average response time: <strong>8-12 mins</strong></span>
            <a href="tel:01303446161" className="text-error font-bold hover:underline">
              Call South Station
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
