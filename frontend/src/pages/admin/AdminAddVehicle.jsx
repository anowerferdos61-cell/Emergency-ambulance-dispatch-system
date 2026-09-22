import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../layouts/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaAmbulance } from 'react-icons/fa';

export const AdminAddVehicle = () => {
  const { fetchDashboardData } = useAdmin();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [ambForm, setAmbForm] = useState({
    vehicle_number: '',
    ambulance_type: 'AC Ambulance',
    driver_name: '',
    driver_phone: '',
    base_location: 'Dhanmondi, Dhaka',
    base_fare: 1500,
    price_per_km: 50,
    status: 'available',
    image_url: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAmbForm((prev) => ({
      ...prev,
      [name]: name === 'base_fare' || name === 'price_per_km' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveAmbulance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/ambulances', ambForm);
      toast.success('New vehicle added to fleet!');
      fetchDashboardData();
      navigate('/admin/fleet');
    } catch (error) {
      const msg = error.response?.data?.detail || 'Operation failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-base-200 border border-base-300 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-extrabold text-lg sm:text-xl mb-1 text-error flex items-center gap-2">
          <FaPlus /> Register New Dhaka Ambulance
        </h3>
        <p className="text-xs text-base-content/60 mb-6">
          Add an ambulance unit with designated driver info and zone hub.
        </p>

        <form onSubmit={handleSaveAmbulance} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-bold">Vehicle License Plate *</label>
              <input
                type="text"
                name="vehicle_number"
                value={ambForm.vehicle_number}
                onChange={handleFormChange}
                placeholder="e.g. ঢাকা-মেট্রো-হ-১২-৩৪৫৬"
                className="input input-bordered input-sm sm:input-md"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Ambulance Category *</label>
              <select
                name="ambulance_type"
                value={ambForm.ambulance_type}
                onChange={handleFormChange}
                className="select select-bordered select-sm sm:select-md"
              >
                <option value="AC Ambulance">AC Ambulance</option>
                <option value="Non-AC Ambulance">Non-AC Ambulance</option>
                <option value="ICU Ambulance">ICU Ambulance</option>
                <option value="Freezer Van">Freezer Van</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-bold">Assigned Driver Name *</label>
              <input
                type="text"
                name="driver_name"
                value={ambForm.driver_name}
                onChange={handleFormChange}
                placeholder="e.g. Md. Kabir Hossain"
                className="input input-bordered input-sm sm:input-md"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Driver Emergency Phone *</label>
              <input
                type="tel"
                name="driver_phone"
                value={ambForm.driver_phone}
                onChange={handleFormChange}
                placeholder="017xxxxxxxx"
                className="input input-bordered input-sm sm:input-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label font-bold">Station Hub (Dhaka) *</label>
              <input
                type="text"
                name="base_location"
                value={ambForm.base_location}
                onChange={handleFormChange}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="input input-bordered input-sm sm:input-md"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Base Fare (৳) *</label>
              <input
                type="number"
                name="base_fare"
                value={ambForm.base_fare}
                onChange={handleFormChange}
                className="input input-bordered input-sm sm:input-md font-bold"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-bold">Price / km (৳) *</label>
              <input
                type="number"
                name="price_per_km"
                value={ambForm.price_per_km}
                onChange={handleFormChange}
                className="input input-bordered input-sm sm:input-md font-bold"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/fleet')}
              className="btn btn-ghost btn-sm sm:btn-md"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-error text-white btn-sm sm:btn-md font-bold shadow-lg shadow-error/30 gap-2"
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <FaAmbulance /> Register Ambulance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddVehicle;
