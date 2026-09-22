import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaHome } from 'react-icons/fa';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FaExclamationCircle className="text-7xl text-error mb-4" />
      <h1 className="text-5xl font-black mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-base-content/70 max-w-md mb-6">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary gap-2">
        <FaHome /> Return to Home
      </Link>
    </div>
  );
};
