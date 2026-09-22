import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Ambulance

ambulances_data = [
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১১-৪৫৬৭",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ রাকিব হাসান",
    "driver_phone": "01711000001",
    "base_location": "Dhanmondi, Dhaka",
    "base_fare": 1500,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-01.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১২-৩৪৫৬",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ সোহেল রানা",
    "driver_phone": "01711000002",
    "base_location": "Mirpur, Dhaka",
    "base_fare": 1200,
    "price_per_km": 40,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-02.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১৩-৭৮৯০",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ কামরুল ইসলাম",
    "driver_phone": "01711000003",
    "base_location": "Uttara, Dhaka",
    "base_fare": 4000,
    "price_per_km": 100,
    "status": "on_trip",
    "image_url": "https://example.com/ambulances/ambulance-03.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১৪-২৩৪৫",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ নাঈম হোসেন",
    "driver_phone": "01711000004",
    "base_location": "Mohammadpur, Dhaka",
    "base_fare": 1500,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-04.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১৫-৬৭৮৯",
    "ambulance_type": "Freezer Ambulance",
    "driver_name": "মোঃ আল-আমিন",
    "driver_phone": "01711000005",
    "base_location": "Jatrabari, Dhaka",
    "base_fare": 2500,
    "price_per_km": 70,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-05.jpg"
  },
  {
    "vehicle_number": "চট্টগ্রাম-মেট্রো-হ-১১-১২৩৪",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ ইমরান কবির",
    "driver_phone": "01811000006",
    "base_location": "Panchlaish, Chattogram",
    "base_fare": 1600,
    "price_per_km": 55,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-06.jpg"
  },
  {
    "vehicle_number": "চট্টগ্রাম-মেট্রো-হ-১২-৫৬৭৮",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ জাহিদুল ইসলাম",
    "driver_phone": "01811000007",
    "base_location": "Agrabad, Chattogram",
    "base_fare": 1200,
    "price_per_km": 40,
    "status": "maintenance",
    "image_url": "https://example.com/ambulances/ambulance-07.jpg"
  },
  {
    "vehicle_number": "রাজশাহী-মেট্রো-হ-১১-৯০১২",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ তানভীর আহমেদ",
    "driver_phone": "01911000008",
    "base_location": "Boalia, Rajshahi",
    "base_fare": 1400,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-08.jpg"
  },
  {
    "vehicle_number": "রাজশাহী-মেট্রো-হ-১২-৩৪৫৬",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ মাসুদ রানা",
    "driver_phone": "01911000009",
    "base_location": "Rajpara, Rajshahi",
    "base_fare": 3500,
    "price_per_km": 90,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-09.jpg"
  },
  {
    "vehicle_number": "খুলনা-মেট্রো-হ-১১-৭৮৯০",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ সুমন মিয়া",
    "driver_phone": "01611000010",
    "base_location": "Sonadanga, Khulna",
    "base_fare": 1400,
    "price_per_km": 45,
    "status": "on_trip",
    "image_url": "https://example.com/ambulances/ambulance-10.jpg"
  },
  {
    "vehicle_number": "সিলেট-মেট্রো-হ-১১-২১২৩",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ ফরহাদ হোসেন",
    "driver_phone": "01721000011",
    "base_location": "Zindabazar, Sylhet",
    "base_fare": 1200,
    "price_per_km": 40,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-11.jpg"
  },
  {
    "vehicle_number": "বরিশাল-মেট্রো-হ-১১-৪৫৬৭",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ শামীম আহমেদ",
    "driver_phone": "01721000012",
    "base_location": "Kawnia, Barishal",
    "base_fare": 1300,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-12.jpg"
  },
  {
    "vehicle_number": "রংপুর-মেট্রো-হ-১১-৮৯০১",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ রবিউল ইসলাম",
    "driver_phone": "01821000013",
    "base_location": "Jahaj Company Mor, Rangpur",
    "base_fare": 1300,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-13.jpg"
  },
  {
    "vehicle_number": "ময়মনসিংহ-মেট্রো-হ-১১-৩৪৫৬",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ হাসান মাহমুদ",
    "driver_phone": "01921000014",
    "base_location": "Sadar, Mymensingh",
    "base_fare": 1100,
    "price_per_km": 40,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-14.jpg"
  },
  {
    "vehicle_number": "কুমিল্লা-মেট্রো-হ-১১-৬৭৮৯",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ আশিকুর রহমান",
    "driver_phone": "01821000015",
    "base_location": "Kandirpar, Cumilla",
    "base_fare": 1300,
    "price_per_km": 45,
    "status": "on_trip",
    "image_url": "https://example.com/ambulances/ambulance-15.jpg"
  },
  {
    "vehicle_number": "গাজীপুর-মেট্রো-হ-১১-৯০১২",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ রিফাত হোসেন",
    "driver_phone": "01731000016",
    "base_location": "Tongi, Gazipur",
    "base_fare": 1400,
    "price_per_km": 50,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-16.jpg"
  },
  {
    "vehicle_number": "নারায়ণগঞ্জ-মেট্রো-হ-১১-১২৩৪",
    "ambulance_type": "ICU Ambulance",
    "driver_name": "মোঃ মেহেদী হাসান",
    "driver_phone": "01931000017",
    "base_location": "Chashara, Narayanganj",
    "base_fare": 3800,
    "price_per_km": 95,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-17.jpg"
  },
  {
    "vehicle_number": "বগুড়া-মেট্রো-হ-১১-৫৬৭৮",
    "ambulance_type": "Non-AC Ambulance",
    "driver_name": "মোঃ নাসির উদ্দিন",
    "driver_phone": "01741000018",
    "base_location": "Satmatha, Bogura",
    "base_fare": 1100,
    "price_per_km": 40,
    "status": "maintenance",
    "image_url": "https://example.com/ambulances/ambulance-18.jpg"
  },
  {
    "vehicle_number": "কুষ্টিয়া-মেট্রো-হ-১১-৭৮৯০",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ সাকিব খান",
    "driver_phone": "01841000019",
    "base_location": "Sadar, Kushtia",
    "base_fare": 1200,
    "price_per_km": 45,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-19.jpg"
  },
  {
    "vehicle_number": "ঢাকা-মেট্রো-হ-১৬-৩৪৫৬",
    "ambulance_type": "AC Ambulance",
    "driver_name": "মোঃ শাকিল আহমেদ",
    "driver_phone": "01751000020",
    "base_location": "Banani, Dhaka",
    "base_fare": 1600,
    "price_per_km": 55,
    "status": "available",
    "image_url": "https://example.com/ambulances/ambulance-20.jpg"
  }
]

db = SessionLocal()
added = 0
skipped = 0

for data in ambulances_data:
    existing = db.query(Ambulance).filter(Ambulance.vehicle_number == data["vehicle_number"]).first()
    if existing:
        skipped += 1
        print(f"Skipped (already exists): {data['vehicle_number']}")
    else:
        ambulance = Ambulance(**data)
        db.add(ambulance)
        added += 1
        print(f"Added: {data['vehicle_number']}")

db.commit()
db.close()

print(f"\nCompleted! Total Added: {added}, Skipped: {skipped}")
