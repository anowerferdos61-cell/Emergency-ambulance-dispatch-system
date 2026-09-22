import React from 'react';
import { FaAmbulance } from 'react-icons/fa';

export const HomeDispatchModal = ({
  bookingAmbulance,
  setBookingAmbulance,
  bookingForm,
  setBookingForm,
  submittingBooking,
  user,
  todayDateStr,
  tomorrowDateStr,
  handleConfirmBooking,
  navigate,
}) => {
  if (!bookingAmbulance) return null;

  const isSelectedDateToday = bookingForm.booking_date === todayDateStr;

  return (
    <div className="modal modal-open z-50">
      <div className="modal-box max-w-lg rounded-3xl border border-base-300 shadow-2xl p-6 bg-base-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-base-300">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-error/10 text-error flex items-center justify-center font-bold text-lg">
              <FaAmbulance />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {user ? '⚡ Instant Emergency Dispatch' : '📅 Advance Schedule Booking'}
              </h3>
              <p className="text-xs text-base-content/60">
                {bookingAmbulance.ambulance_type || bookingAmbulance.type} • {bookingAmbulance.base_location}
              </p>
            </div>
          </div>
          <button
            onClick={() => setBookingAmbulance(null)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Non-login Notice */}
        {!user && (
          <div className="bg-info/10 border border-info/30 text-info-content p-3.5 rounded-2xl mb-4 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-base">📅</span>
              <div>
                <strong className="font-bold block">অ্যাডভান্স শিডিউল বুকিং (নন-লগইন):</strong>
                <p className="opacity-90">
                  ভবিষ্যতের যেকোনো তারিখের জন্য বুকিং জমা দিতে নিচের ফর্মটি পূরণ করুন। আমাদের অ্যাডমিন টিম পর্যালোচনা করে অ্যাম্বুলেন্স নিশ্চিত ও অ্যাসাইন করবে।
                </p>
              </div>
            </div>

            <div className="bg-base-100 p-2.5 rounded-xl border border-info/20 flex items-center justify-between gap-2 mt-1">
              <span className="text-[11px] font-semibold text-base-content/80">
                🚨 আজকেই জরুরি অ্যাম্বুলেন্স সরাসরি ডিসপ্যাচ চান?
              </span>
              <button
                type="button"
                onClick={() => {
                  setBookingAmbulance(null);
                  navigate('/login');
                }}
                className="btn btn-xs btn-error text-white font-bold"
              >
                লগইন করুন
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleConfirmBooking} className="space-y-3.5">
          {/* Date Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 flex items-center justify-between">
              <span>
                {user ? 'প্রয়োজনীয় তারিখ (Date)' : 'নির্ধারিত তারিখ (Schedule Date - আগামীকাল বা পরে) *'}
              </span>
              {!user && (
                <span className="badge badge-info badge-xs font-bold text-white">ভবিষ্যতের তারিখ আবশ্যক</span>
              )}
            </label>
            <input
              type="date"
              required
              min={user ? todayDateStr : tomorrowDateStr}
              className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm font-semibold"
              value={bookingForm.booking_date}
              onChange={(e) => setBookingForm({ ...bookingForm, booking_date: e.target.value })}
            />
          </div>

          {/* Patient Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
                Patient Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahim Khan"
                className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
                value={bookingForm.patient_name}
                onChange={(e) => setBookingForm({ ...bookingForm, patient_name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
                Contact Phone <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="017xxxxxxxx"
                className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
                value={bookingForm.contact_number}
                onChange={(e) => setBookingForm({ ...bookingForm, contact_number: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
              Pickup Location <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House 12, Road 5, Dhanmondi 27"
              className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
              value={bookingForm.pickup_location}
              onChange={(e) => setBookingForm({ ...bookingForm, pickup_location: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
              Destination / Hospital <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhaka Medical College Hospital"
              className="input input-bordered input-sm sm:input-md w-full text-xs sm:text-sm"
              value={bookingForm.hospital_destination}
              onChange={(e) => setBookingForm({ ...bookingForm, hospital_destination: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1 block">
              Severity / Purpose
            </label>
            <select
              className="select select-bordered select-sm sm:select-md w-full text-xs sm:text-sm"
              value={bookingForm.emergency_severity}
              onChange={(e) => setBookingForm({ ...bookingForm, emergency_severity: e.target.value })}
            >
              <option value="Normal">🟢 Normal (Scheduled / Patient Transfer)</option>
              <option value="Urgent">🟠 Urgent (Priority Transport)</option>
              <option value="Critical">🔴 Critical (ICU / Oxygen Required)</option>
            </select>
          </div>

          <div className="bg-base-200 p-3 rounded-2xl space-y-1 text-xs text-base-content/80">
            <div className="flex justify-between">
              <span className="opacity-70">Vehicle Plate:</span>
              <span className="font-mono font-bold">{bookingAmbulance.vehicle_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Driver Contact:</span>
              <span className="font-semibold">{bookingAmbulance.driver_name || 'Assigned Driver'} ({bookingAmbulance.driver_phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Base Fare Estimate:</span>
              <span className="font-bold text-error">৳{bookingAmbulance.base_fare || 1500}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setBookingAmbulance(null)}
              className="btn btn-ghost flex-1 rounded-2xl"
              disabled={submittingBooking}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingBooking}
              className={`btn flex-1 rounded-2xl shadow-lg ${
                user ? 'btn-error text-white shadow-error/30' : 'btn-info text-white shadow-info/30'
              }`}
            >
              {submittingBooking ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : isSelectedDateToday ? (
                '🚨 সরাসরি ডিসপ্যাচ নিশ্চিত করুন'
              ) : (
                '📅 শিডিউল বুকিং জমা দিন'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={() => setBookingAmbulance(null)}></div>
    </div>
  );
};
