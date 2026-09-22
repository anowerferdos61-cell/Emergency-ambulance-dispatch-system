import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', {
        email,
        new_password: newPassword,
      });
      toast.success(res.data?.message || 'Password has been reset successfully!');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to reset password. Please check your email.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="avatar placeholder mb-2">
              <div className="bg-primary/10 text-primary rounded-full p-4">
                <FaKey className="text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-black">Reset Password</h2>
            <p className="text-xs text-base-content/70 mt-1">Enter your registered email and choose a new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Registered Email</span>
              </label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full !pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">New Password</span>
              </label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full !pl-11"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm New Password</span>
              </label>
              <div className="relative flex items-center">
                <FaLock className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full !pl-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary text-white w-full font-bold shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm link link-hover text-base-content/70">
              <FaArrowLeft className="text-xs" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
