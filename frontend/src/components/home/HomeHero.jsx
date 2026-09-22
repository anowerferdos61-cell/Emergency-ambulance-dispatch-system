import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaAmbulance,
  FaPhoneAlt,
  FaPhoneVolume,
  FaClock,
  FaCheckCircle,
  FaLock,
} from 'react-icons/fa';

export const HomeHero = ({ user }) => {
  return (
    <section className="hero min-h-[48vh] bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden my-4 border border-red-500/30">
      <div className="hero-content flex-col lg:flex-row-reverse justify-between w-full max-w-6xl mx-auto z-10 gap-8">
        {/* Right Card: Rapid Hotline Box */}
        <div className="w-full lg:w-5/12 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center text-center w-full max-w-sm">
            <div className="avatar placeholder mb-3">
              <div className="bg-white/20 text-yellow-300 rounded-full p-4">
                <FaAmbulance className="text-5xl sm:text-6xl animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">24/7 Dhaka Helpline</h3>
            <p className="text-white/80 text-xs mt-1">Instant ambulance dispatch across Dhaka City</p>

            <div className="mt-4 w-full space-y-2">
              <a
                href="tel:01303446161"
                className="btn btn-warning text-red-900 font-extrabold btn-md w-full shadow-lg gap-2 text-base hover:scale-102 transition-transform"
              >
                <FaPhoneAlt /> 01303-446161
              </a>
              <a
                href="tel:999"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-red-700 btn-sm w-full font-bold gap-2"
              >
                <FaPhoneVolume /> National Emergency: 999
              </a>
            </div>

            <div className="mt-4 badge badge-neutral bg-black/30 border-none text-yellow-300 text-xs font-semibold py-2.5 px-3">
              <FaClock className="mr-1 text-xs" /> Average Arrival: 10-15 Mins
            </div>
          </div>
        </div>

        {/* Left Hero Content */}
        <div className="w-full lg:w-7/12 text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-300">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
            Dhaka's #1 Emergency Ambulance Network
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-sm">
            24/7 Emergency Ambulance Service in Dhaka
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Anytime, anywhere rapid medical transport. Verified <strong>ICU, AC, Non-AC, Freezer Vans & Air Ambulance Support</strong> connecting all major hospitals across Dhaka North & South.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-warning text-red-900 font-extrabold btn-md shadow-xl gap-2">
                  <FaAmbulance /> Open Dispatch Dashboard
                </Link>
                <Link to="/dashboard/schedule" className="btn btn-outline border-white text-white hover:bg-white hover:text-red-700 btn-md font-bold gap-2">
                  📅 Schedule Booking
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-warning text-red-900 font-extrabold btn-md shadow-xl gap-2">
                  <FaLock /> Login for Emergency
                </Link>
                <Link to="/schedule" className="btn btn-outline border-white text-white hover:bg-white hover:text-red-700 btn-md font-bold gap-2">
                  📅 Schedule in Advance
                </Link>
              </>
            )}
          </div>

          {/* Quick Feature Badges */}
          <div className="flex flex-wrap gap-4 pt-3 text-xs text-white/80 font-medium">
            <span className="flex items-center gap-1"><FaCheckCircle className="text-yellow-300" /> GPS Tracked Fleet</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-yellow-300" /> Oxygen & Life Support</span>
            <span className="flex items-center gap-1"><FaCheckCircle className="text-yellow-300" /> Fixed Dhaka Zone Fares</span>
          </div>
        </div>
      </div>
    </section>
  );
};
