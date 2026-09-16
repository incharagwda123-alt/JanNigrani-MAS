// JanNigrani Mock Dataset
// Modeled directly on the official MoSPI DigiGov Dashboard (mplads.mospi.gov.in)
// Contains official schema fields and realistic anomalies from the SIH team playbook

window.JANNIGRANI_DATA = [
  {
    project_id: "MPLADS-2026-KA-1042",
    description: "Construction of Community Hall and Digital Skill Center, Ward 14",
    sector: "Community Assets & Skill Development",
    state: "Karnataka",
    district: "Bengaluru Urban",
    constituency: "Bengaluru South",
    mp_name: "Hon. Tejasvi Surya",
    sanctioned_amount: 8500000,
    estimated_amount: 8100000,
    actual_expenditure: 8350000,
    progress_percent: 52,
    fund_utilization_percent: 98.2,
    sanction_date: "2025-11-10",
    target_completion_date: "2026-05-30",
    actual_completion_date: null,
    contractor_id: "CON-042",
    contractor_name: "ABC Infra Solutions Pvt Ltd",
    agency_id: "AG-017",
    agency_name: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    latitude: 12.9249,
    longitude: 77.5852,
    inspection_status: "Missing Inspection Evidence",
    completion_certificate_status: "Not Submitted",
    risk_score: 86,
    priority: "High",
    contributing_signals: [
      {
        signal: "Payment-Progress Mismatch",
        contribution: 35,
        reason: "98.2% of funds disbursed (₹83.5L) while physical progress is stalled at 52% (46.2% gap)."
      },
      {
        signal: "Duplicate Scope Alert",
        contribution: 27,
        reason: "91% textual & purpose similarity with project MPLADS-2025-KA-0891 located 280m away."
      },
      {
        signal: "Cost Outlier Anomaly",
        contribution: 24,
        reason: "Estimated cost of ₹85L is 41% above the district median (₹60.2L) for Grade-II community halls."
      },
      {
        signal: "Contractor Concentration",
        contribution: 14,
        reason: "Contractor ABC Infra holds 11 active works across 3 agencies in this district."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹39,30,000 over-disbursed relative to physical milestone",
      nearby_matching_project: {
        id: "MPLADS-2025-KA-0891",
        name: "Renovation & Extension of Community Facility, Ward 14",
        distance_meters: 280,
        sanction_gap_days: 42
      },
      missing_documents: [
        "First-Tranche Utilization Certificate (UC)",
        "Executive Engineer Physical Measurement Book (MB) Entry",
        "Geo-tagged Site Photograph (Mandatory under 2023 Guidelines)"
      ],
      recommended_action: [
        "Freeze disbursement of remaining contingency funds immediately.",
        "Issue physical site inspection notice to Assistant Executive Engineer (AEE).",
        "Cross-verify work scope against Ward 14 PWD asset register to eliminate duplicate funding."
      ]
    },
    disclaimer: "This alert indicates investigation priority and requires physical verification. It does not constitute proof of fraud."
  },
  {
    project_id: "MPLADS-2026-KA-1108",
    description: "Cement Concrete (CC) Road and Drain from Main Arch to Govt High School",
    sector: "Roads, Pathways & Bridges",
    state: "Karnataka",
    district: "Bengaluru Urban",
    constituency: "Bengaluru South",
    mp_name: "Hon. Tejasvi Surya",
    sanctioned_amount: 4800000,
    estimated_amount: 4650000,
    actual_expenditure: 4700000,
    progress_percent: 60,
    fund_utilization_percent: 97.9,
    sanction_date: "2025-12-04",
    target_completion_date: "2026-06-15",
    actual_completion_date: null,
    contractor_id: "CON-042",
    contractor_name: "ABC Infra Solutions Pvt Ltd",
    agency_id: "AG-017",
    agency_name: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    latitude: 12.9312,
    longitude: 77.5898,
    inspection_status: "Pending Third-Party Verification",
    completion_certificate_status: "Not Submitted",
    risk_score: 82,
    priority: "High",
    contributing_signals: [
      {
        signal: "Duplicate Geolocation Overlay",
        contribution: 30,
        reason: "Geospatial coordinates directly overlap with State PWD Project #PWD-ROAD-4091 (160m distance)."
      },
      {
        signal: "Payment-Progress Gap",
        contribution: 30,
        reason: "97.9% expenditure booked, but sub-base and drainage works certified at only 60%."
      },
      {
        signal: "Contractor Clustering",
        contribution: 22,
        reason: "Contractor ABC Infra repeatedly awarded road packages without transparent multi-bid logs."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹18,20,000 early release ahead of mandatory curing milestone",
      nearby_matching_project: {
        id: "PWD-ROAD-4091",
        name: "Development of School Access Road under State Head of Account",
        distance_meters: 160,
        sanction_gap_days: 90
      },
      missing_documents: [
        "Quality Test Certificate for Concrete Core Compressive Strength",
        "Pre-monsoon Drainage Inspection Sign-off"
      ],
      recommended_action: [
        "Summon BBMP ward engineer to produce Joint Measurement Sheet.",
        "Check State PWD billings to ensure public road was not double-funded under two separate budget heads."
      ]
    },
    disclaimer: "This alert indicates investigation priority and requires physical verification. It does not constitute proof of fraud."
  },
  {
    project_id: "MPLADS-2026-KA-1150",
    description: "Installation of 25 High-Mast Solar LED Lights in Public Parks",
    sector: "Electricity & Solar Energy",
    state: "Karnataka",
    district: "Bengaluru Urban",
    constituency: "Bengaluru Central",
    mp_name: "Hon. P. C. Mohan",
    sanctioned_amount: 3200000,
    estimated_amount: 3200000,
    actual_expenditure: 2900000,
    progress_percent: 70,
    fund_utilization_percent: 90.6,
    sanction_date: "2026-01-15",
    target_completion_date: "2026-04-30",
    actual_completion_date: null,
    contractor_id: "CON-088",
    contractor_name: "Apex Renewable Systems LLP",
    agency_id: "AG-009",
    agency_name: "Karnataka Renewable Energy Dev Ltd (KREDL)",
    latitude: 12.9716,
    longitude: 77.5946,
    inspection_status: "Inspected - Minor Defect",
    completion_certificate_status: "Pending",
    risk_score: 58,
    priority: "Medium",
    contributing_signals: [
      {
        signal: "Cost Outlier Anomaly",
        contribution: 28,
        reason: "Unit cost of ₹1.28L per high-mast light is 26% higher than DGS&D/GeM standard rate contract."
      },
      {
        signal: "Milestone Timing Deviation",
        contribution: 18,
        reason: "Second tranche released before verification of solar battery warranty deeds."
      },
      {
        signal: "Inspection Flag",
        contribution: 12,
        reason: "6 out of 25 lighting masts installed without foundation earthing certificates."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹6,60,000 potential unit-rate pricing variance",
      nearby_matching_project: null,
      missing_documents: [
        "OEM Warranty Certificate for LiFePO4 Battery Banks",
        "GeM Contract Price Parity Justification Note"
      ],
      recommended_action: [
        "Request GeM vendor invoice comparison from KREDL nodal officer.",
        "Withhold final 10% retention bank guarantee until earthing tests are verified."
      ]
    },
    disclaimer: "This alert indicates investigation priority and requires physical verification. It does not constitute proof of fraud."
  },
  {
    project_id: "MPLADS-2025-KA-0762",
    description: "Reverse Osmosis (RO) Safe Drinking Water Purification Plant, Channapatna Road",
    sector: "Drinking Water & Public Health",
    state: "Karnataka",
    district: "Ramanagara",
    constituency: "Bangalore Rural",
    mp_name: "Hon. Dr. C. N. Manjunath",
    sanctioned_amount: 1950000,
    estimated_amount: 1950000,
    actual_expenditure: 1950000,
    progress_percent: 75,
    fund_utilization_percent: 100.0,
    sanction_date: "2025-05-20",
    target_completion_date: "2025-10-31",
    actual_completion_date: null,
    contractor_id: "CON-104",
    contractor_name: "Jal Jeevan Watertech Works",
    agency_id: "AG-024",
    agency_name: "Rural Water Supply & Sanitation Division (RDPR)",
    latitude: 12.6518,
    longitude: 77.2089,
    inspection_status: "Inspection Delayed by 120 Days",
    completion_certificate_status: "Missing",
    risk_score: 64,
    priority: "Medium",
    contributing_signals: [
      {
        signal: "Timeline Delay & Abandonment Risk",
        contribution: 28,
        reason: "Work is 315 days past statutory target date with no extension order uploaded."
      },
      {
        signal: "100% Fund Depletion with Incomplete Asset",
        contribution: 26,
        reason: "All sanctioned funds (₹19.5L) disbursed while water treatment membrane testing remains unfinished."
      },
      {
        signal: "Inspection Protocol Failure",
        contribution: 10,
        reason: "District Technical Officer has not conducted mandatory potability water test."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹4,87,500 disbursed for uninstalled pump machinery",
      nearby_matching_project: null,
      missing_documents: [
        "Bacteriological & Chemical Water Quality Certificate (NABL Lab)",
        "Formal Panchayat Handover & Asset Registration Certificate"
      ],
      recommended_action: [
        "Depute District Flying Squad to inspect physical RO facility.",
        "Serve explanation notice to Implementing Officer for releasing 100% funds without trial run."
      ]
    },
    disclaimer: "This alert indicates investigation priority and requires physical verification. It does not constitute proof of fraud."
  },
  {
    project_id: "MPLADS-2026-KA-1201",
    description: "Model Anganwadi Center and Early Learning Classroom with Child-Friendly Toilets",
    sector: "Education & Child Welfare",
    state: "Karnataka",
    district: "Bengaluru Urban",
    constituency: "Bengaluru South",
    mp_name: "Hon. Tejasvi Surya",
    sanctioned_amount: 2200000,
    estimated_amount: 2200000,
    actual_expenditure: 2160000,
    progress_percent: 100,
    fund_utilization_percent: 98.2,
    sanction_date: "2025-08-14",
    target_completion_date: "2026-02-28",
    actual_completion_date: "2026-02-15",
    contractor_id: "CON-067",
    contractor_name: "Sri Lakshmi Civil Builders",
    agency_id: "AG-017",
    agency_name: "Bruhat Bengaluru Mahanagara Palike (BBMP)",
    latitude: 12.9102,
    longitude: 77.6015,
    inspection_status: "Verified with Geo-tagged Photographs",
    completion_certificate_status: "Submitted & Approved",
    risk_score: 8,
    priority: "Low",
    contributing_signals: [
      {
        signal: "Normal Progression",
        contribution: 0,
        reason: "Expenditure matches physical milestone curves with complete photographic audit trail."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹0 (Zero variance, completed under sanctioned estimate)",
      nearby_matching_project: null,
      missing_documents: [],
      recommended_action: [
        "Mark project as 'Durable Asset Created' in MoSPI National Register.",
        "Archive audit logs for routine annual CAG reconciliation."
      ]
    },
    disclaimer: "This project complies with established statutory norms and MPLADS guidelines."
  },
  {
    project_id: "MPLADS-2026-UP-3419",
    description: "Construction of Multi-Purpose Rural Sports Complex & Gymnasium",
    sector: "Sports & Youth Development",
    state: "Uttar Pradesh",
    district: "Varanasi",
    constituency: "Varanasi",
    mp_name: "Hon. Narendra Modi",
    sanctioned_amount: 11500000,
    estimated_amount: 11200000,
    actual_expenditure: 11150000,
    progress_percent: 68,
    fund_utilization_percent: 97.0,
    sanction_date: "2025-09-01",
    target_completion_date: "2026-03-31",
    actual_completion_date: null,
    contractor_id: "CON-210",
    contractor_name: "Kashi Infraprojects Corp",
    agency_id: "AG-045",
    agency_name: "Varanasi Development Authority (VDA)",
    latitude: 25.3176,
    longitude: 82.9739,
    inspection_status: "Interim Inspection Certified",
    completion_certificate_status: "Pending Final Roof Truss",
    risk_score: 72,
    priority: "High",
    contributing_signals: [
      {
        signal: "Payment Acceleration Anomaly",
        contribution: 28,
        reason: "Three consecutive tranche payments released within 14 days without intermediate stage sign-off."
      },
      {
        signal: "Payment-Progress Gap",
        contribution: 26,
        reason: "97% payment released while sports indoor court flooring remains pending (68% completion)."
      },
      {
        signal: "Cost Variance",
        contribution: 18,
        reason: "Synthetic turf and indoor wooden flooring billed at 32% above UP PWD schedule of rates."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹33,30,000 advanced prematurely",
      nearby_matching_project: null,
      missing_documents: [
        "Third-Party Structural Stability Sign-off",
        "Sports Authority of India (SAI) Equipment Specification Compliance Certificate"
      ],
      recommended_action: [
        "Instruct VDA Chief Engineer to inspect pre-requisite sub-base before approving final bill.",
        "Perform material rate comparison against UP PWD CSR rates."
      ]
    },
    disclaimer: "This alert indicates investigation priority and requires physical verification. It does not constitute proof of fraud."
  },
  {
    project_id: "MPLADS-2026-MH-5092",
    description: "Primary Healthcare Diagnostic Unit & Telemedicine Tele-Clinic Facility",
    sector: "Healthcare & Sanitation",
    state: "Maharashtra",
    district: "Pune",
    constituency: "Pune",
    mp_name: "Hon. Murlidhar Mohol",
    sanctioned_amount: 6200000,
    estimated_amount: 6000000,
    actual_expenditure: 5900000,
    progress_percent: 88,
    fund_utilization_percent: 95.2,
    sanction_date: "2025-10-15",
    target_completion_date: "2026-05-15",
    actual_completion_date: null,
    contractor_id: "CON-315",
    contractor_name: "Sahyadri MediTech Infrastructure",
    agency_id: "AG-062",
    agency_name: "Pune Municipal Corporation (PMC)",
    latitude: 18.5204,
    longitude: 73.8567,
    inspection_status: "Inspected & Verified",
    completion_certificate_status: "Pending Equipment Commissioning",
    risk_score: 22,
    priority: "Low",
    contributing_signals: [
      {
        signal: "Minor Documentation Delay",
        contribution: 12,
        reason: "Telemedicine equipment calibration certificates awaiting sign-off."
      }
    ],
    evidence_bundle: {
      divergence_amount: "₹0 (Compliant milestone disbursement)",
      nearby_matching_project: null,
      missing_documents: [
        "Biomedical Equipment Commissioning Log"
      ],
      recommended_action: [
        "Conduct scheduled trial connection with Civil Hospital server.",
        "Approve final 5% retention release upon successful trial."
      ]
    },
    disclaimer: "This project complies with established statutory norms and MPLADS guidelines."
  }
];

window.JANNIGRANI_GRAPH = {
  nodes: [
    { id: "AG-017", label: "BBMP (Agency)", type: "agency", x: 260, y: 140, risk: "normal" },
    { id: "AG-009", label: "KREDL (Agency)", type: "agency", x: 620, y: 120, risk: "normal" },
    { id: "AG-024", label: "RDPR (Agency)", type: "agency", x: 440, y: 380, risk: "normal" },
    
    { id: "CON-042", label: "ABC Infra Pvt Ltd", type: "contractor", x: 380, y: 220, risk: "high", count: "11 Projects", density: "88%" },
    { id: "CON-088", label: "Apex Renewables", type: "contractor", x: 680, y: 240, risk: "medium", count: "4 Projects", density: "45%" },
    { id: "CON-067", label: "Sri Lakshmi Builders", type: "contractor", x: 180, y: 290, risk: "low", count: "2 Projects", density: "12%" },

    { id: "P-1042", label: "Comm Hall (₹85L)", type: "project", x: 310, y: 320, priority: "High", score: 86 },
    { id: "P-1108", label: "Road & Drain (₹48L)", type: "project", x: 460, y: 290, priority: "High", score: 82 },
    { id: "P-0891", label: "Near Duplicate (₹78L)", type: "project", x: 390, y: 370, priority: "High", score: 84 },
    { id: "P-1150", label: "Solar Lights (₹32L)", type: "project", x: 740, y: 310, priority: "Medium", score: 58 },
    { id: "P-1201", label: "Anganwadi (₹22L)", type: "project", x: 120, y: 380, priority: "Low", score: 8 }
  ],
  links: [
    { source: "AG-017", target: "CON-042", label: "Multiple Direct Awards" },
    { source: "AG-009", target: "CON-042", label: "Cross-Agency Award" },
    { source: "CON-042", target: "P-1042", label: "Awarded (Outlier)" },
    { source: "CON-042", target: "P-1108", label: "Awarded (Overlap)" },
    { source: "CON-042", target: "P-0891", label: "Awarded (Duplicate)" },
    { source: "AG-009", target: "CON-088", label: "Rate Contract" },
    { source: "CON-088", target: "P-1150", label: "Solar Installation" },
    { source: "AG-017", target: "CON-067", label: "Clean Tender" },
    { source: "CON-067", target: "P-1201", label: "Completed" }
  ]
};
