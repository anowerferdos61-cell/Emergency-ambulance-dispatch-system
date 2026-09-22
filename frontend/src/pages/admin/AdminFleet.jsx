import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../layouts/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FaAmbulance,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa';

export const AdminFleet = () => {
  const {
    ambulances,
    fetchDashboardData,
    editingAmbulance,
    setEditingAmbulance,
    deletingAmbulanceId,
    setDeletingAmbulanceId,
    handleDeleteAmbulance,
  } = useAdmin();

  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('');

  const [ambForm, setAmbForm] = useState({
    vehicle_number: '',
    ambulance_type: 'AC Ambulance',
    driver_name: '',
    driver_phone: '',
    base_location: '',
    base_fare: 1500,
    price_per_km: 50,
    status: 'available',
    image_url: '',
  });

  const openEditModal = (amb) => {
    setEditingAmbulance(amb);
    setAmbForm({
      vehicle_number: amb.vehicle_number,
      ambulance_type: amb.ambulance_type,
      driver_name: amb.driver_name,
      driver_phone: amb.driver_phone,
      base_location: amb.base_location,
      base_fare: amb.base_fare,
      price_per_km: amb.price_per_km,
      status: amb.status,
      image_url: amb.image_url || '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setAmbForm((prev) => ({
      ...prev,
      [name]: name === 'base_fare' || name === 'price_per_km' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSaveAmbulance = async (e) => {
    e.preventDefault();
    try {
      if (editingAmbulance) {
        await api.put(`/admin/ambulances/${editingAmbulance.id}`, ambForm);
        toast.success('Ambulance details updated');
        setEditingAmbulance(null);
      }
      fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Operation failed';
      toast.error(msg);
    }
  };

  const filteredAmbulances = ambulances.filter((a) => {
    const matchSearch =
      a.vehicle_number?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      a.driver_name?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      a.base_location?.toLowerCase().includes(vehicleSearch.toLowerCase());
    const matchType = !vehicleTypeFilter || a.ambulance_type === vehicleTypeFilter;
    const matchStatus = !vehicleStatusFilter || a.status === vehicleStatusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="bg-base-200 p-4 rounded-3xl border border-base-300 flex flex-wrap gap-3 justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
            <FaAmbulance className="text-error text-xl" /> Dhaka Ambulance Fleet ({ambulances.length})
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Search vehicle or driver..."
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              className="input input-bordered input-sm w-full pl-8 text-xs"
            />
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base-content/40 text-xs" />
          </div>

          <select
            className="select select-bordered select-sm text-xs"
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="AC Ambulance">AC Ambulance</option>
            <option value="Non-AC Ambulance">Non-AC Ambulance</option>
            <option value="ICU Ambulance">ICU Ambulance</option>
            <option value="Freezer Van">Freezer Van</option>
          </select>

          <select
            className="select select-bordered select-sm text-xs"
            value={vehicleStatusFilter}
            onChange={(e) => setVehicleStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="dispatched">Dispatched / On Trip</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <Link
            to="/admin/add-vehicle"
            className="btn btn-error text-white btn-sm font-bold shadow-sm gap-1"
          >
            <FaPlus /> Add Vehicle
          </Link>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-base-200 border border-base-300 rounded-3xl p-3 sm:p-5 shadow-sm">
        <div className="hidden lg:block overflow-x-auto">
          <table className="table table-zebra w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-base-300">
                <th>Plate Number</th>
                <th>Category</th>
                <th>Driver & Contact</th>
                <th>Station Hub</th>
                <th>Fare Rate</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAmbulances.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 opacity-60">
                    No ambulances found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredAmbulances.map((amb) => (
                  <tr key={amb.id} className="hover">
                    <td className="font-mono font-black text-sm text-error">
                      {amb.vehicle_number}
                    </td>
                    <td>
                      <span className="badge badge-sm badge-outline font-semibold">
                        {amb.ambulance_type}
                      </span>
                    </td>
                    <td>
                      <div className="font-bold">{amb.driver_name}</div>
                      <div className="text-xs text-base-content/60 font-mono">{amb.driver_phone}</div>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-ghost font-medium">
                        {amb.base_location}
                      </span>
                    </td>
                    <td>
                      <div className="font-black text-success">৳{amb.base_fare}</div>
                      <div className="text-[10px] text-base-content/60">+৳{amb.price_per_km}/km</div>
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm uppercase font-bold ${
                          amb.status === 'available'
                            ? 'badge-success text-white'
                            : amb.status === 'dispatched'
                            ? 'badge-warning text-red-950 font-black'
                            : 'badge-error text-white'
                        }`}
                      >
                        {amb.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openEditModal(amb)}
                          className="btn btn-xs btn-outline btn-primary gap-1 font-bold"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingAmbulanceId(amb.id)}
                          className="btn btn-xs btn-outline btn-error gap-1 font-bold"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAmbulances.length === 0 ? (
            <div className="col-span-full text-center py-8 opacity-60 text-xs">
              No ambulances found.
            </div>
          ) : (
            filteredAmbulances.map((amb) => (
              <div
                key={amb.id}
                className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-sm space-y-2.5 text-xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-black text-sm text-error font-mono">{amb.vehicle_number}</span>
                    <div className="text-[11px] text-base-content/60 font-semibold">{amb.ambulance_type}</div>
                  </div>
                  <span
                    className={`badge badge-xs font-bold uppercase ${
                      amb.status === 'available' ? 'badge-success text-white' : 'badge-warning'
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>

                <div className="bg-base-200 p-2.5 rounded-xl space-y-1">
                  <div><strong>Driver:</strong> {amb.driver_name} ({amb.driver_phone})</div>
                  <div className="truncate"><strong>Hub:</strong> {amb.base_location}</div>
                  <div><strong>Fare:</strong> <span className="font-bold text-success">৳{amb.base_fare}</span> (+৳{amb.price_per_km}/km)</div>
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-base-200">
                  <button
                    onClick={() => openEditModal(amb)}
                    className="btn btn-outline btn-xs btn-primary gap-1 font-bold"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => setDeletingAmbulanceId(amb.id)}
                    className="btn btn-outline btn-xs btn-error gap-1 font-bold"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- EDIT AMBULANCE MODAL --- */}
      {editingAmbulance && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-lg rounded-3xl p-5 sm:p-7">
            <h3 className="font-bold text-lg mb-3 text-error flex items-center gap-2">
              <FaEdit /> Edit Ambulance #{editingAmbulance.id}
            </h3>
            <form onSubmit={handleSaveAmbulance} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1 font-semibold">Plate Number</label>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={ambForm.vehicle_number}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1 font-semibold">Category</label>
                  <select
                    name="ambulance_type"
                    value={ambForm.ambulance_type}
                    onChange={handleFormChange}
                    className="select select-bordered select-sm"
                  >
                    <option value="AC Ambulance">AC Ambulance</option>
                    <option value="Non-AC Ambulance">Non-AC Ambulance</option>
                    <option value="ICU Ambulance">ICU Ambulance</option>
                    <option value="Freezer Van">Freezer Van</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1 font-semibold">Driver Name</label>
                  <input
                    type="text"
                    name="driver_name"
                    value={ambForm.driver_name}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1 font-semibold">Driver Phone</label>
                  <input
                    type="tel"
                    name="driver_phone"
                    value={ambForm.driver_phone}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1 font-semibold">Dhaka Station Hub</label>
                <input
                  type="text"
                  name="base_location"
                  value={ambForm.base_location}
                  onChange={handleFormChange}
                  className="input input-bordered input-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label py-1 font-semibold">Base Fare (৳)</label>
                  <input
                    type="number"
                    name="base_fare"
                    value={ambForm.base_fare}
                    onChange={handleFormChange}
                    className="input input-bordered input-sm font-bold"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1 font-semibold">Status</label>
                  <select
                    name="status"
                    value={ambForm.status}
                    onChange={handleFormChange}
                    className="select select-bordered select-sm"
                  >
                    <option value="available">Available</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="modal-action mt-5">
                <button
                  type="button"
                  onClick={() => setEditingAmbulance(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-error text-white btn-sm font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRM MODAL --- */}
      {deletingAmbulanceId && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm rounded-3xl p-6 text-center">
            <FaExclamationTriangle className="text-error text-4xl mx-auto mb-2" />
            <h3 className="font-extrabold text-lg text-error">Delete Vehicle?</h3>
            <p className="py-2 text-xs text-base-content/70">
              Are you sure you want to remove this ambulance from the Dhaka fleet?
            </p>
            <div className="modal-action justify-center gap-2 mt-4">
              <button
                onClick={() => setDeletingAmbulanceId(null)}
                className="btn btn-ghost btn-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAmbulance(deletingAmbulanceId)}
                className="btn btn-error text-white btn-sm font-bold shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFleet;
