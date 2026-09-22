import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaAmbulance,
  FaSignOutAlt,
  FaUserCheck,
  FaIdCard,
  FaPhoneAlt,
  FaCheckCircle,
  FaClock,
  FaUserEdit,
  FaKey,
  FaUserCircle,
} from 'react-icons/fa';

export const DriverNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar bg-base-100/95 backdrop-blur-md shadow-md px-4 sm:px-8 sticky top-0 z-50 border-b border-warning/30">
      {/* Brand & Portal Label */}
      <div className="navbar-start gap-3">
        <div className="flex items-center gap-2 text-warning font-black text-lg sm:text-xl">
          <div className="p-2.5 bg-warning text-red-950 rounded-2xl shadow-md">
            <FaAmbulance className="text-xl sm:text-2xl animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="tracking-tight text-base-content font-black leading-none text-base sm:text-lg">
                DRIVER PORTAL
              </span>
              <span className="badge badge-warning text-red-950 font-extrabold text-[10px] uppercase tracking-wider">
                Operations
              </span>
            </div>
            <span className="text-[10px] text-base-content/60 font-semibold tracking-wider uppercase mt-0.5">
              Dhaka 24/7 Rapid Emergency Dispatch
            </span>
          </div>
        </div>
      </div>

      {/* Driver Status Info */}
      <div className="navbar-end gap-2 sm:gap-3">
        <a
          href="tel:01303446161"
          className="hidden md:flex items-center gap-1.5 bg-base-200 text-base-content px-3 py-1.5 rounded-full text-xs font-bold border border-base-300"
        >
          <FaPhoneAlt className="text-error text-xs" />
          <span>Control Room: 01303-446161</span>
        </a>

        {/* Driver Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm flex items-center gap-2 cursor-pointer bg-base-200 px-3 py-1.5 rounded-2xl border border-base-300 h-auto"
          >
            <FaUserCircle className="text-xl text-warning" />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs leading-tight">{user?.username}</span>
              <div className="flex items-center gap-1 mt-0.5">
                {user?.is_verified ? (
                  <span className="text-[10px] text-success font-bold flex items-center gap-0.5">
                    <FaCheckCircle /> Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-warning font-bold flex items-center gap-0.5">
                    <FaClock /> Pending
                  </span>
                )}
              </div>
            </div>
          </label>

          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-2xl w-56 mt-4 border border-base-300"
          >
            <li className="menu-title px-4 py-1 text-xs">
              Signed in as <strong>{user?.username}</strong>
            </li>
            <li>
              <Link to="/driver" className="font-bold text-warning">
                <FaAmbulance /> Driver Trips Dashboard
              </Link>
            </li>
            <li>
              <Link to="/driver/profile" className="font-semibold text-base-content hover:text-warning">
                <FaUserEdit className="text-info" /> Edit Profile & Vehicle
              </Link>
            </li>
            <li>
              <Link to="/driver/profile?tab=password" className="font-semibold text-base-content hover:text-warning">
                <FaKey className="text-warning" /> Change Password
              </Link>
            </li>
            <div className="divider my-1"></div>
            <li>
              <button onClick={handleLogout} className="text-error font-semibold">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default DriverNavbar;
