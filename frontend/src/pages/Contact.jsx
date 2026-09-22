import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPhoneVolume, FaClock, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Please provide your name and phone number');
      return;
    }
    toast.success('Thank you! Our emergency support team will contact you shortly.');
    setSubmitted(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-3">
        <span className="badge badge-warning font-bold text-xs uppercase tracking-wider py-2 px-3">
          24/7 Helpline & Support
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">Contact Emergency Ambulance Service Dhaka</h1>
        <p className="text-gray-300 mt-2 max-w-xl mx-auto">
          Need immediate ambulance dispatch, hospital transfer, or have a query? We are here 24 hours a day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl text-xl">
                <FaPhoneAlt className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">24/7 Emergency Hotline</h3>
                <a href="tel:01303446161" className="text-error font-black text-lg hover:underline">
                  01303-446161
                </a>
              </div>
            </div>
            <p className="text-xs text-base-content/70">
              Direct emergency dispatch line for all Dhaka areas.
            </p>
          </div>

          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl text-xl">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Central Control Room</h3>
                <p className="text-xs text-base-content/80 font-medium">
                  House 42, Road 11, Dhanmondi, Dhaka 1209
                </p>
              </div>
            </div>
            <p className="text-xs text-base-content/70">
              Sub-stations stationed in Gulshan, Uttara, Mirpur & Shahbagh.
            </p>
          </div>

          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl text-xl">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Email Inquiry</h3>
                <p className="text-xs text-base-content/80 font-medium">
                  support@nationalambulancedhaka.com
                </p>
              </div>
            </div>
            <p className="text-xs text-base-content/70">
              For corporate tie-ups and non-urgent booking quotes.
            </p>
          </div>
        </div>

        {/* Contact / Feedback Form (2 cols) */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border-2 border-base-300 shadow-md p-6 sm:p-8 rounded-3xl">
            <h2 className="text-2xl font-black mb-1">Send Us a Message</h2>
            <p className="text-xs sm:text-sm text-base-content/70 mb-6">
              Fill out the form below for service inquiries, corporate tie-ups, or pre-scheduled ambulance bookings.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1 font-semibold">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="input input-bordered input-sm sm:input-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1 font-semibold">Contact Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    className="input input-bordered input-sm sm:input-md"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label py-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered input-sm sm:input-md"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label py-1 font-semibold">Inquiry / Patient Transfer Details</label>
                <textarea
                  placeholder="Mention patient condition, pickup point, destination hospital, or any specific question..."
                  rows="4"
                  className="textarea textarea-bordered textarea-sm sm:textarea-md"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-error text-white font-bold btn-md shadow-md gap-2">
                <FaPaperPlane /> Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
