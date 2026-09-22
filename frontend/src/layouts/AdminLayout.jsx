import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaPlus,
  FaChartPie,
  FaUsers,
  FaRoute,
  FaBars,
  FaTimes,
  FaRedo,
  FaIdCard,
  FaGlobe,
  FaUserEdit,
} from 'react-icons/fa';

export const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminLayout');
  }
  return context;
};

export const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Admin Data States
  const [stats, setStats] = useState({
    total_ambulances: 0,
    available_ambulances: 0,
    dispatched_ambulances: 0,
    total_requests: 0,
    pending_requests: 0,
    scheduled_requests: 0,
    active_dispatches: 0,
    completed_requests: 0,
  });
  const [ambulances, setAmbulances] = useState([]);
  const [requests, setRequests] = useState([]);
  const [driversList, setDriversList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Common Modals
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [deletingAmbulanceId, setDeletingAmbulanceId] = useState(null);
  const [assigningReq, setAssigningReq] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ambRes, dispatchesRes, driversRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard_stats'),
        api.get('/ambulances/all?limit=100'),
        api.get('/admin/dispatches'),
        api.get('/admin/drivers'),
        api.get('/admin/users'),
      ]);

      setStats(statsRes.data || {});
      setAmbulances(ambRes.data?.data || []);
      setRequests(dispatchesRes.data || []);
      setDriversList(driversRes.data || []);
      setUsersList(usersRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteAmbulance = async (id) => {
    try {
      await api.delete(`/admin/ambulances/${id}`);
      toast.success('Vehicle removed from fleet');
      setDeletingAmbulanceId(null);
      fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to delete vehicle';
      toast.error(msg);
    }
  };

  const handleToggleDriverVerification = async (driverId) => {
    try {
      const res = await api.put(`/admin/drivers/${driverId}/verify`);
      toast.success(res.data?.message || 'Driver verification updated');
      fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Verification toggle failed';
      toast.error(msg);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await api.put(`/admin/dispatch_status/${requestId}`, { status: newStatus });
      toast.success(`Request status updated to "${newStatus}"`);
      fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Status update failed';
      toast.error(msg);
    }
  };

  const handleAssignVehicle = async (requestId, ambulanceId) => {
    try {
      await api.post('/admin/assign_ambulance', {
        request_id: requestId,
        ambulance_id: parseInt(ambulanceId),
      });
      toast.success('Ambulance dispatched & assigned!');
      setAssigningReq(null);
      fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Assignment failed';
      toast.error(msg);
    }
  };

  const pendingDriversCount = driversList.filter((d) => !d.is_verified).length;

  const navItems = [
    { to: '/admin', end: true, label: 'Overview', icon: FaChartPie, badge: null },
    { to: '/admin/fleet', label: 'Dhaka Fleet', icon: FaAmbulance, badge: ambulances.length },
    {
      to: '/admin/requests',
      label: 'Emergency Requests',
      icon: FaRoute,
      badge: stats.pending_requests > 0 ? stats.pending_requests : null,
      badgeColor: 'badge-error text-white animate-pulse',
    },
    {
      to: '/admin/drivers',
      label: 'Driver Approvals',
      icon: FaIdCard,
      badge: pendingDriversCount > 0 ? `${pendingDriversCount} New` : null,
      badgeColor: 'badge-warning text-red-950 font-black',
    },
    { to: '/admin/add-vehicle', label: 'Add Vehicle', icon: FaPlus, badge: null },
    { to: '/admin/users', label: 'User Accounts', icon: FaUsers, badge: usersList.length },
  ];

  // Dynamic Header Title
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return '📊 Operations Overview & Analytics';
    if (path.includes('/fleet')) return '🚑 Dhaka Ambulance Fleet';
    if (path.includes('/requests')) return '🚨 Live Emergency & Scheduled Requests';
    if (path.includes('/drivers')) return '👨‍✈️ Driver Verification & Licensing';
    if (path.includes('/add-vehicle')) return '➕ Register New Fleet Vehicle';
    if (path.includes('/users')) return '👥 User Account Management';
    return 'Admin Operations Control';
  };

  const contextValue = {
    stats,
    ambulances,
    requests,
    driversList,
    usersList,
    loading,
    fetchDashboardData,
    editingAmbulance,
    setEditingAmbulance,
    deletingAmbulanceId,
    setDeletingAmbulanceId,
    assigningReq,
    setAssigningReq,
    handleDeleteAmbulance,
    handleToggleDriverVerification,
    handleUpdateStatus,
    handleAssignVehicle,
    pendingDriversCount,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <div className="flex min-h-[calc(100vh-5rem)] bg-base-100 relative">
        {/* --- MOBILE SIDEBAR BACKDROP --- */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* --- COLLAPSIBLE SIDEBAR --- */}
        <aside
          className={`
            fixed lg:static top-0 left-0 bottom-0 z-50
            bg-base-200 border-r border-base-300
            transition-all duration-300 ease-in-out flex flex-col justify-between
            ${isSidebarOpen ? 'w-64' : 'w-20'}
            ${isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div>
            <div className="p-4 border-b border-base-300 flex items-center justify-between">
              <div className={`flex items-center gap-2.5 overflow-hidden ${!isSidebarOpen && 'lg:justify-center w-full'}`}>
                <div className="w-10 h-10 rounded-2xl bg-error text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  <FaAmbulance />
                </div>
                {(isSidebarOpen || isMobileSidebarOpen) && (
                  <div className="min-w-0">
                    <h2 className="font-black text-sm text-base-content leading-tight truncate">
                      Dhaka Dispatch
                    </h2>
                    <span className="text-[10px] text-error font-extrabold uppercase tracking-wider block">
                      Admin Command
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="btn btn-ghost btn-xs btn-circle lg:hidden"
              >
                <FaTimes />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-3 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={({ isActive }) => `
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all
                      ${isActive
                        ? 'bg-error text-white shadow-lg shadow-error/20 scale-102'
                        : 'hover:bg-base-300 text-base-content/80'
                      }
                      ${!isSidebarOpen && 'lg:justify-center lg:px-2'}
                    `}
                    title={item.label}
                  >
                    <Icon className="text-base shrink-0" />
                    {(isSidebarOpen || isMobileSidebarOpen) && (
                      <div className="flex-1 flex justify-between items-center text-left">
                        <span className="truncate">{item.label}</span>
                        {item.badge !== null && (
                          <span className={`badge badge-xs font-black ${item.badgeColor || 'badge-neutral'}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                );
              })}

              <div className="divider my-2 opacity-50"></div>

              <Link
                to="/"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-base-300 text-base-content/70 transition ${
                  !isSidebarOpen && 'lg:justify-center lg:px-2'
                }`}
                title="View Website"
              >
                <FaGlobe className="text-base shrink-0 text-primary" />
                {(isSidebarOpen || isMobileSidebarOpen) && <span>Public Website</span>}
              </Link>

              <Link
                to="/profile"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs sm:text-sm hover:bg-base-300 text-base-content/70 transition ${
                  !isSidebarOpen && 'lg:justify-center lg:px-2'
                }`}
                title="Admin Profile"
              >
                <FaUserEdit className="text-base shrink-0 text-warning" />
                {(isSidebarOpen || isMobileSidebarOpen) && <span>Admin Profile</span>}
              </Link>
            </nav>
          </div>

          {/* Sidebar Footer User Info & Collapse Toggle */}
          <div className="p-3 border-t border-base-300 bg-base-200/50 space-y-2">
            {(isSidebarOpen || isMobileSidebarOpen) && (
              <div className="flex items-center gap-2.5 bg-base-100 p-2.5 rounded-2xl border border-base-300 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-error/10 text-error font-extrabold flex items-center justify-center text-xs">
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">{user?.username || 'Admin'}</div>
                  <div className="text-[10px] text-base-content/60 truncate">{user?.email || 'admin@ambulance.com'}</div>
                </div>
              </div>
            )}

            {/* Desktop Toggle Collapse Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="btn btn-ghost btn-sm w-full hidden lg:flex items-center justify-center text-xs font-bold gap-2 text-base-content/70 hover:bg-base-300 rounded-xl"
              title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <FaBars />
              {isSidebarOpen && <span>Collapse Menu</span>}
            </button>
          </div>
        </aside>

        {/* --- MAIN BODY WITH TOP BAR --- */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Sticky Header */}
          <header className="bg-base-200/80 backdrop-blur-md border-b border-base-300 p-3.5 sm:p-5 sticky top-0 z-30 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="btn btn-ghost btn-sm btn-circle lg:hidden"
                title="Open Navigation"
              >
                <FaBars className="text-base" />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="btn btn-ghost btn-sm btn-circle hidden lg:flex"
                title="Toggle Sidebar"
              >
                <FaBars className="text-base" />
              </button>

              <div>
                <div className="text-[11px] font-bold text-error uppercase tracking-wider">
                  Dhaka Emergency Dispatch
                </div>
                <h1 className="text-base sm:text-xl font-black text-base-content">
                  {getHeaderTitle()}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="btn btn-sm btn-ghost gap-1.5 font-bold text-xs"
                title="Sync latest records from server"
              >
                <FaRedo className={`text-xs ${loading ? 'animate-spin text-error' : ''}`} />
                <span className="hidden sm:inline">Sync Data</span>
              </button>

              <Link
                to="/admin/add-vehicle"
                className="btn btn-sm btn-error text-white font-bold shadow-md gap-1 text-xs"
              >
                <FaPlus className="text-xs" />
                <span className="hidden sm:inline">Add Vehicle</span>
              </Link>
            </div>
          </header>

          {/* Sub-page Render Outlet */}
          <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
};

export default AdminLayout;
