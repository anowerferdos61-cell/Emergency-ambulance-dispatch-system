import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaCheckCircle, FaHospital, FaShieldAlt } from 'react-icons/fa';

export const Coverage = () => {
  const northZones = [
    { name: 'Gulshan-1 & Gulshan-2', eta: '8-10 mins', hub: 'Near United Hospital & Pink City' },
    { name: 'Banani & Chairman Bari', eta: '8-10 mins', hub: 'Near Banani 11 & Kemal Ataturk' },
    { name: 'Uttara (Sectors 1 to 14)', eta: '10-12 mins', hub: 'Sector-7 Rabindra Sarani Hub' },
    { name: 'Mirpur (1, 2, 6, 10, 11, 12, 14)', eta: '10-12 mins', hub: 'Mirpur-10 Circle & Stadium' },
    { name: 'Bashundhara R/A & Kuril', eta: '10-15 mins', hub: 'Evercare Hospital Gateway' },
    { name: 'Mohakhali & Wireless Gate', eta: '6-8 mins', hub: 'ICDDR,B & TB Gate Hub' },
    { name: 'Badda, Rampura & Aftabnagar', eta: '10-12 mins', hub: 'Badda Link Road & Rampura Bridge' },
    { name: 'Banasree & Goran', eta: '10-12 mins', hub: 'Banasree Block-C Main Road' },
    { name: 'Tejgaon Industrial Area & Farmgate', eta: '8-10 mins', hub: 'Tejgaon Link Road & Khamarbari' },
    { name: 'Cantonment, Kafrul & Vasantek', eta: '10-12 mins', hub: 'Kochukhet & Cantonment Road' },
    { name: 'Savar, Ashulia & Gabtoli Gateway', eta: '15-20 mins', hub: 'Gabtoli Bus Terminal & Savar Bazar' },
  ];

  const southZones = [
    { name: 'Dhanmondi (Roads 1 to 32)', eta: '6-8 mins', hub: 'Dhanmondi-27 & Square Hospital Hub' },
    { name: 'Mohammadpur, Ring Road & Town Hall', eta: '8-10 mins', hub: 'Mohammadpur Bus Stand & Town Hall' },
    { name: 'Shahbagh & Katabon', eta: '5-8 mins', hub: 'BSMMU (PG Hospital) & BIRDEM Hub' },
    { name: 'DMCH & Bakshibazar Area', eta: '5-8 mins', hub: 'Dhaka Medical Emergency Gate' },
    { name: 'Old Dhaka (Lalbagh & Chakbazar)', eta: '10-15 mins', hub: 'Chakbazar Shahi Mosque Hub' },
    { name: 'Sadarghat & Kotwali', eta: '12-15 mins', hub: 'Victoria Park & River Port' },
    { name: 'Motijheel, Dilkusha & Paltan', eta: '8-10 mins', hub: 'Shapla Chattar & Baitul Mukarram' },
    { name: 'Jatrabari, Sayedabad & Dholairpar', eta: '10-12 mins', hub: 'Jatrabari Flyover & Bus Hub' },
    { name: 'Shantinagar, Kakrail & Malibagh', eta: '8-10 mins', hub: 'Malibagh Railgate & Shantinagar Mor' },
    { name: 'Gendaria, Wari & Narinda', eta: '10-12 mins', hub: 'Dayaganj Mor & Wari Street' },
    { name: 'Demra, Sarulia & Matuail', eta: '15-20 mins', hub: 'Demra Staff Quarter & Matuail Hospital' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-8 sm:p-12 rounded-3xl shadow-xl text-center space-y-3">
        <span className="badge badge-warning font-bold text-xs uppercase tracking-wider py-2 px-3">
          100% Dhaka City Coverage
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">24-Hour Dhaka Coverage Areas</h1>
        <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
          Our rapid response emergency ambulance hubs are strategically positioned across all zones of Dhaka North and Dhaka South City Corporation.
        </p>
      </div>

      {/* Coverage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dhaka North */}
        <div className="card bg-base-100 border-2 border-primary/30 shadow-lg rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-base-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-primary flex items-center gap-2">
                <FaMapMarkerAlt /> Dhaka North City Corporation
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">11 Dedicated Response Hubs</p>
            </div>
            <a href="tel:01303446161" className="btn btn-sm btn-primary text-white font-bold gap-1">
              <FaPhoneAlt /> Call North
            </a>
          </div>

          <div className="space-y-3">
            {northZones.map((zone, i) => (
              <div
                key={i}
                className="p-3.5 bg-base-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm hover:bg-base-300 transition"
              >
                <div>
                  <h4 className="font-extrabold text-base-content">{zone.name}</h4>
                  <p className="text-xs text-base-content/60">{zone.hub}</p>
                </div>
                <span className="badge badge-sm badge-success text-white font-bold shrink-0">
                  <FaClock className="mr-1 text-[10px]" /> {zone.eta}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dhaka South */}
        <div className="card bg-base-100 border-2 border-error/30 shadow-lg rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-base-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-error flex items-center gap-2">
                <FaMapMarkerAlt /> Dhaka South City Corporation
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">11 Dedicated Response Hubs</p>
            </div>
            <a href="tel:01303446161" className="btn btn-sm btn-error text-white font-bold gap-1">
              <FaPhoneAlt /> Call South
            </a>
          </div>

          <div className="space-y-3">
            {southZones.map((zone, i) => (
              <div
                key={i}
                className="p-3.5 bg-base-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm hover:bg-base-300 transition"
              >
                <div>
                  <h4 className="font-extrabold text-base-content">{zone.name}</h4>
                  <p className="text-xs text-base-content/60">{zone.hub}</p>
                </div>
                <span className="badge badge-sm badge-error text-white font-bold shrink-0">
                  <FaClock className="mr-1 text-[10px]" /> {zone.eta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Assurance Banner */}
      <div className="bg-gradient-to-r from-neutral to-base-300 p-8 rounded-3xl border border-base-300 text-center space-y-3">
        <h3 className="text-2xl font-black">Is Your Dhaka Area Not Listed Above?</h3>
        <p className="text-xs sm:text-sm opacity-80 max-w-lg mx-auto">
          We provide 100% emergency medical ambulance coverage to every alley and road in Greater Dhaka, Narayanganj, Tongi, and Gazipur border.
        </p>
        <a href="tel:01303446161" className="btn btn-error text-white font-bold btn-md gap-2">
          <FaPhoneAlt /> Call 24/7 Dispatch Control: 01303-446161
        </a>
      </div>
    </div>
  );
};
