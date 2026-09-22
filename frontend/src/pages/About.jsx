import { Link } from 'react-router-dom';
import { FaShieldAlt, FaClock, FaHeartbeat, FaPhoneAlt, FaCheckCircle, FaUsers, FaHospital, FaAward } from 'react-icons/fa';

export const About = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-3">
        <span className="badge badge-warning font-bold text-xs uppercase tracking-wider py-2 px-3">
          About Our Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">About Emergency Ambulance Service Dhaka</h1>
        <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
          Dedicated 24/7 rapid medical emergency transportation and critical care ambulance network serving the people of Dhaka City.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="badge badge-error badge-outline font-bold text-xs uppercase tracking-wider">
            Who We Are
          </span>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            Saving Lives with Speed, Care & Professionalism in Dhaka
          </h2>
          <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
            Founded with the sole objective of bridging the critical response gap during medical emergencies, Emergency Ambulance Service Dhaka has grown into the capital city’s most trusted ambulance dispatch network.
          </p>
          <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
            Our modern fleet of ICU, AC, and regular ambulances are strategically stationed at major traffic and hospital corridors—including Dhanmondi, Gulshan, Uttara, Mirpur, and Shahbagh—guaranteeing rapid dispatch within minutes of an emergency call.
          </p>

          <div className="space-y-2 pt-2 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2 text-base-content/80">
              <FaCheckCircle className="text-success" /> 24/7 Central Operations Control Room with GPS tracking
            </div>
            <div className="flex items-center gap-2 text-base-content/80">
              <FaCheckCircle className="text-success" /> Certified BLS & ACLS Trained Paramedics on board
            </div>
            <div className="flex items-center gap-2 text-base-content/80">
              <FaCheckCircle className="text-success" /> Direct coordination with top Dhaka hospital emergency bays
            </div>
            <div className="flex items-center gap-2 text-base-content/80">
              <FaCheckCircle className="text-success" /> Transparent zone-based pricing with zero hidden fees
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-base-200 rounded-3xl border border-base-300 text-center space-y-2">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FaClock />
            </div>
            <h3 className="text-3xl font-black text-error">10-15 Min</h3>
            <p className="text-xs text-base-content/70 font-semibold">Average Response Time</p>
          </div>

          <div className="p-6 bg-base-200 rounded-3xl border border-base-300 text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FaHospital />
            </div>
            <h3 className="text-3xl font-black text-primary">20+ Hubs</h3>
            <p className="text-xs text-base-content/70 font-semibold">Active Across Dhaka</p>
          </div>

          <div className="p-6 bg-base-200 rounded-3xl border border-base-300 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FaShieldAlt />
            </div>
            <h3 className="text-3xl font-black text-success">100%</h3>
            <p className="text-xs text-base-content/70 font-semibold">Certified Emergency Fleet</p>
          </div>

          <div className="p-6 bg-base-200 rounded-3xl border border-base-300 text-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
              <FaUsers />
            </div>
            <h3 className="text-3xl font-black text-purple-600">24/7</h3>
            <p className="text-xs text-base-content/70 font-semibold">Dedicated Medical Hotline</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact Strip */}
      <div className="bg-base-200 p-8 rounded-3xl border border-base-300 text-center space-y-3">
        <h3 className="text-2xl font-black">24/7 Emergency Dispatch Helpline</h3>
        <p className="text-xs sm:text-sm text-base-content/70">
          For immediate dispatch assistance in any zone of Dhaka, contact our round-the-clock emergency desk.
        </p>
        <a href="tel:01303446161" className="btn btn-error text-white font-bold btn-md gap-2 shadow-md">
          <FaPhoneAlt /> Call 01303-446161
        </a>
      </div>
    </div>
  );
};
