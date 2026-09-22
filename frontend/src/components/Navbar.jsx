import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaAmbulance,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaShieldAlt,
  FaPhoneAlt,
  FaArrowRight,
  FaUserEdit,
  FaKey,
  FaSignInAlt,
} from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Determine user dashboard link based on role
  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (user?.role === 'driver') return '/driver/dashboard';
    return '/dashboard';
  };

  const getDashboardTitle = () => {
    if (isAdmin) return 'Admin Command Center';
    if (user?.role === 'driver') return 'Driver Operations';
    return 'My Dispatch Dashboard';
  };

  return (
    <>
      {/* Admin Notice Banner when Admin is viewing public website */}
      {isAdmin && (
        <div className="bg-neutral text-white text-xs py-1.5 px-4 flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <span className="badge badge-error badge-xs text-white font-bold">ADMIN MODE</span>
            <span>You are previewing the public website.</span>
          </div>
          <Link
            to="/admin/dashboard"
            className="btn btn-xs btn-error text-white font-bold gap-1 rounded-lg"
          >
            <FaShieldAlt /> Return to Admin Panel <FaArrowRight />
          </Link>
        </div>
      )}

      <div className="navbar bg-base-100/95 backdrop-blur-md shadow-md px-3 sm:px-8 sticky top-0 z-50 border-b border-base-200">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-200 rounded-2xl w-60 space-y-1 border border-base-300">
              <li><Link to="/" className={isActive('/') ? 'active font-bold text-error' : ''}>Home</Link></li>
              <li><Link to="/services" className={isActive('/services') ? 'active font-bold text-error' : ''}>Services</Link></li>
              <li><Link to="/schedule" className={isActive('/schedule') ? 'active font-bold text-error' : ''}>📅 Schedule</Link></li>
              <li><Link to="/coverage" className={isActive('/coverage') ? 'active font-bold text-error' : ''}>Coverage</Link></li>
              <li><Link to="/hospitals" className={isActive('/hospitals') ? 'active font-bold text-error' : ''}>Hospitals</Link></li>
              <li><Link to="/about" className={isActive('/about') ? 'active font-bold text-error' : ''}>About</Link></li>
              <li><Link to="/contact" className={isActive('/contact') ? 'active font-bold text-error' : ''}>Contact</Link></li>
              {user && (
                <li className="pt-2 border-t border-base-300">
                  <Link to={getDashboardLink()} className="font-bold text-error">
                    {getDashboardTitle()}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2 text-primary font-black text-lg sm:text-xl">
            <div className="p-2 bg-red-600 text-white rounded-xl shadow-md">
              <FaAmbulance className="text-xl sm:text-2xl" />
            </div>
            <div className="flex flex-col">
              <span className="tracking-tight text-red-600 font-extrabold leading-none">EMERGENCY AMBULANCE</span>
              <span className="text-[10px] text-base-content/60 font-semibold tracking-wider uppercase">Dhaka 24/7 Service</span>
            </div>
          </Link>
        </div>

        {/* Center Menu: Clean public links only */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-semibold text-sm gap-1">
            <li>
              <Link to="/" className={isActive('/') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className={isActive('/services') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/schedule" className={isActive('/schedule') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                Schedule
              </Link>
            </li>
            <li>
              <Link to="/coverage" className={isActive('/coverage') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                Coverage
              </Link>
            </li>
            <li>
              <Link to="/hospitals" className={isActive('/hospitals') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                Hospitals
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={isActive('/contact') ? 'text-error font-extrabold border-b-2 border-error' : 'hover:text-error'}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2 sm:gap-3">
          <a
            href="tel:01303446161"
            className="hidden sm:flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-red-700 transition"
          >
            <FaPhoneAlt className="animate-pulse text-[11px]" />
            <span>01303-446161</span>
          </a>

          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm flex items-center gap-2 cursor-pointer border border-base-300 rounded-full px-3">
                <FaUserCircle className="text-xl text-primary" />
                <div className="flex flex-col items-start text-xs hidden sm:flex">
                  <span className="font-bold text-xs">{user.username}</span>
                  <span className={`badge badge-xs font-bold uppercase ${
                    isAdmin ? 'badge-error' : user.role === 'driver' ? 'badge-warning text-red-950' : 'badge-primary'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </label>
              <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-2xl w-60 mt-4 border border-base-300">
                <li className="menu-title px-4 py-1 text-xs">Signed in as <strong>{user.username}</strong></li>
                <li>
                  <Link to={getDashboardLink()} className="font-bold text-error">
                    {isAdmin ? (
                      <FaShieldAlt className="text-error" />
                    ) : user.role === 'driver' ? (
                      <FaAmbulance className="text-warning" />
                    ) : (
                      <FaTachometerAlt className="text-primary" />
                    )}
                    {getDashboardTitle()}
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="font-semibold text-base-content hover:text-error">
                    <FaUserEdit className="text-info" /> Edit Profile
                  </Link>
                </li>
                <li>
                  <Link to="/profile?tab=password" className="font-semibold text-base-content hover:text-error">
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
          ) : (
            <Link
              to="/login"
              className="btn btn-error text-white btn-xs sm:btn-sm font-bold shadow-md rounded-xl flex items-center gap-1.5 px-3.5"
            >
              <FaSignInAlt className="text-xs" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
