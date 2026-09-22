import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaAmbulance, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 rounded-3xl">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="avatar placeholder mb-2">
              <div className="bg-error/10 text-error rounded-full p-4">
                <FaAmbulance className="text-4xl" />
              </div>
            </div>
            <h2 className="text-2xl font-black">Account Login</h2>
            <p className="text-xs text-base-content/70 mt-1">
              Access Patient Dispatch, Driver Trips & Admin Panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold">Username or Email</span>
              </label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Enter username or email"
                  className="input input-bordered w-full !pl-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold">Password</span>
                <Link to="/forgot-password" className="label-text-alt link link-hover text-error text-xs font-semibold">
                  Forgot password?
                </Link>
              </label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full !pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-error text-white w-full font-bold shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FaSignInAlt /> Login to Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="divider text-xs text-base-content/50 my-4">OR</div>

          <div className="text-center text-xs">
            Don't have an account?{' '}
            <Link to="/signup" className="link text-error font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
