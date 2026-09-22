import { Link } from 'react-router-dom';
import { FaAmbulance, FaHeartbeat, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content pt-12 pb-6 border-t border-base-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs sm:text-sm">
        {/* Col 1: Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-black text-lg text-white">
            <div className="p-1.5 bg-red-600 rounded-lg text-white">
              <FaAmbulance className="text-xl" />
            </div>
            <span>EMERGENCY AMBULANCE</span>
          </div>
          <p className="text-neutral-content/70 text-xs leading-relaxed">
            Dhaka’s premier 24/7 emergency medical ambulance dispatch service network. ICU, AC, Non-AC & Freezer Van support across all Dhaka North & South City Corporation zones.
          </p>
          <div className="text-xs font-bold text-yellow-300 flex items-center gap-1">
            <FaPhoneAlt className="animate-pulse" /> 24-Hour Hotline: 01303-446161
          </div>
        </div>

        {/* Col 2: Services */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">Ambulance Fleet</h4>
          <ul className="space-y-1.5 text-neutral-content/80 text-xs">
            <li><Link to="/services" className="hover:text-red-400">Regular (Non-AC) Ambulance</Link></li>
            <li><Link to="/services" className="hover:text-red-400">A/C Emergency Ambulance</Link></li>
            <li><Link to="/services" className="hover:text-red-400">ICU / CCU Life Support</Link></li>
            <li><Link to="/services" className="hover:text-red-400">Freezer Van (Mortuary)</Link></li>
            <li><Link to="/services" className="hover:text-red-400">Air Ambulance & NICU Support</Link></li>
          </ul>
        </div>

        {/* Col 3: Dhaka Coverage */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">Dhaka Hubs</h4>
          <ul className="space-y-1.5 text-neutral-content/80 text-xs">
            <li><Link to="/coverage" className="hover:text-red-400">Gulshan & Banani Hub</Link></li>
            <li><Link to="/coverage" className="hover:text-red-400">Uttara (Sectors 1-14)</Link></li>
            <li><Link to="/coverage" className="hover:text-red-400">Dhanmondi & Square Hub</Link></li>
            <li><Link to="/coverage" className="hover:text-red-400">Mirpur (1-14) & Stadium</Link></li>
            <li><Link to="/coverage" className="hover:text-red-400">Shahbagh (DMCH & BSMMU)</Link></li>
            <li><Link to="/coverage" className="hover:text-red-400">Old Dhaka (Chakbazar/Lalbagh)</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Quick Links */}
        <div className="space-y-2">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider mb-2">Emergency Desk</h4>
          <div className="space-y-1.5 text-xs text-neutral-content/80">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-red-400 shrink-0 mt-0.5" />
              <span>Dhanmondi Central Control Room, Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-red-400 shrink-0" />
              <span>01303-446161 / 999</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-red-400 shrink-0" />
              <span>support@emergencyambulanceservice.com</span>
            </div>
          </div>
          <div className="pt-2">
            <Link to="/dashboard" className="btn btn-error btn-xs text-white font-bold w-full">
              Live Dispatch Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-content/10 pt-4 text-center text-xs text-neutral-content/60">
        <p>© {new Date().getFullYear()} Emergency Ambulance Service Dhaka. All rights reserved.</p>
      </div>
    </footer>
  );
};
