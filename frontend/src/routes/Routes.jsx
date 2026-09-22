import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DriverLayout } from '../layouts/DriverLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Pages
import { Home } from '../pages/Home';
import { Services } from '../pages/Services';
import { Coverage } from '../pages/Coverage';
import { Hospitals } from '../pages/Hospitals';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { ForgotPassword } from '../pages/ForgotPassword';
import { UserDashboard } from '../pages/UserDashboard';
import { DriverDashboard } from '../pages/DriverDashboard';
import { Profile } from '../pages/Profile';
import { TripTracker } from '../pages/TripTracker';
import { NotFound } from '../pages/NotFound';

import { UserLayout } from '../layouts/UserLayout';
import { Navigate } from 'react-router-dom';

// Modular User Dashboard Pages
import { UserOverview } from '../pages/user/UserOverview';
import { UserDispatch } from '../pages/user/UserDispatch';
import { UserSchedule } from '../pages/user/UserSchedule';
import { UserHistory } from '../pages/user/UserHistory';
import { UserProfile } from '../pages/user/UserProfile';
import { UserSecurity } from '../pages/user/UserSecurity';

// Modular Admin Pages
import { AdminOverview } from '../pages/admin/AdminOverview';
import { AdminFleet } from '../pages/admin/AdminFleet';
import { AdminRequests } from '../pages/admin/AdminRequests';
import { AdminDrivers } from '../pages/admin/AdminDrivers';
import { AdminAddVehicle } from '../pages/admin/AdminAddVehicle';
import { AdminUsers } from '../pages/admin/AdminUsers';

export const router = createBrowserRouter([
  // 1. Public & Patient User Routes (uses MainLayout with public Navbar & Footer)
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'coverage',
        element: <Coverage />,
      },
      {
        path: 'hospitals',
        element: <Hospitals />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'schedule',
        element: <UserSchedule />,
      },
      {
        path: 'profile',
        element: <Navigate to="/dashboard/profile" replace />,
      },
      {
        path: 'track/:requestId',
        element: <TripTracker />,
      },
    ],
  },

  // 2. Patient / User Portal (uses UserLayout with Collapsible Sidebar & Subpages)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <UserOverview />,
      },
      {
        path: 'dispatch',
        element: <UserDispatch />,
      },
      {
        path: 'schedule',
        element: <UserSchedule />,
      },
      {
        path: 'history',
        element: <UserHistory />,
      },
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: 'security',
        element: <UserSecurity />,
      },
    ],
  },

  // 3. Dedicated Ambulance Driver Portal (uses DriverLayout with DriverNavbar)
  {
    path: '/driver',
    element: (
      <ProtectedRoute requiredRole="driver">
        <DriverLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DriverDashboard />,
      },
      {
        path: 'dashboard',
        element: <DriverDashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },

  // 3. Admin Control Center (uses AdminLayout with modular child routes)
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <AdminOverview />,
      },
      {
        path: 'dashboard',
        element: <AdminOverview />,
      },
      {
        path: 'fleet',
        element: <AdminFleet />,
      },
      {
        path: 'dhaka-fleet',
        element: <AdminFleet />,
      },
      {
        path: 'requests',
        element: <AdminRequests />,
      },
      {
        path: 'drivers',
        element: <AdminDrivers />,
      },
      {
        path: 'add-vehicle',
        element: <AdminAddVehicle />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
    ],
  },

  // 4. 404 Fallback
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
