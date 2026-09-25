export const SIF_DATA = {
  metrics: {
    totalReports: "1,247",
    potentialSif: "86",
    nonSif: "1,161",
    highRisk: "19",
    escalated: "7",
    risingRisk: "5"
  },
  distribution: {
    nonSif: 1161,
    potentialSif: 86,
    highRisk: 19,
    risingRisk: 5
  },
  alerts: [
    {
      id: 1,
      level: "CRITICAL",
      riskScore: 91,
      title: "Recurring energy-isolation observations in Process Area A",
      location: "Process Area A",
      status: "Escalated",
      time: "10m ago"
    },
    {
      id: 2,
      level: "HIGH",
      riskScore: 78,
      title: "Increasing review-priority trajectory detected - Tank Farm",
      location: "Tank Farm",
      status: "Action Required",
      time: "25m ago"
    }
  ],
  reports: [
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
  cases: [
    {
      id: "SIF-0241",
      type: "Near Miss",
      hazard: "Energy Isolation",
      location: "Process Area A",
      risk: 91,
      sifPotential: "Y",
      assignedTo: "J. Thompson",
      status: "ACTION IN PROGRESS",
      riskOrigin: "Recurring Pattern Escalation",
      relatedReports: ["R001", "R017", "R043", "R081", "R104"],
      riskTrajectory: "22 → 39 → 57 → 76 → 91",
      whyEscalated: [
        "Repeated energy isolation observations",
        "Same process area",
        "Same equipment",
        "Increasing risk trajectory",
        "Related Life-Saving Rule concern"
      ],
      correctiveAction: {
        text: "Immediate Action: Stop affected maintenance activity and verify energy isolation before work resumes.",
        assignedTo: "R. Sharma",
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
        { time: "12:47", text: "Case assigned to R. Sharma" },
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
      assignedTo: "R. Miller",
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
        assignedTo: "R. Miller",
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
        { time: "11:20", text: "Assigned to R. Miller" }
      ]
    },
    {
      id: "SIF-0239",
      type: "Unsafe Act",
      hazard: "Working at Height",
      location: "Maintenance Zone",
      risk: 72,
      sifPotential: "Y",
      assignedTo: "S. Garcia",
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
        assignedTo: "S. Garcia",
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
      assignedTo: "T. Lee",
      status: "CLOSED",
      riskOrigin: "Routine Housekeeping",
      relatedReports: ["R005"],
      riskTrajectory: "24",
      whyEscalated: ["Standard low-energy particle deflection."],
      correctiveAction: {
        text: "Replaced spark face shield at bay 3.",
        assignedTo: "T. Lee",
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
  riskEvolution: {
    id: "PAT-001",
    hazard: "ENERGY ISOLATION",
    location: "Process Area A • Pump P-101",
    equipment: "Pump P-101",
    currentRiskScore: 91,
    maxScore: 100,
    statusBadges: ["CRITICAL", "ESCALATED"],
    logicBanner: "Non-SIF reports remain in the intelligence pipeline. Recurring related observations + increasing risk trajectory = emerging Potential SIF risk.",
    escalationMessage: "Potential SIF risk increased due to recurring related observations.",
    trajectoryPoints: [
      { id: "R001", risk: 22, band: "NON-SIF", classification: "Non-SIF", status: "MONITORING", title: "Initial unsafe condition identified during shift turnover" },
      { id: "R017", risk: 39, band: "NON-SIF", classification: "Non-SIF", status: "RELATED", title: "Related LOTO station observation reported" },
      { id: "R043", risk: 57, band: "NON-SIF", classification: "Rising Risk", status: "RISING", title: "Breaker handle stiff / risk escalating due to proximity" },
      { id: "R081", risk: 76, band: "RISING RISK", classification: "High Risk", status: "PATTERN DETECTED", title: "Recurring hazard pattern confirmed in junction box" },
      { id: "R104", risk: 91, band: "POTENTIAL SIF", classification: "Potential SIF", status: "ESCALATED", title: "Critical threshold reached - Potential SIF designated" }
    ],
    checklist: [
      { text: "Same location (Process Area A)", checked: true },
      { text: "Same equipment (Pump P-101)", checked: true },
      { text: "Same hazard", checked: true },
      { text: "Repeated related observations", checked: true },
      { text: "Increasing frequency", checked: true },
      { text: "Increasing risk scores", checked: true, isTrend: true },
      { text: "Life-Saving Rule concern (Energy Isolation)", checked: true, isAlert: true }
    ],
    timeline: [
      { id: "R001", risk: 22, badge: "MONITORING", title: "Initial unsafe condition identified", isLatest: false },
      { id: "R017", risk: 39, badge: "RELATED", title: "Related observation reported", isLatest: false },
      { id: "R043", risk: 57, badge: "RISING", title: "Risk escalating due to proximity", isLatest: false },
      { id: "R081", risk: 76, badge: "PATTERN DETECTED", title: "Recurring hazard pattern confirmed", isLatest: false },
      { id: "R104", risk: 91, badge: "ESCALATED", title: "Critical threshold reached - Potential SIF designated", isLatest: true }
    ],
    relatedReports: [
      { id: "R081", risk: 76, title: "Unsafe Act - Lockout tag missing" },
      { id: "R043", risk: 57, title: "Near Miss - Breaker handle stiff" },
      { id: "R017", risk: 39, title: "Unsafe Condition - Hasps missing" },
      { id: "R001", risk: 22, title: "Near Miss - Shift turnover observation" }
    ]
  }
};
