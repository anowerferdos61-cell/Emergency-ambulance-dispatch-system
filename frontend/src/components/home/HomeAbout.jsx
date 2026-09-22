import React from 'react';
import { FaPhoneAlt, FaPhoneVolume, FaCheckCircle } from 'react-icons/fa';

export const HomeAbout = () => {
  return (
    <section id="about" className="bg-base-200 p-6 sm:p-10 rounded-3xl border border-base-300 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="badge badge-error badge-outline font-bold text-xs uppercase tracking-wider">
            About Emergency Ambulance Service
          </span>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            Leading 24/7 Emergency Ambulance Network in Dhaka
          </h2>
          <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
            Emergency Ambulance Service is committed to providing prompt, professional, and compassionate emergency medical transportation across Dhaka City. With a fleet of modern ICU, AC, and regular ambulances stationed strategically in North and South Dhaka, we ensure minimum response time during critical golden hours.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-base-100 rounded-xl border border-base-300">
              <div className="text-2xl font-black text-error">24/7</div>
              <div className="text-xs text-base-content/70 font-medium">Non-stop Emergency Operation</div>
            </div>
            <div className="p-3 bg-base-100 rounded-xl border border-base-300">
              <div className="text-2xl font-black text-success">10-15 Min</div>
              <div className="text-xs text-base-content/70 font-medium">Average Arrival in Dhaka Hubs</div>
            </div>
            <div className="p-3 bg-base-100 rounded-xl border border-base-300">
              <div className="text-2xl font-black text-primary">100%</div>
              <div className="text-xs text-base-content/70 font-medium">Certified Attendants & Drivers</div>
            </div>
            <div className="p-3 bg-base-100 rounded-xl border border-base-300">
              <div className="text-2xl font-black text-warning">Fixed</div>
              <div className="text-xs text-base-content/70 font-medium">Fair Zone-Based Rates</div>
            </div>
          </div>
        </div>

        {/* Emergency Hotline Box */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-8 rounded-3xl shadow-xl space-y-5 text-center">
          <FaPhoneAlt className="text-5xl mx-auto animate-bounce text-yellow-300" />
          <h3 className="text-2xl font-black">Need an Ambulance Right Now in Dhaka?</h3>
          <p className="text-xs sm:text-sm text-white/90">
            Direct hotline connection with our Dhaka Central Emergency Dispatch Command Room.
          </p>
          <div className="space-y-3">
            <a
              href="tel:01303446161"
              className="btn btn-warning text-red-950 font-black btn-lg w-full text-lg shadow-2xl hover:scale-102 transition-transform"
            >
              <FaPhoneVolume /> CALL 01303-446161
            </a>
            <div className="flex justify-center items-center gap-4 text-xs font-semibold text-white/80">
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-300" /> 24/7 Active
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-300" /> Instant Pickup
              </span>
              <span className="flex items-center gap-1">
                <FaCheckCircle className="text-green-300" /> Doctor Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
