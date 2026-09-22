import React from 'react';
import { FaAmbulance, FaSnowflake, FaHeartbeat, FaPlane } from 'react-icons/fa';

export const HomeServices = () => {
  return (
    <section id="services" className="space-y-6 pt-2">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="badge badge-error badge-outline font-bold text-xs uppercase tracking-wider">
          Our Medical Fleet
        </span>
        <h2 className="text-2xl sm:text-4xl font-black">
          Emergency Ambulance Services in Dhaka
        </h2>
        <p className="text-xs sm:text-sm text-base-content/70">
          Dedicated emergency patient transport equipped with state-of-the-art medical life support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Regular Ambulance */}
        <div className="card bg-base-200 border border-base-300 hover:border-error shadow-sm hover:shadow-xl transition-all p-5 rounded-2xl text-center space-y-3">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            <FaAmbulance />
          </div>
          <h3 className="font-extrabold text-base">Regular (Non-AC)</h3>
          <p className="text-xs text-base-content/70">Budget-friendly standard medical transport for non-critical transfers within Dhaka.</p>
          <div className="badge badge-neutral text-xs font-bold">From ৳1,100</div>
        </div>

        {/* 2. AC Ambulance */}
        <div className="card bg-base-200 border border-base-300 hover:border-error shadow-sm hover:shadow-xl transition-all p-5 rounded-2xl text-center space-y-3">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            <FaSnowflake />
          </div>
          <h3 className="font-extrabold text-base">A/C Ambulance</h3>
          <p className="text-xs text-base-content/70">Temperature-controlled smooth emergency transit with built-in oxygen setup.</p>
          <div className="badge badge-neutral text-xs font-bold">From ৳1,400</div>
        </div>

        {/* 3. ICU / CCU Ambulance */}
        <div className="card bg-base-200 border-2 border-error/50 shadow-md hover:shadow-xl transition-all p-5 rounded-2xl text-center space-y-3 bg-gradient-to-b from-red-50/20 to-base-200">
          <div className="w-14 h-14 bg-error text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
            <FaHeartbeat className="animate-pulse" />
          </div>
          <h3 className="font-extrabold text-base text-error">ICU Ambulance</h3>
          <p className="text-xs text-base-content/70">Portable ventilator, cardiac monitor, suction machine & expert paramedic on board.</p>
          <div className="badge badge-error text-white text-xs font-bold">From ৳3,600</div>
        </div>

        {/* 4. Freezer Van */}
        <div className="card bg-base-200 border border-base-300 hover:border-error shadow-sm hover:shadow-xl transition-all p-5 rounded-2xl text-center space-y-3">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            <FaSnowflake />
          </div>
          <h3 className="font-extrabold text-base">Freezer Van</h3>
          <p className="text-xs text-base-content/70">Specialized cold mortuary chamber for respectful deceased body transportation.</p>
          <div className="badge badge-neutral text-xs font-bold">From ৳2,400</div>
        </div>

        {/* 5. Air & NICU Support */}
        <div className="card bg-base-200 border border-base-300 hover:border-error shadow-sm hover:shadow-xl transition-all p-5 rounded-2xl text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            <FaPlane />
          </div>
          <h3 className="font-extrabold text-base">Air & NICU Support</h3>
          <p className="text-xs text-base-content/70">Neonatal baby incubator & critical air ambulance coordination across Dhaka division.</p>
          <div className="badge badge-neutral text-xs font-bold">24/7 Hotline</div>
        </div>
      </div>
    </section>
  );
};
