import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaSave,
  FaUserShield,
  FaCheckCircle,
} from 'react-icons/fa';

export const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    blood_group: 'A+',
    medical_notes: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    address: 'Dhanmondi, Dhaka',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/me');
      setFormData((prev) => ({
        ...prev,
        username: res.data.username || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || '',
      }));
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        phone_number: formData.phone_number,
      });
      toast.success('Profile details updated successfully!', { icon: '✅' });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-300 shadow-sm space-y-1">
        <h2 className="text-xl sm:text-2xl font-black">👤 My Profile & Emergency Info</h2>
        <p className="text-xs text-base-content/60">
          Manage your contact credentials, blood group, and emergency guardian info for rapid paramedic response.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-black text-base border-b border-base-300 pb-3">
            <FaUser className="text-error" /> Personal Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Username (Account Identifier)
              </label>
              <input
                type="text"
                disabled
                className="input input-bordered input-sm sm:input-md w-full font-bold bg-base-200 cursor-not-allowed"
                value={formData.username}
              />
              <span className="text-[10px] text-base-content/50 mt-1 block">Username cannot be changed.</span>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                className="input input-bordered input-sm sm:input-md w-full font-bold bg-base-200 cursor-not-allowed"
                value={formData.email || 'user@example.com'}
              />
              <span className="text-[10px] text-base-content/50 mt-1 block">Registered email for invoice copies.</span>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Primary Phone Number <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                className="input input-bordered input-sm sm:input-md w-full font-bold"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
              <span className="text-[10px] text-base-content/50 mt-1 block">Drivers will call this number during dispatch.</span>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Primary Residence / Hub
              </label>
              <input
                type="text"
                className="input input-bordered input-sm sm:input-md w-full font-bold"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Medical SOS Card */}
        <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-base-300 pb-3">
            <div className="flex items-center gap-2 font-black text-base">
              <FaHeartbeat className="text-error" /> Emergency Medical Profile
            </div>
            <span className="badge badge-error badge-outline text-[10px] font-bold">Paramedic Access Only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Blood Group
              </label>
              <select
                className="select select-bordered select-sm sm:select-md w-full font-bold"
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    🩸 {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Chronic Medical Conditions / Allergies (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Asthma, Penicillin allergy, Diabetes"
                className="input input-bordered input-sm sm:input-md w-full"
                value={formData.medical_notes}
                onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Emergency Guardian Contact */}
        <div className="card bg-base-100 border border-base-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-black text-base border-b border-base-300 pb-3">
            <FaUserShield className="text-primary" /> Emergency Guardian / Next of Kin
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Farhana Begum"
                className="input input-bordered input-sm sm:input-md w-full font-semibold"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Relationship
              </label>
              <input
                type="text"
                placeholder="e.g. Spouse / Father / Sister"
                className="input input-bordered input-sm sm:input-md w-full font-semibold"
                value={formData.emergency_contact_relation}
                onChange={(e) => setFormData({ ...formData, emergency_contact_relation: e.target.value })}
              />
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-base-content/70 block mb-1">
                Guardian Phone Number
              </label>
              <input
                type="tel"
                placeholder="017xxxxxxxx"
                className="input input-bordered input-sm sm:input-md w-full font-semibold"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-error text-white font-extrabold px-8 rounded-2xl shadow-lg gap-2"
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <>
                <FaSave /> Save Profile Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
