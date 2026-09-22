import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaLock,
  FaKey,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaSave,
} from 'react-icons/fa';

export const UserSecurity = () => {
  const { changePassword } = useAuth();
  const [savingPassword, setSavingPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.new_password.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      toast.success('Password updated successfully!', { icon: '🔑' });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Failed to update password';
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-300 shadow-sm space-y-1">
        <h2 className="text-xl sm:text-2xl font-black">🔒 Security & Password</h2>
        <p className="text-xs text-base-content/60">
          Keep your emergency account secure with a strong password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Password Form */}
        <div className="lg:col-span-2 card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="flex items-center gap-2 font-black text-base border-b border-base-300 pb-3">
              <FaKey className="text-error" /> Update Account Password
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Current Password <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter current password"
                  className="input input-bordered input-sm sm:input-md w-full pr-10 text-xs sm:text-sm font-semibold"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-error text-sm"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  New Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    className="input input-bordered input-sm sm:input-md w-full pr-10 text-xs sm:text-sm font-semibold"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-error text-sm"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                  Confirm New Password <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm font-semibold"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-error text-white font-extrabold w-full sm:w-auto px-8 rounded-2xl shadow-md gap-2"
              >
                {savingPassword ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <FaSave /> Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips Card */}
        <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-black text-base text-primary border-b border-base-300 pb-3">
            <FaShieldAlt /> Security Checklist
          </div>

          <div className="space-y-3 text-xs text-base-content/80">
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-0.5 shrink-0" />
              <span>Use a unique password of at least 8 characters with numbers & symbols.</span>
            </div>
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-0.5 shrink-0" />
              <span>Ensure your phone number is always active to receive driver call confirmations.</span>
            </div>
            <div className="flex items-start gap-2">
              <FaCheckCircle className="text-success mt-0.5 shrink-0" />
              <span>Never share your password or OTP with anyone claiming to be dispatch staff.</span>
            </div>
          </div>

          <div className="bg-base-200/70 p-3.5 rounded-2xl text-[11px] text-base-content/60">
            <strong>Need help?</strong> If you suspect any unauthorized activity on your ambulance dispatches, contact emergency support immediately at <strong>01303-446161</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSecurity;
