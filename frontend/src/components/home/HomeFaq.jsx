import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

export const HomeFaq = () => {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <span className="badge badge-error badge-outline font-bold text-xs uppercase tracking-wider">
          Help & Information
        </span>
        <h2 className="text-2xl sm:text-3xl font-black">Frequently Asked Questions</h2>
        <p className="text-xs sm:text-sm text-base-content/70 max-w-lg mx-auto">
          Everything you need to know about booking and dispatching ambulances in Dhaka.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <div className="collapse collapse-plus bg-base-200 border border-base-300 rounded-2xl">
          <input type="radio" name="faq-accordion" defaultChecked />
          <div className="collapse-title text-sm sm:text-base font-bold flex items-center gap-2">
            <FaQuestionCircle className="text-error" /> Is login required for emergency ambulance dispatch?
          </div>
          <div className="collapse-content text-xs sm:text-sm text-base-content/80">
            <p>Yes, for immediate emergency ambulance dispatch you must login or register to track your ambulance live and connect directly with the driver. Non-logged-in users can place advance scheduled bookings for future dates.</p>
          </div>
        </div>

        <div className="collapse collapse-plus bg-base-200 border border-base-300 rounded-2xl">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title text-sm sm:text-base font-bold flex items-center gap-2">
            <FaQuestionCircle className="text-error" /> How does advance scheduled booking work?
          </div>
          <div className="collapse-content text-xs sm:text-sm text-base-content/80">
            <p>You can choose a future date (tomorrow or later) and submit a schedule booking without logging in. Our Dhaka Admin Dispatch team reviews and confirms the assigned ambulance and driver ahead of time.</p>
          </div>
        </div>

        <div className="collapse collapse-plus bg-base-200 border border-base-300 rounded-2xl">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title text-sm sm:text-base font-bold flex items-center gap-2">
            <FaQuestionCircle className="text-error" /> What life support equipment is available in ICU ambulances?
          </div>
          <div className="collapse-content text-xs sm:text-sm text-base-content/80">
            <p>Our ICU ambulances in Dhaka are equipped with portable ventilators, cardiac monitors, defibrillators, oxygen cylinders, infusion pumps, and experienced paramedics trained in BLS/ACLS.</p>
          </div>
        </div>

        <div className="collapse collapse-plus bg-base-200 border border-base-300 rounded-2xl">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title text-sm sm:text-base font-bold flex items-center gap-2">
            <FaQuestionCircle className="text-error" /> Do you provide Freezer Van services in Dhaka?
          </div>
          <div className="collapse-content text-xs sm:text-sm text-base-content/80">
            <p>Yes, we have specialized temperature-controlled Freezer Vans stationed across Dhaka for respectful dead body transport across Dhaka or to any district in Bangladesh.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
