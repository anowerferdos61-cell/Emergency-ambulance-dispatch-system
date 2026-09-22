import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaIdCard,
  FaAmbulance,
  FaCheckCircle,
  FaClock,
  FaKey,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaTachometerAlt
} from 'react-icons/fa';

export const Profile = () => {
  const { user, updateProfile, changePassword, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'password' ? 'password' : 'edit');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    driving_license: '',
    vehicle_number: '',
    role: '',
    is_verified: false,
    created_at: ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  const fetchCurrentUserData = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get('/auth/me');
      setFormData({
        username: res.data.username || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || '',
        driving_license: res.data.driving_license || '',
        vehicle_number: res.data.vehicle_number || '',
        role: res.data.role || 'user',
        is_verified: res.data.is_verified || false,
        created_at: res.data.created_at || ''
      });
    } catch (error) {
      toast.error('Failed to load profile details');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        driving_license: formData.driving_license,
        vehicle_number: formData.vehicle_number
      });
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(passwordData.current_password, passwordData.new_password);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setSavingPassword(false);
    }
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (user?.role === 'driver') return '/driver';
    return '/dashboard';
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <span className="loading loading-spinner loading-lg text-error"></span>
        <p className="text-sm font-bold text-base-content/70">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-2">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black shadow-inner border border-white/30">
            {formData.username ? formData.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{formData.username}</h1>
              <span className={`badge font-bold uppercase text-xs ${
                isAdmin
                  ? 'badge-warning text-red-950'
                  : formData.role === 'driver'
                  ? 'badge-warning text-red-950'
                  : 'badge-neutral bg-white/20 text-white border-none'
              }`}>
                {formData.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 mt-0.5">{formData.email}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(getDashboardPath())}
          className="btn btn-sm bg-white/20 hover:bg-white text-white hover:text-red-700 border-none rounded-xl gap-2 font-bold shadow-md"
        >
          <FaTachometerAlt /> Back to Dashboard
        </button>
      </div>

      {/* Driver Verification Status Banner */}
      {formData.role === 'driver' && (
        <div className={`p-5 rounded-2xl border flex items-center gap-3 ${
          formData.is_verified
            ? 'bg-success/10 border-success/30 text-success'
            : 'bg-warning/10 border-warning/30 text-warning-content'
        }`}>
          {formData.is_verified ? (
            <>
              <FaCheckCircle className="text-2xl shrink-0 text-success" />
              <div>
                <h4 className="font-extrabold text-sm text-success">Verified Driver Account</h4>
                <p className="text-xs text-base-content/70">
                  Your ambulance dispatch certification is active. You will receive real-time emergency trip requests.
                </p>
              </div>
            </>
          ) : (
            <>
              <FaClock className="text-2xl shrink-0 text-warning" />
              <div>
                <h4 className="font-extrabold text-sm text-warning">Pending Administrator Verification</h4>
                <p className="text-xs text-base-content/70">
                  Your driver registration is under review. Please ensure your driving license and ambulance vehicle number are up to date.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-base-300 gap-2">
        <button
          onClick={() => setActiveTab('edit')}
          className={`pb-3 px-4 font-bold text-sm sm:text-base flex items-center gap-2 border-b-2 transition ${
            activeTab === 'edit'
              ? 'border-error text-error'
              : 'border-transparent text-base-content/60 hover:text-base-content'
          }`}
        >
          <FaUser /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`pb-3 px-4 font-bold text-sm sm:text-base flex items-center gap-2 border-b-2 transition ${
            activeTab === 'password'
              ? 'border-error text-error'
              : 'border-transparent text-base-content/60 hover:text-base-content'
          }`}
        >
          <FaKey /> Change Password
        </button>
      </div>

      {/* Tab 1: Edit Profile */}
      {activeTab === 'edit' && (
        <form onSubmit={handleProfileSubmit} className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black">Personal & Account Information</h3>
            <p className="text-xs text-base-content/60">
              Update your contact information and profile details used for ambulance dispatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase flex items-center gap-1.5">
                  <FaUser className="text-error" /> Username
                </span>
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input input-bordered focus:input-error rounded-xl font-semibold"
                placeholder="Your username"
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase flex items-center gap-1.5">
                  <FaEnvelope className="text-error" /> Email Address
                </span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input input-bordered focus:input-error rounded-xl font-semibold"
                placeholder="name@example.com"
              />
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase flex items-center gap-1.5">
                  <FaPhone className="text-error" /> Contact Phone Number
                </span>
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="input input-bordered focus:input-error rounded-xl font-semibold"
                placeholder="e.g. 01700-000000"
              />
            </div>

            {/* Account Role (Read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase flex items-center gap-1.5">
                  <FaShieldAlt className="text-error" /> Account Role
                </span>
              </label>
              <input
                type="text"
                disabled
                value={formData.role.toUpperCase()}
                className="input input-bordered bg-base-200 rounded-xl font-bold cursor-not-allowed opacity-80"
              />
            </div>

            {/* Driver Specific Fields */}
            {formData.role === 'driver' && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-xs uppercase flex items-center gap-1.5">
                      <FaIdCard className="text-warning" /> Driving License Number
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.driving_license}
                    onChange={(e) => setFormData({ ...formData, driving_license: e.target.value })}
                    className="input input-bordered focus:input-warning rounded-xl font-semibold"
                    placeholder="e.g. DL-12345678"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-xs uppercase flex items-center gap-1.5">
                      <FaAmbulance className="text-warning" /> Assigned Ambulance Number
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.vehicle_number}
                    onChange={(e) => setFormData({ ...formData, vehicle_number: e.target.value })}
                    className="input input-bordered focus:input-warning rounded-xl font-semibold"
                    placeholder="e.g. DHA-EM-101"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-base-200">
            <button
              type="submit"
              disabled={savingProfile}
              className="btn btn-error text-white font-bold px-8 shadow-lg gap-2 rounded-xl"
            >
              {savingProfile ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FaSave /> Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Change Password */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black flex items-center gap-2">
              <FaLock className="text-error" /> Change Account Password
            </h3>
            <p className="text-xs text-base-content/60">
              Ensure your account is protected with a strong, secure password of at least 6 characters.
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            {/* Current Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase">Current Password</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="input input-bordered focus:input-error rounded-xl w-full pr-10 font-semibold"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content text-sm"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase">New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="input input-bordered focus:input-error rounded-xl w-full pr-10 font-semibold"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content text-sm"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-xs uppercase">Confirm New Password</span>
              </label>
              <input
                type="password"
                required
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="input input-bordered focus:input-error rounded-xl w-full font-semibold"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-base-200">
            <button
              type="submit"
              disabled={savingPassword}
              className="btn btn-error text-white font-bold px-8 shadow-lg gap-2 rounded-xl"
            >
              {savingPassword ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <FaKey /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
