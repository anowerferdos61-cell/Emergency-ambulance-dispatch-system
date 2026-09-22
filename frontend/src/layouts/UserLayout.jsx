import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaTachometerAlt,
  FaHistory,
  FaUser,
  FaLock,
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaRedo,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaRoute,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
} from 'react-icons/fa';

export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserLayout');
  }
  return context;
};

export const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User Requests and Live Trip State
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // Pure Dhaka City Hubs
  const dhakaHubs = [
    'Dhanmondi',
    'Gulshan',
    'Banani',
    'Uttara',
    'Mirpur',
    'Mohammadpur',
    'Bashundhara',
    'Mohakhali',
    'Shahbagh',
    'Old Dhaka',
    'Badda',
    'Motijheel',
    'Jatrabari',
    'Shantinagar',
    'Tejgaon',
    'Savar',
  ];

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/emergency/my_requests');
      setMyRequests(res.data || []);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
    const interval = setInterval(fetchMyRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  // Find active ongoing trip
  const activeRequest = myRequests.find((r) =>
    ['pending', 'assigned', 'on_the_way'].includes(r.status)
  );

  // Stats
  const stats = {
    total: myRequests.length,
    active: myRequests.filter((r) => ['pending', 'assigned', 'on_the_way'].includes(r.status)).length,
    completed: myRequests.filter((r) => r.status === 'completed').length,
    cancelled: myRequests.filter((r) => r.status === 'cancelled').length,
  };

  const handleCancelRequest = async (id) => {
    try {
      await api.put(`/emergency/cancel/${id}`);
      toast.success('Emergency request cancelled');
      setCancellingId(null);
      fetchMyRequests();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to cancel request';
      toast.error(msg);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: FaTachometerAlt,
      exact: true,
      badge: activeRequest ? '1 Active' : null,
      badgeColor: 'badge-error',
    },
    {
      name: 'Instant Dispatch',
      path: '/dashboard/dispatch',
      icon: FaAmbulance,
      badge: '24/7',
      badgeColor: 'badge-success text-white',
    },
    {
      name: 'Schedule Booking',
      path: '/dashboard/schedule',
      icon: FaCalendarAlt,
      badge: 'Advance',
      badgeColor: 'badge-primary text-white',
    },
    {
      name: 'Trip History',
      path: '/dashboard/history',
      icon: FaHistory,
      badge: myRequests.length > 0 ? `${myRequests.length}` : null,
      badgeColor: 'badge-neutral',
    },
    {
      name: 'My Profile & Info',
      path: '/dashboard/profile',
      icon: FaUser,
    },
    {
      name: 'Security & Password',
      path: '/dashboard/security',
      icon: FaLock,
    },
  ];

  return (
    <UserContext.Provider
      value={{
        myRequests,
        activeRequest,
        loadingRequests,
        stats,
        dhakaHubs,
        cancellingId,
        setCancellingId,
        fetchMyRequests,
        handleCancelRequest,
      }}
    >
      <div className="flex h-screen bg-base-200 overflow-hidden font-sans">
        {/* 1. DESKTOP SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col bg-base-100 border-r border-base-300 transition-all duration-300 z-30 shadow-lg ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-base-300 bg-base-100">
            {isSidebarOpen ? (
              <Link to="/dashboard" className="flex items-center gap-2 font-black text-error">
                <div className="p-2 bg-error text-white rounded-xl shadow-md">
                  <FaAmbulance className="text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-tight leading-none">PATIENT PORTAL</span>
                  <span className="text-[9px] text-base-content/60 font-bold uppercase tracking-wider">Dhaka Emergency</span>
                </div>
              </Link>
            ) : (
              <Link to="/dashboard" className="mx-auto p-2 bg-error text-white rounded-xl shadow-md">
                <FaAmbulance className="text-lg" />
              </Link>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="btn btn-ghost btn-xs btn-circle text-base-content/70 hover:text-error"
              title="Toggle Sidebar"
            >
              <FaBars />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-error text-white shadow-md shadow-error/30'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-error'
                    } ${!isSidebarOpen ? 'justify-center px-0' : ''}`
                  }
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <Icon className="text-base shrink-0" />
                  {isSidebarOpen && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className={`badge badge-xs font-extrabold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Bottom User Profile Section */}
          <div className="p-3 border-t border-base-300 bg-base-100">
            {isSidebarOpen ? (
              <div className="p-2 bg-base-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="avatar placeholder">
                    <div className="bg-error/10 text-error rounded-xl w-9 h-9 font-black text-sm flex items-center justify-center">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate">{user?.username || 'Patient'}</p>
                    <p className="text-[10px] text-base-content/60 truncate">{user?.phone_number || 'User Account'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 border-t border-base-300/60">
                  <Link
                    to="/"
                    className="btn btn-ghost btn-xs flex-1 text-[11px] font-bold"
                  >
                    Public Home
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-xs text-error font-bold"
                    title="Sign Out"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm btn-circle text-error"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 2. MOBILE SIDEBAR DRAWER */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-[80vw] bg-base-100 h-full shadow-2xl z-10 border-r border-base-300">
              <div className="h-16 flex items-center justify-between px-4 border-b border-base-300">
                <div className="flex items-center gap-2 font-black text-error">
                  <div className="p-2 bg-error text-white rounded-xl shadow-md">
                    <FaAmbulance className="text-lg" />
                  </div>
                  <span className="text-sm font-black">PATIENT PORTAL</span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${
                          isActive
                            ? 'bg-error text-white shadow-md'
                            : 'text-base-content/70 hover:bg-base-200'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-base" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`badge badge-xs font-extrabold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-4 border-t border-base-300 bg-base-200/50">
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm w-full text-white font-bold gap-2"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 bg-base-100 border-b border-base-300 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="btn btn-ghost btn-sm btn-circle md:hidden text-base-content"
              >
                <FaBars />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <span>Patient Dashboard</span>
                  {activeRequest && (
                    <span className="badge badge-error text-white text-[10px] font-extrabold animate-pulse">
                      🚨 Active Trip Ongoing
                    </span>
                  )}
                </h1>
                <p className="text-[11px] text-base-content/60 font-semibold hidden sm:block">
                  Emergency Ambulance Network • Dhaka 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchMyRequests}
                className="btn btn-ghost btn-sm btn-circle"
                title="Refresh Trip Status"
              >
                <FaRedo className={`text-xs ${loadingRequests ? 'animate-spin' : ''}`} />
              </button>

              <Link
                to="/dashboard/dispatch"
                className="btn btn-error btn-xs sm:btn-sm text-white font-black shadow-md gap-1.5 rounded-xl"
              >
                <FaAmbulance className="text-xs" />
                <span className="hidden sm:inline">⚡ Instant Dispatch</span>
                <span className="sm:hidden">Dispatch</span>
              </Link>
            </div>
          </header>

          {/* Page Content Rendered Here */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-base-200/60">
            <div className="max-w-6xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default UserLayout;
