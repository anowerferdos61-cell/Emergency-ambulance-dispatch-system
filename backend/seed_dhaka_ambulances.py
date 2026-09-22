import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Ambulance, EmergencyRequest

dhaka_ambulances = [
  # Dhaka North Zones
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০১",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ রাকিব হাসান",
    "driver_phone": "01711000101",
    "base_location": "Gulshan-2, Dhaka North",
    "base_fare": 3800,
    "price_per_km": 90,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-01.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০২",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ তানভীর আহমেদ",
    "driver_phone": "01711000102",
    "base_location": "Banani, Dhaka North",
    "base_fare": 1600,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-02.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৩",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ কামরুল ইসলাম",
    "driver_phone": "01711000103",
    "base_location": "Uttara Sector-7, Dhaka North",
    "base_fare": 4000,
    "price_per_km": 95,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-03.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৪",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ সোহেল রানা",
    "driver_phone": "01711000104",
    "base_location": "Mirpur-10, Dhaka North",
    "base_fare": 1200,
    "price_per_km": 40,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-04.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৫",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ আরিফুল ইসলাম",
    "driver_phone": "01711000105",
    "base_location": "Bashundhara R/A, Dhaka North",
    "base_fare": 1500,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-05.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৬",
    "ambulance_type": "Freezer Van",
    "driver_name": "মোঃ আল-আমিন",
    "driver_phone": "01711000106",
    "base_location": "Mohakhali (ICDDR,B), Dhaka North",
    "base_fare": 2500,
    "price_per_km": 70,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-06.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৭",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ জাহিদুল ইসলাম",
    "driver_phone": "01711000107",
    "base_location": "Badda & Rampura, Dhaka North",
    "base_fare": 1400,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-07.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৮",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ ফারুক হোসেন",
    "driver_phone": "01711000108",
    "base_location": "Tejgaon & Farmgate, Dhaka North",
    "base_fare": 3600,
    "price_per_km": 85,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-08.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১০৯",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ বিল্লাল হোসেন",
    "driver_phone": "01711000109",
    "base_location": "Cantonment & Kuril, Dhaka North",
    "base_fare": 1200,
    "price_per_km": 40,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-09.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-১১০",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ সাদ্দাম হোসেন",
    "driver_phone": "01711000110",
    "base_location": "Banasree & Khilgaon, Dhaka North",
    "base_fare": 1400,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-10.jpg"
  },

  # Dhaka South Zones
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০১",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ নাঈম হোসেন",
    "driver_phone": "01811000201",
    "base_location": "Dhanmondi-27 (Square Hospital Hub), Dhaka South",
    "base_fare": 3700,
    "price_per_km": 90,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-11.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০২",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ আশিকুর রহমান",
    "driver_phone": "01811000202",
    "base_location": "Mohammadpur (Town Hall), Dhaka South",
    "base_fare": 1500,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-12.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৩",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ ইমরান কবির",
    "driver_phone": "01811000203",
    "base_location": "Shahbagh (BSMMU PG Hospital & BIRDEM Hub), Dhaka South",
    "base_fare": 3900,
    "price_per_km": 95,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-13.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৪",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ রবিউল ইসলাম",
    "driver_phone": "01811000204",
    "base_location": "Dhaka Medical College Hospital (DMCH Hub), Dhaka South",
    "base_fare": 1500,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-14.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৫",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ সুমন মিয়া",
    "driver_phone": "01811000205",
    "base_location": "Old Dhaka (Chakbazar & Lalbagh), Dhaka South",
    "base_fare": 1100,
    "price_per_km": 40,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-15.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৬",
    "ambulance_type": "Freezer Van",
    "driver_name": "মোঃ ফরহাদ হোসেন",
    "driver_phone": "01811000206",
    "base_location": "Jatrabari & Sayedabad, Dhaka South",
    "base_fare": 2400,
    "price_per_km": 65,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-16.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৭",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ শামীম আহমেদ",
    "driver_phone": "01811000207",
    "base_location": "Motijheel & Paltan, Dhaka South",
    "base_fare": 1400,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-17.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৮",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ হাসান মাহমুদ",
    "driver_phone": "01811000208",
    "base_location": "National Heart Foundation (Mirpur/Shyamoli Hub), Dhaka",
    "base_fare": 3800,
    "price_per_km": 90,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-18.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২০৯",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ সাকিব খান",
    "driver_phone": "01811000209",
    "base_location": "Shantinagar & Malibagh, Dhaka South",
    "base_fare": 1400,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-19.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-২১০",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ শাকিল আহমেদ",
    "driver_phone": "01811000210",
    "base_location": "Savar & Gabtoli Gateway, Dhaka",
    "base_fare": 1600,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/dhaka-20.jpg"
  }
]

db = SessionLocal()

# Clear existing emergency requests and ambulances to refresh with pure Dhaka fleet
db.query(EmergencyRequest).delete()
db.query(Ambulance).delete()
db.commit()

for data in dhaka_ambulances:
    ambulance = Ambulance(**data)
    db.add(ambulance)

db.commit()
db.close()

print(f"Successfully seeded {len(dhaka_ambulances)} Dhaka-focused ambulances!")
