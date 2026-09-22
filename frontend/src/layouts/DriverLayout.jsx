import { Outlet } from 'react-router-dom';
import { DriverNavbar } from '../components/DriverNavbar';

export const DriverLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content selection:bg-warning selection:text-red-950">
      <DriverNavbar />

      <main className="container mx-auto px-3 sm:px-6 lg:px-8 flex-1 py-6">
        <Outlet />
      </main>

      <footer className="footer footer-center p-4 bg-base-200 text-base-content/70 text-xs border-t border-base-300">
        <div>
          <p>© 2026 Emergency Ambulance Service Dhaka • Driver Operations & Emergency Dispatch Portal</p>
        </div>
      </footer>
    </div>
  );
};

export default DriverLayout;
