import { Link } from 'react-router-dom';
import { FaHospital, FaPhoneAlt, FaMapMarkerAlt, FaHeartbeat, FaAmbulance, FaShieldAlt } from 'react-icons/fa';

export const Hospitals = () => {
  const hospitals = [
    {
      name: 'Dhaka Medical College Hospital (DMCH)',
      category: 'Top Government Tertiary & Trauma Center',
      location: 'Secretariat Road, Shahbagh, Dhaka',
      emergencyPhone: '02-55165088',
      facilities: ['24/7 Trauma Emergency', 'Govt. Subsidized ICU', 'Burn & Plastic Surgery Unit', 'Dialysis Center'],
      ambulanceGate: 'Emergency Gate No. 1 & 2',
    },
    {
      name: 'Square Hospitals Limited',
      category: 'Private Specialized Tertiary Care',
      location: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Panthapath, Dhaka',
      emergencyPhone: '10616 / 01713377775',
      facilities: ['24/7 Level-1 Emergency & Trauma', 'Advanced Neonatal & Adult ICU', 'Cardiac Catheterization Lab', 'Stroke Center'],
      ambulanceGate: 'Direct Ramp Access (Panthapath Road)',
    },
    {
      name: 'Evercare Hospital Dhaka (formerly Apollo)',
      category: 'International Standard Multi-Disciplinary',
      location: 'Plot 81, Block E, Bashundhara R/A, Dhaka',
      emergencyPhone: '10678 / 02-8431661',
      facilities: ['JCI Accredited Emergency Center', 'Comprehensive Heart Center', 'Advanced Pediatric ICU', 'Organ Transplant Support'],
      ambulanceGate: 'Dedicated Emergency Entrance (Bashundhara Gate 3)',
    },
    {
      name: 'United Hospital Limited',
      category: 'Specialized Cardiac & Critical Care',
      location: 'Plot 15, Road 71, Gulshan-2, Dhaka',
      emergencyPhone: '10666 / 01914001234',
      facilities: ['Comprehensive Cardiac ICU & CCU', 'Emergency Stroke Team', 'Renal Transplant Unit', 'Oncology Care'],
      ambulanceGate: 'Gulshan Lake Road Emergency Bay',
    },
    {
      name: 'BSMMU (Bangabandhu Sheikh Mujib Medical University)',
      category: 'National Medical University & Super Specialized',
      location: 'Shahbagh, Dhaka',
      emergencyPhone: '02-9661051',
      facilities: ['Super Specialized Hospital Wing', 'Advanced Critical Care Unit', 'Specialized Neuro ICU', 'Comprehensive Diagnostics'],
      ambulanceGate: 'Shahbagh Main Avenue Gate',
    },
    {
      name: 'National Institute of Cardiovascular Diseases (NICVD)',
      category: 'National Apex Cardiac Center',
      location: 'Sher-e-Bangla Nagar, Dhaka',
      emergencyPhone: '02-9122560',
      facilities: ['24/7 Emergency Cardiac Intervention', 'Coronary Care Unit (CCU)', 'Emergency Angioplasty', 'Pediatric Cardiology'],
      ambulanceGate: 'Sher-e-Bangla Road Cardiac Emergency Gate',
    },
    {
      name: 'National Heart Foundation Hospital & Research Institute',
      category: 'Specialized Cardiac Hospital',
      location: 'Plot 4, Section 2, Mirpur, Dhaka',
      emergencyPhone: '02-9033442',
      facilities: ['24-Hour Heart Emergency Unit', 'Cardiac Surgery & CCU', 'Rehabilitation Center', 'Preventive Cardiology'],
      ambulanceGate: 'Mirpur-2 Stadium Road Gate',
    },
    {
      name: 'BIRDEM General Hospital',
      category: 'Specialized Endocrine & Multi-Disciplinary',
      location: '122 Kazi Nazrul Islam Avenue, Shahbagh, Dhaka',
      emergencyPhone: '02-8616641',
      facilities: ['Diabetic & Critical Care Emergency', 'ICU & High Dependency Unit', 'Nephrology & Dialysis', 'General Surgery'],
      ambulanceGate: 'Shahbagh VIP Road Emergency Entrance',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-3">
        <span className="badge badge-warning font-bold text-xs uppercase tracking-wider py-2 px-3">
          Hospital Emergency Network
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">Connected Major Hospitals in Dhaka</h1>
        <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
          Our ambulance fleet coordinates with all primary, secondary, and tertiary specialized hospitals across Dhaka for seamless patient admission and critical handover.
        </p>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map((hosp, idx) => (
          <div
            key={idx}
            className="card bg-base-100 border-2 border-base-300 hover:border-error shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl p-6 space-y-4"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <span className="badge badge-error badge-outline font-bold text-xs">
                  {hosp.category}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-base-content">{hosp.name}</h2>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0 text-xl">
                <FaHospital />
              </div>
            </div>

            <div className="text-xs space-y-2 bg-base-200 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2 text-base-content/80">
                <FaMapMarkerAlt className="text-error shrink-0" />
                <span>{hosp.location}</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/80">
                <FaPhoneAlt className="text-primary shrink-0" />
                <span className="font-semibold">Hospital Hotline: {hosp.emergencyPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/80">
                <FaAmbulance className="text-success shrink-0" />
                <span>{hosp.ambulanceGate}</span>
              </div>
            </div>

            {/* Facilities Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {hosp.facilities.map((fac, i) => (
                <span key={i} className="badge badge-ghost badge-sm text-[11px] font-medium">
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ambulance Dispatch Callout */}
      <div className="bg-base-200 p-8 rounded-3xl border border-base-300 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black">Need Urgent Ambulance to Any Dhaka Hospital?</h3>
          <p className="text-xs sm:text-sm text-base-content/70">
            We provide fast dispatch with live hospital emergency coordination and oxygen support.
          </p>
        </div>
        <a href="tel:01303446161" className="btn btn-error text-white font-bold btn-md shadow-lg shrink-0 gap-2">
          <FaPhoneAlt /> Call 01303-446161
        </a>
      </div>
    </div>
  );
};
