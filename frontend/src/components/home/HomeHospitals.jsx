import React from 'react';
import { FaHospital } from 'react-icons/fa';

export const HomeHospitals = () => {
  const hospitalList = [
    { name: 'Dhaka Medical College (DMCH)', area: 'Shahbagh, Dhaka', type: 'Govt. Emergency' },
    { name: 'Square Hospital', area: 'Panthapath, Dhaka', type: 'ICU & Cardiac' },
    { name: 'Evercare Hospital', area: 'Bashundhara, Dhaka', type: 'Tertiary Care' },
    { name: 'United Hospital', area: 'Gulshan-2, Dhaka', type: 'CCU & Trauma' },
    { name: 'BSMMU (PG Hospital)', area: 'Shahbagh, Dhaka', type: 'Specialized Govt.' },
    { name: 'National Heart Foundation', area: 'Mirpur, Dhaka', type: 'Cardiac Center' },
    { name: 'BIRDEM General Hospital', area: 'Shahbagh, Dhaka', type: 'Endocrine & ICU' },
    { name: 'Kurmitola General Hospital', area: 'Airport Road, Dhaka', type: 'Emergency' },
  ];

  return (
    <section id="hospitals" className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="badge badge-error badge-outline font-bold text-xs uppercase tracking-wider">
          Medical Network
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">
          Connected Major Hospitals in Dhaka
        </h2>
        <p className="text-xs sm:text-sm text-base-content/70">
          Direct coordination and rapid emergency entry route with Dhaka's top specialized hospitals.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {hospitalList.map((hosp, i) => (
          <div key={i} className="card bg-base-100 border border-base-300 p-4 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 text-error text-base mb-1">
              <FaHospital />
              <span className="font-bold text-xs uppercase tracking-wider text-base-content/70">{hosp.type}</span>
            </div>
            <h4 className="font-bold text-sm line-clamp-1">{hosp.name}</h4>
            <p className="text-xs text-base-content/60 mt-0.5">{hosp.area}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
