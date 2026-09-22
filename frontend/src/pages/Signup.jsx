import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaUserPlus, FaShieldAlt, FaAmbulance, FaIdCard, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'user', // "user", "driver", "admin"
    driving_license: '',
    vehicle_number: '',
    ambulance_type: 'AC Ambulance',
    base_location: 'Dhanmondi',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: formData.username,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        role: formData.role,
        driving_license: formData.role === 'driver' ? formData.driving_license : null,
        vehicle_number: formData.role === 'driver' ? formData.vehicle_number : null,
        ambulance_type: formData.role === 'driver' ? formData.ambulance_type : null,
        base_location: formData.role === 'driver' ? formData.base_location : null,
      });
      navigate('/login');
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="card w-full max-w-xl bg-base-100 shadow-2xl border border-base-300 rounded-3xl">
        <div className="card-body p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black">Create an Account</h2>
            <p className="text-xs text-base-content/70 mt-1">
              Join Emergency Ambulance Service Dhaka System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {/* Role Selection Tabs */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold">I am registering as:</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`label cursor-pointer rounded-2xl p-3 border-2 flex flex-col items-center gap-1 transition ${
                    formData.role === 'user'
                      ? 'border-primary bg-primary/10 font-bold text-primary'
                      : 'border-base-300 hover:border-base-content/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaUser className="text-xl" />
                  <span className="text-xs">Patient / User</span>
                </label>

                <label
                  className={`label cursor-pointer rounded-2xl p-3 border-2 flex flex-col items-center gap-1 transition ${
                    formData.role === 'driver'
                      ? 'border-warning bg-warning/10 font-bold text-yellow-700'
                      : 'border-base-300 hover:border-base-content/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="driver"
                    checked={formData.role === 'driver'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaAmbulance className="text-xl" />
                  <span className="text-xs">Ambulance Driver</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold">Username *</span></label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                  <input
                    type="text"
                    name="username"
                    placeholder="john_doe"
                    className="input input-bordered input-sm sm:input-md w-full !pl-11"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold">Phone Number *</span></label>
                <div className="relative flex items-center">
                  <FaPhoneAlt className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="017XXXXXXXX"
                    className="input input-bordered input-sm sm:input-md w-full !pl-11"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1"><span className="label-text font-semibold">Email Address *</span></label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="input input-bordered input-sm sm:input-md w-full !pl-11"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Additional fields for Driver */}
            {formData.role === 'driver' && (
              <div className="p-4 bg-warning/10 border border-warning/30 rounded-2xl space-y-3">
                <div className="font-bold text-xs text-yellow-800 flex items-center gap-1.5">
                  <FaIdCard /> Driver & Ambulance Details (Enrolled into Fleet upon Approval):
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-control">
                    <label className="label py-0 text-xs font-semibold">Driving License No. *</label>
                    <input
                      type="text"
                      name="driving_license"
                      placeholder="e.g. DL-12345678"
                      className="input input-bordered input-sm w-full font-medium"
                      value={formData.driving_license}
                      onChange={handleChange}
                      required={formData.role === 'driver'}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-0 text-xs font-semibold">Ambulance Plate No. *</label>
                    <input
                      type="text"
                      name="vehicle_number"
                      placeholder="e.g. ঢাকা-মেট্রো-ছ-১১-১২৩৪"
                      className="input input-bordered input-sm w-full font-medium"
                      value={formData.vehicle_number}
                      onChange={handleChange}
                      required={formData.role === 'driver'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="form-control">
                    <label className="label py-0 text-xs font-semibold flex items-center gap-1">
                      <FaAmbulance className="text-warning" /> Ambulance Type *
                    </label>
                    <select
                      name="ambulance_type"
                      value={formData.ambulance_type}
                      onChange={handleChange}
                      className="select select-bordered select-sm w-full font-medium"
                    >
                      <option value="AC Ambulance">AC Ambulance</option>
                      <option value="ICU Ambulance">ICU Ambulance (Ventilator)</option>
                      <option value="Non-AC Ambulance">Non-AC Ambulance</option>
                      <option value="Freezer Van">Freezer Van</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label py-0 text-xs font-semibold flex items-center gap-1">
                      <FaMapMarkerAlt className="text-error" /> Station / Base Hub *
                    </label>
                    <select
                      name="base_location"
                      value={formData.base_location}
                      onChange={handleChange}
                      className="select select-bordered select-sm w-full font-medium"
                    >
                      <option value="Dhanmondi">Dhanmondi Hub</option>
                      <option value="Gulshan">Gulshan / Banani Hub</option>
                      <option value="Uttara">Uttara Hub</option>
                      <option value="Mirpur">Mirpur Hub</option>
                      <option value="Mohakhali">Mohakhali Hub</option>
                      <option value="Shahbagh">Shahbagh (PG/DMCH) Hub</option>
                      <option value="Motijheel">Motijheel / Old Dhaka Hub</option>
                      <option value="Mohammadpur">Mohammadpur Hub</option>
                      <option value="Badda">Badda / Rampura Hub</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold">Password *</span></label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered input-sm sm:input-md w-full !pl-11"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1"><span className="label-text font-semibold">Confirm Password *</span></label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3.5 text-base-content/40 text-sm pointer-events-none z-10" />
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="••••••••"
                    className="input input-bordered input-sm sm:input-md w-full !pl-11"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                    <FaUserPlus /> Complete Registration
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-xs mt-4">
            Already registered?{' '}
            <Link to="/login" className="link text-error font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
