/**
 * SIF Intelligence - Complete Approved Dataset
 * Fully matches the 5 Approved UI Screenshots
 */

const SIF_DATA = {
  // Global Metrics
  metrics: {
    totalReports: 1247,
    potentialSif: 86,
    nonSif: 1161,
    highRisk: 19,
    risingRisk: 5,
    escalated: 7
  },

  // Active Alerts for Command Center
  alerts: [
    {
      id: "ALT-101",
      caseId: "SIF-0241",
      level: "CRITICAL",
      riskScore: 91,
      title: "Recurring energy-isolation observations in Process Area A",
      location: "Process Area A",
      status: "Escalated",
      borderClass: "border-[#93000a]",
      levelColorClass: "text-[#93000a]",
      statusColorClass: "text-[#ba1a1a]"
    },
    {
      id: "ALT-102",
      caseId: "SIF-0240",
      level: "HIGH",
      riskScore: 78,
      title: "Increasing risk trajectory detected - Tank Farm",
      location: "Tank Farm",
      status: "Action Required",
      borderClass: "border-[#ba1a1a]",
      levelColorClass: "text-[#ba1a1a]",
      statusColorClass: "text-[#d97706]"
    }
  ],

  // Recent SIF Cases (Command Center)
  recentCases: [
    {
      id: "SIF-0241",
      reportType: "Near Miss",
      hazard: "Energy Isolation",
      riskScore: 91,
      sifPotential: "YES",
      status: "ACTION IN PROGRESS",
      updated: "12 min ago"
    },
    {
      id: "SIF-0240",
      reportType: "Unsafe Condition",
      hazard: "Confined Space",
      riskScore: 78,
      sifPotential: "YES",
      status: "ASSIGNED",
      updated: "31 min ago"
    },
    {
      id: "SIF-0239",
      reportType: "Unsafe Act",
      hazard: "Working at Height",
      riskScore: 72,
      sifPotential: "YES",
      status: "ALERTED",
      updated: "48 min ago"
    },
    {
      id: "SIF-0238",
      reportType: "Near Miss",
      hazard: "PPE",
      riskScore: 24,
      sifPotential: "NO",
      status: "CLOSED",
      updated: "1 hr ago"
    }
  ],

  // Prioritized Reports (Bulk Intelligence)
  prioritizedReports: [
    {
      id: "R104",
      reportType: "Near Miss",
      location: "Process Area A",
      equipment: "Pump P-101",
      hazard: "Energy Isolation",
      risk: 91,
      sifPotential: "Potential SIF",
      patternStatus: "ESCALATED",
      lifeSavingRule: "Energy Isolation",
      caseStatus: "ACTION REQUIRED",
      isLatest: true
    },
    {
      id: "R081",
      reportType: "Unsafe Act",
      location: "Process Area A",
      equipment: "Pump P-101",
      hazard: "Energy Isolation",
      risk: 76,
      sifPotential: "High Risk",
      patternStatus: "PATTERN DETECTED",
      lifeSavingRule: "Energy Isolation",
      caseStatus: "—",
      isLatest: false
    },
    {
      id: "R043",
      reportType: "Near Miss",
      location: "Process Area A",
      equipment: "Pump P-101",
      hazard: "Energy Isolation",
      risk: 57,
      sifPotential: "Non-SIF",
      patternStatus: "RISING",
      lifeSavingRule: "—",
      caseStatus: "—",
      isLatest: false
    },
    {
      id: "R017",
      reportType: "Unsafe Condition",
      location: "Process Area A",
      equipment: "Pump P-101",
      hazard: "Energy Isolation",
      risk: 39,
      sifPotential: "Non-SIF",
      patternStatus: "RELATED",
      lifeSavingRule: "—",
      caseStatus: "—",
      isLatest: false
    },
    {
      id: "R001",
      reportType: "Near Miss",
      location: "Process Area A",
      equipment: "Pump P-101",
      hazard: "Energy Isolation",
      risk: 22,
      sifPotential: "Non-SIF",
      patternStatus: "MONITORING",
      lifeSavingRule: "—",
      caseStatus: "—",
      isLatest: false
    }
  ],

  // SIF Cases Registry (Cases Screen)
  cases: [
    {
      id: "SIF-0241",
      type: "Near Miss",
      hazard: "Energy Isolation",
      location: "Process Area A",
      risk: 91,
      sifPotential: "Y",
      assignedTo: "HSE Engineer A",
      assignedRole: "HSE Engineer",
      status: "ACTION IN PROGRESS",
      riskOrigin: "Recurring Pattern Escalation",
      relatedReports: ["R001", "R017", "R043", "R081", "R104"],
      riskTrajectory: "22 → 39 → 57 → 76 → 91",
      whyEscalated: [
        "Repeated energy isolation observations",
        "Same process area",
        "Same equipment",
        "Increasing review-priority trajectory",
        "Related Life-Saving Rule concern"
      ],
      correctiveAction: {
        text: "Immediate Action: Stop affected maintenance activity and verify energy isolation before work resumes.",
        assignedTo: "HSE Engineer A",
        assignedRole: "HSE Engineer",
        priority: "Critical",
        due: "TODAY, 14:30"
      },
      lifecycle: [
        { name: "DETECTED", completed: true, active: false },
        { name: "ALERTED", completed: true, active: false },
        { name: "ASSIGNED", completed: true, active: false },
        { name: "ACTION IN PROGRESS", completed: false, active: true },
        { name: "EVIDENCE SUBMITTED", completed: false, active: false },
        { name: "VERIFIED", completed: false, active: false },
        { name: "CLOSED", completed: false, active: false }
      ],
      evidence: "Pending",
      verification: "Pending Evidence",
      auditTrail: [
        { time: "12:42", text: "Potential SIF precursor detected" },
        { time: "12:43", text: "Recurring pattern escalation generated" },
        { time: "12:47", text: "Case assigned to HSE Engineer A" },
        { time: "13:05", text: "Corrective action started" }
      ]
    },
    {
      id: "SIF-0240",
      type: "Unsafe Condition",
      hazard: "Confined Space",
      location: "Tank Farm",
      risk: 78,
      sifPotential: "Y",
      assignedTo: "HSE Engineer B",
      assignedRole: "HSE Engineer",
      status: "ASSIGNED",
      riskOrigin: "Atmospheric Sensor Anomaly",
      relatedReports: ["R022", "R055", "R094"],
      riskTrajectory: "30 → 55 → 78",
      whyEscalated: [
        "Continuous 4-gas monitor low O2 alarm",
        "Compromised ventilation ducting",
        "Entry permit pre-signed"
      ],
      correctiveAction: {
        text: "Lockout access manway and re-route positive ventilation air ducts.",
        assignedTo: "HSE Engineer B",
        assignedRole: "HSE Engineer",
        priority: "High",
        due: "TODAY, 16:00"
      },
      lifecycle: [
        { name: "DETECTED", completed: true, active: false },
        { name: "ALERTED", completed: true, active: false },
        { name: "ASSIGNED", completed: false, active: true },
        { name: "ACTION IN PROGRESS", completed: false, active: false },
        { name: "EVIDENCE SUBMITTED", completed: false, active: false },
        { name: "VERIFIED", completed: false, active: false },
        { name: "CLOSED", completed: false, active: false }
      ],
      evidence: "Pending",
      verification: "Pending Evidence",
      auditTrail: [
        { time: "11:15", text: "Precursor event detected" },
        { time: "11:20", text: "Assigned to HSE Engineer B" }
      ]
    },
    {
      id: "SIF-0239",
      type: "Unsafe Act",
      hazard: "Working at Height",
      location: "Maintenance Zone",
      risk: 72,
      sifPotential: "Y",
      assignedTo: "Maintenance Engineer A",
      assignedRole: "Maintenance Engineer",
      status: "ALERTED",
      riskOrigin: "100% Tie-Off Rule Non-Compliance",
      relatedReports: ["R011", "R038", "R089"],
      riskTrajectory: "25 → 48 → 72",
      whyEscalated: [
        "Unclipped lanyard during 7.5m pipe rack traverse",
        "Static lifeline discontinuous"
      ],
      correctiveAction: {
        text: "Install static horizontal lifeline cable along PR-2.",
        assignedTo: "Maintenance Engineer A",
        assignedRole: "Maintenance Engineer",
        priority: "High",
        due: "TOMORROW, 10:00"
      },
      lifecycle: [
        { name: "DETECTED", completed: true, active: false },
        { name: "ALERTED", completed: false, active: true },
        { name: "ASSIGNED", completed: false, active: false },
        { name: "ACTION IN PROGRESS", completed: false, active: false },
        { name: "EVIDENCE SUBMITTED", completed: false, active: false },
        { name: "VERIFIED", completed: false, active: false },
        { name: "CLOSED", completed: false, active: false }
      ],
      evidence: "Pending",
      verification: "Pending Evidence",
      auditTrail: [
        { time: "10:30", text: "Height precursor observation submitted" }
      ]
    },
    {
      id: "SIF-0238",
      type: "Near Miss",
      hazard: "PPE",
      location: "Utilities",
      risk: 24,
      sifPotential: "N",
      assignedTo: "Safety Officer A",
      assignedRole: "Safety Officer",
      status: "CLOSED",
      riskOrigin: "Routine Housekeeping",
      relatedReports: ["R005"],
      riskTrajectory: "24",
      whyEscalated: ["Standard low-energy particle deflection."],
      correctiveAction: {
        text: "Replaced spark face shield at bay 3.",
        assignedTo: "Safety Officer A",
        assignedRole: "Safety Officer",
        priority: "Low",
        due: "COMPLETED"
      },
      lifecycle: [
        { name: "DETECTED", completed: true, active: false },
        { name: "ALERTED", completed: true, active: false },
        { name: "ASSIGNED", completed: true, active: false },
        { name: "ACTION IN PROGRESS", completed: true, active: false },
        { name: "EVIDENCE SUBMITTED", completed: true, active: false },
        { name: "VERIFIED", completed: true, active: false },
        { name: "CLOSED", completed: true, active: false }
      ],
      evidence: "Verified",
      verification: "Supervisor Signoff",
      auditTrail: [
        { time: "09:00", text: "Observation logged" },
        { time: "09:30", text: "Resolved and closed" }
      ]
    }
  ],

  // Risk Evolution Trajectory & Timeline Data
  riskEvolution: {
    hazard: "ENERGY ISOLATION",
    statusBadges: ["CRITICAL", "ESCALATED"],
    location: "Process Area A • Pump P-101",
    currentScore: 91,
    maxScore: 100,
    logicBanner: "Non-SIF reports remain in the intelligence pipeline. Recurring related observations + increasing risk trajectory = emerging Potential SIF risk.",
    trajectoryPoints: [
      { id: "R001", risk: 22, band: "NON-SIF" },
      { id: "R017", risk: 39, band: "NON-SIF" },
      { id: "R043", risk: 57, band: "NON-SIF" },
      { id: "R081", risk: 76, band: "RISING RISK" },
      { id: "R104", risk: 91, band: "POTENTIAL SIF" }
    ],
    checklist: [
      { text: "Same location (Process Area A)", checked: true },
      { text: "Same equipment (Pump P-101)", checked: true },
      { text: "Same hazard", checked: true },
      { text: "Related safety observations", checked: true },
      { text: "Increasing frequency", checked: true },
      { text: "Increasing risk scores", checked: true, isTrend: true }
    ],
    timeline: [
      { id: "R001", risk: 22, badge: "INITIAL", title: "Initial unsafe condition identified", isLatest: false },
      { id: "R017", risk: 39, badge: "RELATED", title: "Related observation reported", isLatest: false },
      { id: "R043", risk: 57, badge: "RISING", title: "Risk escalating due to proximity", isLatest: false },
      { id: "R081", risk: 76, badge: "PATTERN DETECTED", title: "Recurring hazard pattern confirmed", isLatest: false },
      { id: "R104", risk: 91, badge: "ESCALATED", title: "Critical threshold reached - Potential SIF designated", isLatest: true }
    ],
    relatedReports: [
      { id: "R081", risk: 76 },
      { id: "R043", risk: 57 },
      { id: "R017", risk: 39 }
    ]
  }
};

if (typeof window !== "undefined") {
  window.SIF_DATA = SIF_DATA;
}
