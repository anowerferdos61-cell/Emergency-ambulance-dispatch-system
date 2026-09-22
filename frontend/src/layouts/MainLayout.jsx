import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content selection:bg-error selection:text-white">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-6">
        {/* Child routes will be rendered here */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
