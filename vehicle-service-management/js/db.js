/**
 * Vehicle Service Management System (VSMS) - Unified Database & Storage Layer
 * Simulates a full relational database using browser LocalStorage.
 * Pre-populates realistic data for instant demonstration without setup.
 */

const VSMS_DB_KEY = 'VSMS_DATABASE_V1';

const DEFAULT_DATA = {
  users: [
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'customer@vsms.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98765 43210',
      address: '42 Marine Drive, Mumbai, MH',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: '2025-01-10'
    },
    {
      id: 'USR-002',
      name: 'Priya Sharma',
      email: 'priya@vsms.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 98123 45678',
      address: '15 Koregaon Park, Pune, MH',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      createdAt: '2025-02-15'
    },
    {
      id: 'USR-003',
      name: 'Rajesh Verma',
      email: 'advisor@vsms.com',
      password: 'password123',
      role: 'advisor',
      phone: '+91 97654 32109',
      specialization: 'Service Consultation & Estimation',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
      createdAt: '2024-11-01'
    },
    {
      id: 'USR-004',
      name: 'Vikram Singh',
      email: 'technician@vsms.com',
      password: 'password123',
      role: 'technician',
      phone: '+91 96543 21098',
      specialization: 'Engine Overhaul & Transmission',
      experience: '8 Years',
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80',
      createdAt: '2024-10-15'
    },
    {
      id: 'USR-005',
      name: 'Amit Patel',
      email: 'tech2@vsms.com',
      password: 'password123',
      role: 'technician',
      phone: '+91 95432 10987',
      specialization: 'Automotive Electrical & AC Diagnostics',
      experience: '6 Years',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
      createdAt: '2024-11-20'
    },
    {
      id: 'USR-006',
      name: 'Deepak Joshi',
      email: 'inventory@vsms.com',
      password: 'password123',
      role: 'inventory',
      phone: '+91 94321 09876',
      specialization: 'OEM Parts & Supply Chain',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      createdAt: '2024-09-01'
    },
    {
      id: 'USR-007',
      name: 'Sarah Jenkins',
      email: 'admin@vsms.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 93210 98765',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      createdAt: '2024-08-01'
    }
  ],

  vehicles: [
    {
      id: 'VEH-001',
      customerId: 'USR-001',
      ownerName: 'John Doe',
      vehicleNo: 'MH-02-CB-4521',
      type: 'Sedan',
      brand: 'Honda',
      model: 'City ZX',
      variant: '1.5L i-VTEC V',
      year: 2022,
      fuelType: 'Petrol',
      currentKm: 28450,
      color: 'Radiant Red Metallic',
      lastServiceDate: '2025-11-10',
      nextServiceDue: '2026-05-10',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
      serviceCount: 4
    },
    {
      id: 'VEH-002',
      customerId: 'USR-001',
      ownerName: 'John Doe',
      vehicleNo: 'MH-12-PQ-3312',
      type: 'Bike',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      variant: 'Halcyon Green Dual Channel ABS',
      year: 2023,
      fuelType: 'Petrol',
      currentKm: 12200,
      color: 'Emerald Green',
      lastServiceDate: '2026-01-05',
      nextServiceDue: '2026-07-05',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      status: 'In Service',
      serviceCount: 2
    },
    {
      id: 'VEH-003',
      customerId: 'USR-002',
      ownerName: 'Priya Sharma',
      vehicleNo: 'MH-04-DX-8890',
      type: 'SUV',
      brand: 'Hyundai',
      model: 'Creta SX(O)',
      variant: '1.5L Turbo DCT',
      year: 2023,
      fuelType: 'Diesel',
      currentKm: 34100,
      color: 'Abyss Black',
      lastServiceDate: '2025-12-20',
      nextServiceDue: '2026-06-20',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
      serviceCount: 3
    },
    {
      id: 'VEH-004',
      customerId: 'USR-001',
      ownerName: 'John Doe',
      vehicleNo: 'MH-03-EF-5678',
      type: 'Scooter',
      brand: 'Honda',
      model: 'Activa 6G',
      variant: 'DLX H-Smart',
      year: 2023,
      fuelType: 'Petrol',
      currentKm: 8900,
      color: 'Matte Axis Grey',
      lastServiceDate: '2025-10-15',
      nextServiceDue: '2026-04-15',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
      serviceCount: 2
    }
  ],

  services: [
    // General Service
    {
      id: 'SRV-001',
      name: 'Basic Periodic Service',
      category: 'General Service',
      vehicleTypes: ['Car', 'Sedan', 'Hatchback', 'SUV'],
      shortDesc: 'Essential 25-point comprehensive checkup with engine oil top-up and filter cleanup.',
      fullDesc: 'Recommended every 5,000 km or 3 months. Includes engine oil check, fluid level inspection, battery water top-up, spark plug cleaning, wiper washer refill, tyre pressure check and complete exterior foam wash.',
      price: 1499,
      duration: '2.5 Hours',
      rating: 4.8,
      reviewsCount: 142,
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Engine Oil Level & Quality Inspection',
        'Air Filter Inspection & Blow Cleaning',
        'Coolant & Brake Fluid Top-up',
        'Battery Terminal Cleaning & Voltage Test',
        '25-Point Comprehensive Safety Inspection',
        'Complimentary Exterior Foam Wash & Vacuum'
      ],
      requiredParts: ['PRT-001', 'PRT-002']
    },
    {
      id: 'SRV-002',
      name: 'Standard Comprehensive Service',
      category: 'General Service',
      vehicleTypes: ['Car', 'Sedan', 'Hatchback', 'SUV'],
      shortDesc: 'Full 50-point service including synthetic engine oil change and oil filter replacement.',
      fullDesc: 'Recommended every 10,000 km or 6 months. Covers complete synthetic oil replacement, new OEM oil filter, air filter replacement, 4-wheel brake cleaning, spark plug inspection and complete interior-exterior sanitization.',
      price: 3499,
      duration: '4.0 Hours',
      rating: 4.9,
      reviewsCount: 310,
      badge: 'Best Value',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Complete Engine Oil Replacement (Fully Synthetic)',
        'OEM Oil Filter Replacement',
        'Air Filter & Cabin AC Filter Cleaning/Replacement',
        '4-Wheel Brake Pad & Caliper Inspection and De-dusting',
        'Coolant Drain & Refill Check',
        'Suspension & Steering Linkage Greasing',
        'Complete Underbody & Chassis Check'
      ],
      requiredParts: ['PRT-001', 'PRT-002', 'PRT-003']
    },
    {
      id: 'SRV-003',
      name: 'Premium Major Overhaul Service',
      category: 'General Service',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Commercial Vehicle'],
      shortDesc: 'Master 80-point vehicle overhaul with computer OBD-II scanning, wheel alignment & balancing.',
      fullDesc: 'Recommended every 20,000 km or 12 months. Master deep-cycle maintenance package including fully synthetic oil, all filter replacements, spark plugs, brake bleeding, wheel alignment, dynamic wheel balancing, and engine health scan.',
      price: 6999,
      duration: '6.0 Hours',
      rating: 4.9,
      reviewsCount: 185,
      badge: 'Ultimate Care',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Full Synthetic Motul/Castrol Engine Oil (up to 4.5L)',
        'OEM Oil Filter & Engine Air Filter Replacement',
        'Activated Carbon AC Cabin Filter Replacement',
        'OBD-II Computerized ECM & Sensor Diagnostic Scan',
        '4-Wheel Laser Alignment & High-Speed Wheel Balancing',
        'Brake Fluid Flushing & Bleeding (DOT 4)',
        'Throttle Body Cleaning & Throttle Re-learn'
      ],
      requiredParts: ['PRT-001', 'PRT-002', 'PRT-003', 'PRT-005', 'PRT-007']
    },
    // Engine Services
    {
      id: 'SRV-004',
      name: 'Engine Diagnostic & Tuning',
      category: 'Engine',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'Advanced electronic scan, ignition timing calibration and fuel-injection optimization.',
      fullDesc: 'Diagnose rough idling, power loss, engine check light (MIL) issues, oxygen sensors, MAP/MAF sensors, and ECU parameter optimization for enhanced fuel economy and smooth throttle response.',
      price: 1899,
      duration: '2.0 Hours',
      rating: 4.7,
      reviewsCount: 94,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Live Sensor Stream Scanning via OBD-II Scanner',
        'Throttle Body De-carbonization',
        'Ignition Coil & Spark Plug Resistance Test',
        'Fuel Injector Flow & Pulse Analysis',
        'Trouble Code (DTC) Cleared & Reset'
      ],
      requiredParts: ['PRT-007']
    },
    {
      id: 'SRV-005',
      name: 'Engine Overheating Diagnosis & Cooling Flush',
      category: 'Engine',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback', 'Commercial Vehicle'],
      shortDesc: 'Cooling radiator pressure testing, thermostat inspection and ethylene glycol coolant flush.',
      fullDesc: 'Complete diagnosis of engine overheating symptoms, water pump leakage, radiator fan relay test, thermostat valve operation, and chemical descaling flush of the radiator core.',
      price: 2299,
      duration: '3.0 Hours',
      rating: 4.8,
      reviewsCount: 78,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Radiator & Cooling Cap Pressure Test',
        'Thermostat Valve Opening Temp Verification',
        'Chemical Radiator De-scale & Reverse Flush',
        'Premium Anti-freeze Coolant Refill (50:50 Premix)',
        'Radiator Aux Fan Relay & Circuit Testing'
      ],
      requiredParts: ['PRT-009']
    },
    // Brake Services
    {
      id: 'SRV-006',
      name: 'Complete Front & Rear Brake Service',
      category: 'Brake',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'Ceramic brake pad replacement, rotor disc skimming, caliper pin greasing and fluid bleed.',
      fullDesc: 'Restore 100% stopping power and eliminate brake squeal, judder, and soft pedal feel. Includes replacement with high-friction ceramic brake pads, rotor disc resurfacing, and high-temp caliper pin greasing.',
      price: 2799,
      duration: '2.5 Hours',
      rating: 4.9,
      reviewsCount: 220,
      badge: 'Safety Essential',
      image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Front & Rear Brake Caliper Dismantling & Inspection',
        'Installation of OEM Ceramic Brake Pads',
        'Brake Rotor Disc Lathe Skimming / Resurfacing',
        'Brake Fluid Level Top-up / DOT 4 Bleed',
        'Handbrake Cable Tension Adjustment & Test'
      ],
      requiredParts: ['PRT-004', 'PRT-005']
    },
    {
      id: 'SRV-007',
      name: 'Brake Fluid Flush & Bleed',
      category: 'Brake',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback', 'Bike'],
      shortDesc: 'Complete pressurized vacuum bleeding of old moisture-laden hydraulic brake fluid.',
      fullDesc: 'Removes air bubbles and water contamination from hydraulic lines, preventing brake fade on steep descents and maintaining crisp hydraulic brake response.',
      price: 899,
      duration: '1.0 Hours',
      rating: 4.7,
      reviewsCount: 65,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Pneumatic Brake Line Flushing',
        'Master Cylinder Reservoir Cleansing',
        'DOT 4 Synthetic High Boiling Point Fluid Refill',
        'Brake Pedal Travel & Firmness Calibration'
      ],
      requiredParts: ['PRT-005']
    },
    // AC Services
    {
      id: 'SRV-008',
      name: 'Complete AC Inspection & Refrigerant Gas Refill',
      category: 'AC',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'R134a/R1234yf refrigerant top-up, compressor oil recharge, leak test & condenser wash.',
      fullDesc: 'Guaranteed icy cabin temperatures even in 45°C summer heat. Includes UV dye nitrogen pressure leak check, compressor oil top-up, R134a refrigerant charging, and cooling coil anti-bacterial cleaning.',
      price: 2499,
      duration: '2.0 Hours',
      rating: 4.9,
      reviewsCount: 280,
      badge: 'Summer Special',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'High/Low Pressure Gauge Diagnostic Analysis',
        'Nitrogen Leakage Test across Evaporator & Condenser',
        'R134a OEM Pure Refrigerant Recharging (up to 450g)',
        'PAG Compressor Lubricant Oil Top-up',
        'AC Vent Temperature Verification (Target <= 6°C)',
        'Evaporator Foam Disinfection & Anti-Odor Treatment'
      ],
      requiredParts: ['PRT-006', 'PRT-008']
    },
    {
      id: 'SRV-009',
      name: 'AC Cabin Filter Replacement & Duct Sanitization',
      category: 'AC',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'Removes PM2.5 allergens, mold, and stale odours with activated carbon filter and ozone mist.',
      fullDesc: 'Deep ultrasonic misting of HVAC blower ducts to eliminate bacteria, mildew, and allergens while installing a high-efficiency HEPA carbon cabin filter.',
      price: 1199,
      duration: '1.0 Hours',
      rating: 4.8,
      reviewsCount: 115,
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Removal of Old Contaminated Cabin Filter',
        'Installation of OEM Activated Carbon Pollen Filter',
        'AC Blower Fan De-dusting & De-greasing',
        'Anti-Bacterial Ultrasonic Fogging / Ozone Sanitization'
      ],
      requiredParts: ['PRT-008']
    },
    // Tyres & Wheels
    {
      id: 'SRV-010',
      name: '3D Laser Wheel Alignment & Dynamic Balancing',
      category: 'Tyres',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback', 'Commercial Vehicle'],
      shortDesc: 'Computerized 3D 4-wheel alignment, road force balancing, tyre rotation & nitrogen fill.',
      fullDesc: 'Eliminates steering pull, vibration at highway speeds (80-120 km/h) and uneven tyre tread wear. Extends tyre life by up to 25,000 km.',
      price: 1299,
      duration: '1.5 Hours',
      rating: 4.8,
      reviewsCount: 190,
      image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        '3D Camera Laser Alignment of Camber, Caster & Toe',
        'Computerized Dynamic Wheel Balancing for 4 Wheels',
        'Clip-on / Adhesive Balancing Counterweights (up to 100g)',
        '5-Tyre Diagonal / Cross Rotation Pattern',
        'High-Purity Nitrogen Inflation in all 5 Tyres'
      ],
      requiredParts: []
    },
    // Battery & Electrical
    {
      id: 'SRV-011',
      name: 'Battery Health Test & Terminal Service',
      category: 'Battery & Electrical',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback', 'Bike', 'Scooter'],
      shortDesc: 'CCA conductance testing, alternator charging voltage analysis and terminal anti-corrosion treat.',
      fullDesc: 'Ensure reliable cold starts every time. Digital testing of battery state-of-charge, cranking amps, starter motor current draw, and alternator diode ripple.',
      price: 599,
      duration: '45 Mins',
      rating: 4.7,
      reviewsCount: 140,
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Digital Cranking Amps (CCA) & Internal Resistance Test',
        'Alternator Stator & Rectifier Charging Output Test (13.8V - 14.4V)',
        'Parasitic Dark Current Draw Check',
        'Lead Terminal Sulfation Cleaning & Petroleum Jelly Coat'
      ],
      requiredParts: ['PRT-010']
    },
    {
      id: 'SRV-012',
      name: 'Complete Automotive Electrical Diagnosis',
      category: 'Battery & Electrical',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'Headlight relay, fuse box, wiring harness, power windows, and central locking troubleshooting.',
      fullDesc: 'Pinpoint short circuits, ground faults, power window motor failures, headlight dimming issues, and instrument cluster warning lamps with high precision.',
      price: 1599,
      duration: '2.5 Hours',
      rating: 4.8,
      reviewsCount: 88,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Main & Engine Bay Fuse Relay Box Inspection',
        'Power Window Regulator & Motor Line Check',
        'Central Locking Actuator & Keyless Entry Sync',
        'Headlamp Beam Leveling & Bulb Replacement Check'
      ],
      requiredParts: ['PRT-012']
    },
    // Cleaning & Detailing
    {
      id: 'SRV-013',
      name: 'Signature Hydrophobic Foam Wash & Vacuum',
      category: 'Cleaning & Detailing',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'pH-neutral snow foam bath, underbody high-pressure wash, alloy de-greasing and interior deep vacuum.',
      fullDesc: 'Give your ride a showroom shine. High-pressure underchassis wash removes salt and road grime, dual-bucket scratchless wash with carnauba gloss booster and tire dressing.',
      price: 799,
      duration: '1.5 Hours',
      rating: 4.9,
      reviewsCount: 420,
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'High Pressure Chassis Underbody Spray',
        'Snow Foam Pre-wash with pH-Neutral Shampoo',
        '2-Bucket Microfiber Scratchless Hand Wash',
        'Deep Interior Cabin Vacuum & Boot Cleaning',
        'Dashboard & Trim Conditioning with UV Protectant',
        'Tyre Dressing & Glass Streak-Free Finish'
      ],
      requiredParts: []
    },
    {
      id: 'SRV-014',
      name: 'Interior Deep Shampooing & Leather Spa',
      category: 'Cleaning & Detailing',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'Hot water steam extraction for seats, roof lining, carpet deep scrub and antibacterial misting.',
      fullDesc: 'Removes deep ground-in coffee spills, food stains, pet hair, and tobacco odor. Restores original fabric color and conditions leather to supple perfection.',
      price: 2199,
      duration: '3.5 Hours',
      rating: 4.9,
      reviewsCount: 160,
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'High-Temperature Steam Extraction of Fabric / Velvet Seats',
        'Deep Carpet & Floor Mat Extraction Wash',
        'Roof Liner Gentle Dry Foam Cleansing (No Sagging)',
        'Leather Upholstery pH Conditioning Cream Application',
        'Air Duct Sanitization Mist'
      ],
      requiredParts: []
    },
    // Body & Repair
    {
      id: 'SRV-015',
      name: 'Paintless Dent Removal & Scratch Rubbing',
      category: 'Body & Repair',
      vehicleTypes: ['Car', 'Sedan', 'SUV', 'Hatchback'],
      shortDesc: 'Specialized precision PDR rod technique and 3-stage rotary compounding for glossy finish.',
      fullDesc: 'Repair door dings, bumper dents without repainting the entire panel. Multi-stage Meguiar’s compounding removes swirl marks and clear-coat scratches.',
      price: 2999,
      duration: '4.0 Hours',
      rating: 4.8,
      reviewsCount: 110,
      image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'PDR Glue Pulling & Metal Rod Massage',
        'Rotary Heavy Cut Rubbing Compound Application',
        'Dual Action Finishing Polish for Mirror Glaze',
        'Synthetic Sealant Wax Coating (3-Month Gloss Protection)'
      ],
      requiredParts: []
    },
    // Bike Services
    {
      id: 'SRV-016',
      name: 'Motorcycle General Periodic Service',
      category: 'Bike Services',
      vehicleTypes: ['Bike', 'Scooter'],
      shortDesc: 'Complete 30-point bike tune-up, semi-synthetic engine oil change, chain lube and brake setting.',
      fullDesc: 'Essential checkup for all 100cc to 650cc 2-wheelers. Includes engine oil replacement, spark plug cleaning, carburetor/throttle body cleaning, chain slack adjustment, and control cable lubrication.',
      price: 799,
      duration: '2.0 Hours',
      rating: 4.9,
      reviewsCount: 380,
      badge: 'Biker Favorite',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Engine Oil Drain & Fresh Refill (10W-40 / 15W-50 Semi-Synthetic)',
        'Spark Plug Gap Calibration & De-carbonization',
        'Drive Chain Kerosene Cleaning, Tension Setting & Motul Lube',
        'Front & Rear Brake Drum/Disc Pad Sanding & Setting',
        'Clutch & Throttle Free Play Cable Lubrication',
        'Complete Pressure Foam Wash & Polish'
      ],
      requiredParts: ['PRT-001', 'PRT-013']
    },
    {
      id: 'SRV-017',
      name: 'Superbike Chain & Sprocket Overhaul',
      category: 'Bike Services',
      vehicleTypes: ['Bike'],
      shortDesc: 'Ultrasonic chain cleaning, O-ring seal inspection, sprocket wear check and laser alignment.',
      fullDesc: 'Maximize power transfer to the rear wheel and avoid sudden chain snaps on high-performance motorbikes.',
      price: 1299,
      duration: '1.5 Hours',
      rating: 4.9,
      reviewsCount: 145,
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      includedWork: [
        'Front Countershaft Sprocket Cover Removal & De-mucking',
        'Chain Link Tensile & O-Ring Wear Laser Check',
        'High-Temp Synthetic Racing Chain Lube Infusion',
        'Rear Axle Torque Calibration with Clicker Wrench'
      ],
      requiredParts: ['PRT-013']
    }
  ],

  inventory: [
    {
      partId: 'PRT-001',
      name: 'Engine Oil (5W-30 Full Synthetic 4L)',
      category: 'Fluids & Lubricants',
      compatibleVehicles: 'All Petrol / Diesel Cars & Sedans',
      quantity: 42,
      minStock: 15,
      unitPrice: 1650,
      supplier: 'Castrol India Ltd',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-20'
    },
    {
      partId: 'PRT-002',
      name: 'OEM Oil Filter Cartridge',
      category: 'Filters',
      compatibleVehicles: 'Honda, Hyundai, Maruti, Tata',
      quantity: 28,
      minStock: 10,
      unitPrice: 380,
      supplier: 'Mann+Hummel Filters',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-18'
    },
    {
      partId: 'PRT-003',
      name: 'Engine High-Flow Air Filter',
      category: 'Filters',
      compatibleVehicles: 'Sedan, SUV, Hatchback',
      quantity: 19,
      minStock: 8,
      unitPrice: 520,
      supplier: 'Bosch Automotive India',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-15'
    },
    {
      partId: 'PRT-004',
      name: 'Ceramic Front Brake Pads (Set of 4)',
      category: 'Brakes',
      compatibleVehicles: 'Honda City, Creta, Swift, Baleno',
      quantity: 6,
      minStock: 10,
      unitPrice: 1850,
      supplier: 'Brembo / TVS Girling',
      stockStatus: 'Low Stock',
      lastUpdated: '2026-03-22'
    },
    {
      partId: 'PRT-005',
      name: 'Hydraulic Brake Fluid DOT 4 (500ml)',
      category: 'Fluids & Lubricants',
      compatibleVehicles: 'All Cars, SUVs & Motorcycles',
      quantity: 34,
      minStock: 12,
      unitPrice: 320,
      supplier: 'Motul India',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-10'
    },
    {
      partId: 'PRT-006',
      name: 'R134a AC Refrigerant Canister (450g)',
      category: 'AC & Climate',
      compatibleVehicles: 'All HVAC Climate Control Cars',
      quantity: 25,
      minStock: 8,
      unitPrice: 950,
      supplier: 'Honeywell Fluorines',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-24'
    },
    {
      partId: 'PRT-007',
      name: 'Iridium Spark Plug Set (Pack of 4)',
      category: 'Ignition & Electrical',
      compatibleVehicles: 'i-VTEC, VTVT, EcoBoost Petrol Cars',
      quantity: 4,
      minStock: 8,
      unitPrice: 1400,
      supplier: 'NGK Spark Plugs Co',
      stockStatus: 'Low Stock',
      lastUpdated: '2026-03-25'
    },
    {
      partId: 'PRT-008',
      name: 'Activated Carbon AC Cabin Filter',
      category: 'Filters',
      compatibleVehicles: 'Honda City, Creta, Nexon, Seltos',
      quantity: 18,
      minStock: 10,
      unitPrice: 650,
      supplier: 'Mahle Aftermarket',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-12'
    },
    {
      partId: 'PRT-009',
      name: 'Ethylene Glycol Radiator Coolant (1L)',
      category: 'Fluids & Lubricants',
      compatibleVehicles: 'All Liquid-Cooled Engines',
      quantity: 40,
      minStock: 15,
      unitPrice: 390,
      supplier: 'Gulf Oil Lubricants',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-14'
    },
    {
      partId: 'PRT-010',
      name: '12V 45Ah Maintenance-Free Car Battery',
      category: 'Ignition & Electrical',
      compatibleVehicles: 'Sedan, Hatchback, Compact SUV',
      quantity: 2,
      minStock: 5,
      unitPrice: 4200,
      supplier: 'Exide Industries Ltd',
      stockStatus: 'Low Stock',
      lastUpdated: '2026-03-26'
    },
    {
      partId: 'PRT-011',
      name: 'Frameless Aerodynamic Wiper Blades (Pair)',
      category: 'Body & Electrical',
      compatibleVehicles: 'Universal 24"/16" Hook Fitment',
      quantity: 22,
      minStock: 10,
      unitPrice: 850,
      supplier: 'Bosch Automotive India',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-19'
    },
    {
      partId: 'PRT-012',
      name: 'LED Headlamp Bulbs H4 6000K (Pair)',
      category: 'Ignition & Electrical',
      compatibleVehicles: 'All H4 socket vehicles',
      quantity: 0,
      minStock: 6,
      unitPrice: 1950,
      supplier: 'Osram Lighting',
      stockStatus: 'Out of Stock',
      lastUpdated: '2026-03-26'
    },
    {
      partId: 'PRT-013',
      name: 'Synthetic Motorcycle Chain Lube (400ml)',
      category: 'Fluids & Lubricants',
      compatibleVehicles: 'All Chain-Driven Motorcycles',
      quantity: 35,
      minStock: 12,
      unitPrice: 480,
      supplier: 'Motul India',
      stockStatus: 'In Stock',
      lastUpdated: '2026-03-21'
    }
  ],

  bookings: [
    {
      bookingId: 'BKG-1001',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      customerEmail: 'customer@vsms.com',
      vehicleId: 'VEH-001',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      vehicleType: 'Sedan',
      serviceIds: ['SRV-002', 'SRV-008'],
      serviceNames: ['Standard Comprehensive Service', 'Complete AC Inspection & Refrigerant Gas Refill'],
      additionalProblems: 'Slight squeak from rear suspension when driving over speed bumps.',
      preferredDate: '2026-03-28',
      timeSlot: '10:00 AM',
      serviceCenter: 'Central Workshop - Andheri West, Mumbai',
      pickupDrop: true,
      pickupAddress: '42 Marine Drive, Mumbai',
      specialInstructions: 'Please check tyre tread life before monsoon.',
      estimatedCost: 5998,
      status: 'Repair/Service In Progress',
      jobCardId: 'JOB-2001',
      invoiceId: null,
      createdAt: '2026-03-26T09:30:00'
    },
    {
      bookingId: 'BKG-1002',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      customerEmail: 'customer@vsms.com',
      vehicleId: 'VEH-002',
      vehicleNo: 'MH-12-PQ-3312',
      vehicleModel: 'Royal Enfield Classic 350',
      vehicleType: 'Bike',
      serviceIds: ['SRV-016', 'SRV-017'],
      serviceNames: ['Motorcycle General Periodic Service', 'Superbike Chain & Sprocket Overhaul'],
      additionalProblems: 'Front brake lever has slight sponginess.',
      preferredDate: '2026-03-27',
      timeSlot: '02:00 PM',
      serviceCenter: 'Central Workshop - Andheri West, Mumbai',
      pickupDrop: false,
      pickupAddress: '',
      specialInstructions: 'Ensure engine idle RPM is tuned accurately.',
      estimatedCost: 2098,
      status: 'Ready for Delivery',
      jobCardId: 'JOB-2002',
      invoiceId: 'INV-3001',
      createdAt: '2026-03-25T11:15:00'
    },
    {
      bookingId: 'BKG-1003',
      customerId: 'USR-002',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98123 45678',
      customerEmail: 'priya@vsms.com',
      vehicleId: 'VEH-003',
      vehicleNo: 'MH-04-DX-8890',
      vehicleModel: 'Hyundai Creta SX(O)',
      vehicleType: 'SUV',
      serviceIds: ['SRV-003', 'SRV-013'],
      serviceNames: ['Premium Major Overhaul Service', 'Signature Hydrophobic Foam Wash & Vacuum'],
      additionalProblems: 'Air conditioning takes 10 mins to start chilling properly.',
      preferredDate: '2026-03-29',
      timeSlot: '09:00 AM',
      serviceCenter: 'Koregaon Park Mega Hub, Pune',
      pickupDrop: true,
      pickupAddress: '15 Koregaon Park, Pune',
      specialInstructions: 'Sanitize cabin thoroughly after detailing.',
      estimatedCost: 7798,
      status: 'Booked',
      jobCardId: null,
      invoiceId: null,
      createdAt: '2026-03-27T08:00:00'
    },
    {
      bookingId: 'BKG-1004',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      customerEmail: 'customer@vsms.com',
      vehicleId: 'VEH-001',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      vehicleType: 'Sedan',
      serviceIds: ['SRV-006', 'SRV-010'],
      serviceNames: ['Complete Front & Rear Brake Service', '3D Laser Wheel Alignment & Dynamic Balancing'],
      additionalProblems: 'Steering wheel wobbling slightly at 90 km/h.',
      preferredDate: '2026-02-10',
      timeSlot: '11:00 AM',
      serviceCenter: 'Central Workshop - Andheri West, Mumbai',
      pickupDrop: false,
      pickupAddress: '',
      specialInstructions: 'Done smoothly.',
      estimatedCost: 4098,
      status: 'Completed',
      jobCardId: 'JOB-1990',
      invoiceId: 'INV-2990',
      createdAt: '2026-02-08T10:00:00'
    }
  ],

  jobCards: [
    {
      jobCardId: 'JOB-2001',
      bookingId: 'BKG-1001',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      vehicleId: 'VEH-001',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      vehicleType: 'Sedan',
      assignedTechId: 'USR-004',
      assignedTechName: 'Vikram Singh',
      assignedAdvisorId: 'USR-003',
      assignedAdvisorName: 'Rajesh Verma',
      reportedProblems: 'Slight squeak from rear suspension. Standard 10,000 km periodic service and AC tune up.',
      inspectionNotes: 'Initial inspection complete: Rear suspension bushing has minor dry rot but functional. AC gas level at 210g (low, standard is 420g). Front brake pads 60% life remaining.',
      services: [
        { id: 'SRV-002', name: 'Standard Comprehensive Service', cost: 3499 },
        { id: 'SRV-008', name: 'Complete AC Inspection & Refrigerant Gas Refill', cost: 2499 }
      ],
      partsUsed: [
        { partId: 'PRT-001', name: 'Engine Oil (5W-30 Full Synthetic 4L)', quantity: 1, unitPrice: 1650, total: 1650 },
        { partId: 'PRT-002', name: 'OEM Oil Filter Cartridge', quantity: 1, unitPrice: 380, total: 380 },
        { partId: 'PRT-006', name: 'R134a AC Refrigerant Canister (450g)', quantity: 1, unitPrice: 950, total: 950 }
      ],
      technicianNotes: 'Drained black engine oil. Replaced OEM oil filter with fresh gasket torque to 22 Nm. Flushed AC lines and vacuumed system for 20 mins before charging 420g R134a refrigerant. Cabin vent temperature recorded at 5.2°C.',
      status: 'Repair/Service In Progress',
      estimatedCost: 5998,
      laborCharge: 1200,
      actualCost: 5998 + 2980 + 1200,
      createdAt: '2026-03-26T10:00:00',
      completedAt: null
    },
    {
      jobCardId: 'JOB-2002',
      bookingId: 'BKG-1002',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      vehicleId: 'VEH-002',
      vehicleNo: 'MH-12-PQ-3312',
      vehicleModel: 'Royal Enfield Classic 350',
      vehicleType: 'Bike',
      assignedTechId: 'USR-004',
      assignedTechName: 'Vikram Singh',
      assignedAdvisorId: 'USR-003',
      assignedAdvisorName: 'Rajesh Verma',
      reportedProblems: 'Periodic general service, chain overhaul, front brake lever sponginess.',
      inspectionNotes: 'Spark plug gap was 0.95mm (adjusted to 0.75mm). Chain slack was 45mm (tightened to 28mm). Front brake caliper pin cleaned.',
      services: [
        { id: 'SRV-016', name: 'Motorcycle General Periodic Service', cost: 799 },
        { id: 'SRV-017', name: 'Superbike Chain & Sprocket Overhaul', cost: 1299 }
      ],
      partsUsed: [
        { partId: 'PRT-001', name: 'Engine Oil (5W-30 Full Synthetic 4L)', quantity: 1, unitPrice: 1650, total: 1650 },
        { partId: 'PRT-013', name: 'Synthetic Motorcycle Chain Lube (400ml)', quantity: 1, unitPrice: 480, total: 480 },
        { partId: 'PRT-005', name: 'Hydraulic Brake Fluid DOT 4 (500ml)', quantity: 1, unitPrice: 320, total: 320 }
      ],
      technicianNotes: 'All 30 points checked. Chain tension and alignment verified with laser guide. Road tested for 3 km; brake feedback crisp and throttle smooth.',
      status: 'Ready for Delivery',
      estimatedCost: 2098,
      laborCharge: 600,
      actualCost: 2098 + 2450 + 600,
      createdAt: '2026-03-25T11:45:00',
      completedAt: '2026-03-26T15:30:00'
    },
    {
      jobCardId: 'JOB-1990',
      bookingId: 'BKG-1004',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      vehicleId: 'VEH-001',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      vehicleType: 'Sedan',
      assignedTechId: 'USR-005',
      assignedTechName: 'Amit Patel',
      assignedAdvisorId: 'USR-003',
      assignedAdvisorName: 'Rajesh Verma',
      reportedProblems: 'Brake noise, highway steering wobble at 90 km/h.',
      inspectionNotes: 'Front disc had 0.08mm runout. Front pads worn down to 2mm.',
      services: [
        { id: 'SRV-006', name: 'Complete Front & Rear Brake Service', cost: 2799 },
        { id: 'SRV-010', name: '3D Laser Wheel Alignment & Dynamic Balancing', cost: 1299 }
      ],
      partsUsed: [
        { partId: 'PRT-004', name: 'Ceramic Front Brake Pads (Set of 4)', quantity: 1, unitPrice: 1850, total: 1850 },
        { partId: 'PRT-005', name: 'Hydraulic Brake Fluid DOT 4 (500ml)', quantity: 1, unitPrice: 320, total: 320 }
      ],
      technicianNotes: 'Replaced front ceramic pads. Disc resurfaced on lathe. Wheel balancing weights added (15g left, 25g right). Road test smooth.',
      status: 'Completed',
      estimatedCost: 4098,
      laborCharge: 800,
      actualCost: 4098 + 2170 + 800,
      createdAt: '2026-02-10T11:30:00',
      completedAt: '2026-02-10T17:00:00'
    }
  ],

  invoices: [
    {
      invoiceId: 'INV-3001',
      bookingId: 'BKG-1002',
      jobCardId: 'JOB-2002',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      customerEmail: 'customer@vsms.com',
      customerAddress: '42 Marine Drive, Mumbai, MH',
      vehicleNo: 'MH-12-PQ-3312',
      vehicleModel: 'Royal Enfield Classic 350',
      vehicleType: 'Bike',
      services: [
        { name: 'Motorcycle General Periodic Service', amount: 799 },
        { name: 'Superbike Chain & Sprocket Overhaul', amount: 1299 }
      ],
      parts: [
        { name: 'Engine Oil (5W-30 Full Synthetic 4L)', qty: 1, unitPrice: 1650, total: 1650 },
        { name: 'Synthetic Motorcycle Chain Lube (400ml)', qty: 1, unitPrice: 480, total: 480 },
        { name: 'Hydraulic Brake Fluid DOT 4 (500ml)', qty: 1, unitPrice: 320, total: 320 }
      ],
      laborCharges: 600,
      servicesTotal: 2098,
      partsTotal: 2450,
      subtotal: 5148,
      discountPercent: 5,
      discountAmount: 257.40,
      taxPercent: 18,
      taxAmount: 880.30,
      grandTotal: 5770.90,
      paymentStatus: 'Pending',
      paymentMethod: null,
      paymentDate: null,
      transactionId: null,
      createdAt: '2026-03-26T16:00:00',
      dueDate: '2026-03-31'
    },
    {
      invoiceId: 'INV-2990',
      bookingId: 'BKG-1004',
      jobCardId: 'JOB-1990',
      customerId: 'USR-001',
      customerName: 'John Doe',
      customerPhone: '+91 98765 43210',
      customerEmail: 'customer@vsms.com',
      customerAddress: '42 Marine Drive, Mumbai, MH',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      vehicleType: 'Sedan',
      services: [
        { name: 'Complete Front & Rear Brake Service', amount: 2799 },
        { name: '3D Laser Wheel Alignment & Dynamic Balancing', amount: 1299 }
      ],
      parts: [
        { name: 'Ceramic Front Brake Pads (Set of 4)', qty: 1, unitPrice: 1850, total: 1850 },
        { name: 'Hydraulic Brake Fluid DOT 4 (500ml)', qty: 1, unitPrice: 320, total: 320 }
      ],
      laborCharges: 800,
      servicesTotal: 4098,
      partsTotal: 2170,
      subtotal: 7068,
      discountPercent: 10,
      discountAmount: 706.80,
      taxPercent: 18,
      taxAmount: 1144.00,
      grandTotal: 7505.20,
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      paymentDate: '2026-02-10T18:15:00',
      transactionId: 'TXN-UPI-98328109',
      createdAt: '2026-02-10T17:30:00',
      dueDate: '2026-02-15'
    }
  ],

  payments: [
    {
      transactionId: 'TXN-UPI-98328109',
      invoiceId: 'INV-2990',
      customerId: 'USR-001',
      customerName: 'John Doe',
      amount: 7505.20,
      method: 'UPI',
      status: 'Success',
      date: '2026-02-10T18:15:00',
      paymentGatewayRef: 'PAY_928371982731'
    }
  ],

  reminders: [
    {
      id: 'REM-001',
      customerId: 'USR-001',
      vehicleId: 'VEH-001',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      type: 'Periodic Service Due',
      title: '6-Month Periodic Service Due',
      message: 'Your Honda City (MH-02-CB-4521) is due for periodic maintenance in 45 days or 1,550 km.',
      dueDate: '2026-05-10',
      severity: 'warning',
      isDismissed: false
    },
    {
      id: 'REM-002',
      customerId: 'USR-001',
      vehicleId: 'VEH-001',
      vehicleNo: 'MH-02-CB-4521',
      vehicleModel: 'Honda City ZX',
      type: 'AC Gas & Filter Check',
      title: 'Monsoon AC Sanitization Check',
      message: 'Ensure high visibility and odor-free cabin before heavy rains.',
      dueDate: '2026-04-15',
      severity: 'info',
      isDismissed: false
    },
    {
      id: 'REM-003',
      customerId: 'USR-002',
      vehicleId: 'VEH-003',
      vehicleNo: 'MH-04-DX-8890',
      vehicleModel: 'Hyundai Creta SX(O)',
      type: 'Periodic Service Due',
      title: 'Major Overhaul Service Due',
      message: 'Your Hyundai Creta is approaching 35,000 km. Schedule comprehensive overhaul.',
      dueDate: '2026-06-20',
      severity: 'warning',
      isDismissed: false
    }
  ],

  notifications: [
    {
      id: 'NOTIF-001',
      userId: 'USR-001',
      title: 'Service in Progress',
      message: 'Technician Vikram Singh has started working on your Honda City (Job Card #JOB-2001).',
      time: '10 Mins ago',
      read: false,
      type: 'service'
    },
    {
      id: 'NOTIF-002',
      userId: 'USR-001',
      title: 'Invoice Generated',
      message: 'Invoice #INV-3001 for Royal Enfield Classic 350 is ready. Total: ₹5,770.90.',
      time: '1 Hour ago',
      read: false,
      type: 'invoice'
    },
    {
      id: 'NOTIF-003',
      userId: 'USR-006',
      title: 'Low Stock Alert',
      message: 'Ceramic Front Brake Pads (PRT-004) stock has dropped to 6 units (Min: 10).',
      time: '2 Hours ago',
      read: false,
      type: 'inventory'
    }
  ]
};

// Database helper functions
class VSMSDatabase {
  constructor() {
    this.init();
  }

  init() {
    try {
      const existing = localStorage.getItem(VSMS_DB_KEY);
      if (!existing) {
        this.saveData(DEFAULT_DATA);
      }
    } catch (e) {
      console.warn('LocalStorage error or quota exceeded, initializing fallback memory db', e);
    }
  }

  getData() {
    try {
      const data = localStorage.getItem(VSMS_DB_KEY);
      return data ? JSON.parse(data) : DEFAULT_DATA;
    } catch (e) {
      return DEFAULT_DATA;
    }
  }

  saveData(data) {
    try {
      localStorage.setItem(VSMS_DB_KEY, JSON.stringify(data));
      // Dispatch storage event so open tabs react
      if (typeof window !== 'undefined' && typeof Event !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new Event('vsms-db-updated'));
      }
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  }

  resetToDefault() {
    this.saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }

  // --- USERS & AUTH ---
  getUsers() {
    return this.getData().users || [];
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user) {
    const data = this.getData();
    const index = data.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      data.users[index] = user;
    } else {
      user.id = user.id || 'USR-' + String(Date.now()).slice(-4);
      user.createdAt = user.createdAt || new Date().toISOString().split('T')[0];
      data.users.push(user);
    }
    this.saveData(data);
    return user;
  }

  getCurrentUser() {
    try {
      const raw = localStorage.getItem('VSMS_CURRENT_USER');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('VSMS_CURRENT_USER', JSON.stringify(user));
    } else {
      localStorage.removeItem('VSMS_CURRENT_USER');
    }
  }

  login(email, password) {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password' };
  }

  logout() {
    this.setCurrentUser(null);
  }

  // --- VEHICLES ---
  getVehicles(customerId = null) {
    const vehicles = this.getData().vehicles || [];
    if (customerId) {
      return vehicles.filter(v => v.customerId === customerId);
    }
    return vehicles;
  }

  getVehicleById(id) {
    return this.getVehicles().find(v => v.id === id);
  }

  getVehicleByNumber(no) {
    return this.getVehicles().find(v => v.vehicleNo.toLowerCase() === no.toLowerCase().trim());
  }

  saveVehicle(vehicle) {
    const data = this.getData();
    const index = data.vehicles.findIndex(v => v.id === vehicle.id);
    if (index >= 0) {
      data.vehicles[index] = vehicle;
    } else {
      vehicle.id = vehicle.id || 'VEH-' + String(Date.now()).slice(-4);
      vehicle.serviceCount = vehicle.serviceCount || 0;
      vehicle.status = vehicle.status || 'Active';
      data.vehicles.push(vehicle);
    }
    this.saveData(data);
    return vehicle;
  }

  deleteVehicle(id) {
    const data = this.getData();
    data.vehicles = data.vehicles.filter(v => v.id !== id);
    this.saveData(data);
  }

  // --- SERVICES ---
  getServices(filter = {}) {
    let list = this.getData().services || [];
    if (filter.category && filter.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.vehicleType && filter.vehicleType !== 'All') {
      list = list.filter(s => s.vehicleTypes.includes(filter.vehicleType) || s.vehicleTypes.includes('Car'));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    if (filter.maxPrice) {
      list = list.filter(s => s.price <= Number(filter.maxPrice));
    }
    if (filter.minRating) {
      list = list.filter(s => s.rating >= Number(filter.minRating));
    }
    if (filter.sortBy) {
      if (filter.sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
      else if (filter.sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
      else if (filter.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (filter.sortBy === 'popularity') list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    return list;
  }

  getServiceById(id) {
    return (this.getData().services || []).find(s => s.id === id);
  }

  // --- BOOKINGS & APPOINTMENTS ---
  getBookings(filter = {}) {
    let list = this.getData().bookings || [];
    if (filter.customerId) {
      list = list.filter(b => b.customerId === filter.customerId);
    }
    if (filter.status && filter.status !== 'All') {
      list = list.filter(b => b.status.toLowerCase() === filter.status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getBookingById(id) {
    return (this.getData().bookings || []).find(b => b.bookingId === id);
  }

  saveBooking(booking) {
    const data = this.getData();
    const index = data.bookings.findIndex(b => b.bookingId === booking.bookingId);
    if (index >= 0) {
      data.bookings[index] = booking;
    } else {
      booking.bookingId = booking.bookingId || 'BKG-' + String(Date.now()).slice(-4);
      booking.createdAt = booking.createdAt || new Date().toISOString();
      booking.status = booking.status || 'Booked';
      data.bookings.unshift(booking);

      // Add Notification
      this.addNotification({
        userId: booking.customerId,
        title: 'Booking Confirmed',
        message: `Your booking #${booking.bookingId} for ${booking.vehicleModel} on ${booking.preferredDate} at ${booking.timeSlot} has been confirmed.`,
        type: 'booking'
      });
    }
    this.saveData(data);
    return booking;
  }

  updateBookingStatus(bookingId, status) {
    const data = this.getData();
    const booking = data.bookings.find(b => b.bookingId === bookingId);
    if (booking) {
      booking.status = status;
      this.saveData(data);

      this.addNotification({
        userId: booking.customerId,
        title: `Service Status: ${status}`,
        message: `Your vehicle (${booking.vehicleNo}) status is now: ${status}.`,
        type: 'service'
      });
      return booking;
    }
    return null;
  }

  // --- JOB CARDS ---
  getJobCards(filter = {}) {
    let list = this.getData().jobCards || [];
    if (filter.techId) {
      list = list.filter(j => j.assignedTechId === filter.techId);
    }
    if (filter.status && filter.status !== 'All') {
      list = list.filter(j => j.status.toLowerCase() === filter.status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getJobCardById(id) {
    return (this.getData().jobCards || []).find(j => j.jobCardId === id);
  }

  saveJobCard(jobCard) {
    const data = this.getData();
    const index = data.jobCards.findIndex(j => j.jobCardId === jobCard.jobCardId);
    if (index >= 0) {
      data.jobCards[index] = jobCard;
    } else {
      jobCard.jobCardId = jobCard.jobCardId || 'JOB-' + String(Date.now()).slice(-4);
      jobCard.createdAt = jobCard.createdAt || new Date().toISOString();
      jobCard.partsUsed = jobCard.partsUsed || [];
      jobCard.status = jobCard.status || 'Job Card Created';
      data.jobCards.unshift(jobCard);

      // Link to booking
      if (jobCard.bookingId) {
        const booking = data.bookings.find(b => b.bookingId === jobCard.bookingId);
        if (booking) {
          booking.jobCardId = jobCard.jobCardId;
          booking.status = 'Job Card Created';
        }
      }
    }
    this.saveData(data);
    return jobCard;
  }

  addPartToJobCard(jobCardId, partId, quantity = 1) {
    const data = this.getData();
    const job = data.jobCards.find(j => j.jobCardId === jobCardId);
    const part = data.inventory.find(p => p.partId === partId);

    if (!job || !part) return { success: false, message: 'Job Card or Part not found' };

    if (part.quantity < quantity) {
      return { success: false, message: `Insufficient stock! Only ${part.quantity} units available.` };
    }

    // Deduct from inventory
    part.quantity -= quantity;
    if (part.quantity === 0) part.stockStatus = 'Out of Stock';
    else if (part.quantity <= part.minStock) part.stockStatus = 'Low Stock';
    else part.stockStatus = 'In Stock';
    part.lastUpdated = new Date().toISOString().split('T')[0];

    // Add to job card
    const existingPart = job.partsUsed.find(p => p.partId === partId);
    if (existingPart) {
      existingPart.quantity += quantity;
      existingPart.total = existingPart.quantity * existingPart.unitPrice;
    } else {
      job.partsUsed.push({
        partId: part.partId,
        name: part.name,
        quantity: quantity,
        unitPrice: part.unitPrice,
        total: part.unitPrice * quantity
      });
    }

    // Recalculate actual cost
    const partsSum = job.partsUsed.reduce((sum, p) => sum + p.total, 0);
    const servicesSum = (job.services || []).reduce((sum, s) => sum + (s.cost || s.price || 0), 0);
    job.actualCost = servicesSum + partsSum + (job.laborCharge || 0);

    this.saveData(data);
    return { success: true, job, part };
  }

  // --- INVENTORY ---
  getInventory(filter = {}) {
    let list = this.getData().inventory || [];
    if (filter.category && filter.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.stockStatus && filter.stockStatus !== 'All') {
      list = list.filter(p => p.stockStatus.toLowerCase() === filter.stockStatus.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.partId.toLowerCase().includes(q) || p.compatibleVehicles.toLowerCase().includes(q));
    }
    return list;
  }

  getPartById(id) {
    return (this.getData().inventory || []).find(p => p.partId === id);
  }

  getInventoryPartById(id) {
    return this.getPartById(id);
  }

  savePart(part) {
    const data = this.getData();
    const index = data.inventory.findIndex(p => p.partId === part.partId);
    if (index >= 0) {
      data.inventory[index] = part;
    } else {
      part.partId = part.partId || 'PRT-' + String(Date.now()).slice(-3);
      part.lastUpdated = new Date().toISOString().split('T')[0];
      data.inventory.push(part);
    }
    // Update status
    if (part.quantity === 0) part.stockStatus = 'Out of Stock';
    else if (part.quantity <= part.minStock) part.stockStatus = 'Low Stock';
    else part.stockStatus = 'In Stock';

    this.saveData(data);
    return part;
  }

  deletePart(id) {
    const data = this.getData();
    data.inventory = data.inventory.filter(p => p.partId !== id);
    this.saveData(data);
  }

  updateStock(partId, quantity) {
    const data = this.getData();
    const part = data.inventory.find(p => p.partId === partId);
    if (part) {
      part.quantity = Math.max(0, Number(quantity));
      if (part.quantity === 0) part.stockStatus = 'Out of Stock';
      else if (part.quantity <= part.minStock) part.stockStatus = 'Low Stock';
      else part.stockStatus = 'In Stock';
      part.lastUpdated = new Date().toISOString().split('T')[0];
      this.saveData(data);
      return part;
    }
    return null;
  }

  restockInventoryPart(partId, quantityToAdd) {
    const part = this.getPartById(partId);
    if (!part) return { success: false, message: 'Part not found' };
    const newQty = (part.quantity || 0) + Number(quantityToAdd);
    const updated = this.updateStock(partId, newQty);
    return { success: true, part: updated };
  }

  // --- INVOICES & BILLING ---
  getInvoices(filter = {}) {
    let list = this.getData().invoices || [];
    if (filter.customerId) {
      list = list.filter(inv => inv.customerId === filter.customerId);
    }
    if (filter.status && filter.status !== 'All') {
      list = list.filter(inv => inv.paymentStatus.toLowerCase() === filter.status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getInvoiceById(id) {
    return (this.getData().invoices || []).find(inv => inv.invoiceId === id);
  }

  generateInvoiceFromJobCard(jobCardId, discountPercent = 0) {
    const data = this.getData();
    const job = data.jobCards.find(j => j.jobCardId === jobCardId);
    if (!job) return null;

    const booking = data.bookings.find(b => b.bookingId === job.bookingId) || {};
    const customer = data.users.find(u => u.id === job.customerId) || {};

    const services = (job.services || []).map(s => ({
      name: s.name,
      amount: Number(s.cost || s.price || 0)
    }));
    const parts = (job.partsUsed || []).map(p => ({
      name: p.name,
      qty: p.quantity,
      unitPrice: p.unitPrice,
      total: p.total
    }));

    const servicesTotal = services.reduce((sum, s) => sum + s.amount, 0);
    const partsTotal = parts.reduce((sum, p) => sum + p.total, 0);
    const laborCharges = job.laborCharge || 800;
    const subtotal = servicesTotal + partsTotal + laborCharges;
    const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
    const taxableAmount = subtotal - discountAmount;
    const taxPercent = 18;
    const taxAmount = Number(((taxableAmount * taxPercent) / 100).toFixed(2));
    const grandTotal = Number((taxableAmount + taxAmount).toFixed(2));

    const invoiceId = 'INV-' + String(Date.now()).slice(-4);
    const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const invoice = {
      invoiceId,
      bookingId: job.bookingId,
      jobCardId: job.jobCardId,
      customerId: job.customerId,
      customerName: job.customerName || customer.name || 'Customer',
      customerPhone: job.customerPhone || customer.phone || '',
      customerEmail: customer.email || '',
      customerAddress: customer.address || 'Workshop Customer Counter',
      vehicleNo: job.vehicleNo,
      vehicleModel: job.vehicleModel,
      vehicleType: job.vehicleType,
      services,
      parts,
      laborCharges,
      servicesTotal,
      partsTotal,
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      grandTotal,
      paymentStatus: 'Pending',
      paymentMethod: null,
      paymentDate: null,
      transactionId: null,
      createdAt: new Date().toISOString(),
      dueDate
    };

    data.invoices.unshift(invoice);
    job.invoiceId = invoiceId;
    if (booking.bookingId) booking.invoiceId = invoiceId;

    this.addNotification({
      userId: job.customerId,
      title: 'Invoice Generated',
      message: `Invoice #${invoiceId} generated for vehicle ${job.vehicleNo}. Total: ₹${grandTotal.toLocaleString()}`,
      type: 'invoice'
    });

    this.saveData(data);
    return invoice;
  }

  recordPayment(invoiceId, method = 'UPI', transactionRef = null) {
    const data = this.getData();
    const invoice = data.invoices.find(inv => inv.invoiceId === invoiceId);
    if (!invoice) return { success: false, message: 'Invoice not found' };

    const transactionId = transactionRef || 'TXN-' + method.toUpperCase().replace(/\s+/g, '') + '-' + String(Date.now()).slice(-8);
    const now = new Date().toISOString();

    invoice.paymentStatus = 'Paid';
    invoice.paymentMethod = method;
    invoice.paymentDate = now;
    invoice.transactionId = transactionId;

    // Record payment log
    data.payments = data.payments || [];
    data.payments.unshift({
      transactionId,
      invoiceId,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      amount: invoice.grandTotal,
      method,
      status: 'Success',
      date: now,
      paymentGatewayRef: 'VSMS_SIM_' + Math.floor(Math.random() * 899999 + 100000)
    });

    // Update vehicle service history date
    const vehicle = data.vehicles.find(v => v.vehicleNo.toLowerCase() === invoice.vehicleNo.toLowerCase());
    if (vehicle) {
      vehicle.lastServiceDate = now.split('T')[0];
      vehicle.serviceCount = (vehicle.serviceCount || 0) + 1;
      const nextDue = new Date();
      nextDue.setMonth(nextDue.getMonth() + 6);
      vehicle.nextServiceDue = nextDue.toISOString().split('T')[0];
    }

    this.addNotification({
      userId: invoice.customerId,
      title: 'Payment Received',
      message: `Payment of ₹${invoice.grandTotal.toLocaleString()} for Invoice #${invoiceId} successful via ${method}.`,
      type: 'payment'
    });

    this.saveData(data);
    return { success: true, invoice, transactionId };
  }

  saveInvoice(invoice) {
    const data = this.getData();
    const index = data.invoices.findIndex(inv => inv.invoiceId === invoice.invoiceId);
    if (index >= 0) {
      data.invoices[index] = invoice;
    } else {
      data.invoices.unshift(invoice);
    }
    this.saveData(data);
    return invoice;
  }

  // --- REMINDERS & NOTIFICATIONS ---
  getReminders(customerId = null) {
    const list = this.getData().reminders || [];
    if (customerId) return list.filter(r => r.customerId === customerId && !r.isDismissed);
    return list;
  }

  dismissReminder(id) {
    const data = this.getData();
    const r = data.reminders.find(rem => rem.id === id);
    if (r) {
      r.isDismissed = true;
      this.saveData(data);
    }
  }

  getNotifications(userId = null) {
    const list = this.getData().notifications || [];
    if (userId) return list.filter(n => n.userId === userId || n.userId === 'ALL');
    return list;
  }

  addNotification(notif) {
    const data = this.getData();
    data.notifications = data.notifications || [];
    notif.id = 'NOTIF-' + String(Date.now()).slice(-4);
    notif.time = 'Just now';
    notif.read = false;
    data.notifications.unshift(notif);
    this.saveData(data);
  }

  markAllNotificationsRead(userId) {
    const data = this.getData();
    (data.notifications || []).forEach(n => {
      if (n.userId === userId || userId === 'admin') n.read = true;
    });
    this.saveData(data);
  }

  // --- STATS HELPER FOR DASHBOARDS ---
  getStats() {
    const data = this.getData();
    const bookings = data.bookings || [];
    const jobCards = data.jobCards || [];
    const invoices = data.invoices || [];
    const inventory = data.inventory || [];
    const vehicles = data.vehicles || [];
    const users = data.users || [];

    const totalRevenue = invoices
      .filter(i => i.paymentStatus === 'Paid')
      .reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    const pendingPayments = invoices
      .filter(i => i.paymentStatus === 'Pending')
      .reduce((sum, i) => sum + (i.grandTotal || 0), 0);

    const lowStockCount = inventory.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock').length;
    const activeServices = bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').length;
    const completedServices = bookings.filter(b => b.status === 'Completed').length;

    return {
      totalCustomers: users.filter(u => u.role === 'customer').length,
      totalVehicles: vehicles.length,
      totalBookings: bookings.length,
      activeServices,
      completedServices,
      totalRevenue,
      pendingPayments,
      lowStockCount,
      totalParts: inventory.length
    };
  }
}

// Global Singleton Instance
window.DB = new VSMSDatabase();
