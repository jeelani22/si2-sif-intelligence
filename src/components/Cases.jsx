import React, { useState, useEffect } from 'react';
import { SIF_DATA } from '../data/sifData';
import { apiClient } from '../services/api';

export default function Cases({ selectedCaseId, setSelectedCaseId, onNavigate, onNotification }) {
  const [casesList, setCasesList] = useState(SIF_DATA.cases);
  const [currentCase, setCurrentCase] = useState(SIF_DATA.cases[0]);
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Fetch all cases on mount
  const loadCases = async () => {
    try {
      const res = await apiClient.getCases();
      if (res && res.length > 0) {
        setCasesList(res);
        const match = res.find((c) => c.id === selectedCaseId) || res[0];
        setCurrentCase(match);
      }
    } catch (e) {
      console.warn('Using local cases fallback:', e);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  // Fetch single case details when selectedCaseId changes
  useEffect(() => {
    let isMounted = true;
    if (selectedCaseId) {
      apiClient.getCaseById(selectedCaseId).then((res) => {
        if (res && isMounted) {
          setCurrentCase(res);
        } else if (isMounted) {
          const match = casesList.find((c) => c.id === selectedCaseId);
          if (match) setCurrentCase(match);
        }
      });
    }
    return () => { isMounted = false; };
  }, [selectedCaseId]);

  // Button 1: Update Corrective Action via API
  const handleUpdateAction = async () => {
    setActionInProgress(true);
    try {
      const patchData = {
        status: 'ACTION IN PROGRESS',
        correctiveAction: {
          text: currentCase.correctiveAction?.text || "Immediate Action: Stop affected maintenance activity and verify energy isolation before work resumes.",
          assignedTo: currentCase.correctiveAction?.assignedTo || "HSE Engineer A",
          assignedRole: currentCase.correctiveAction?.assignedRole || "HSE Engineer",
          priority: currentCase.correctiveAction?.priority || "Critical",
          due: currentCase.correctiveAction?.due || "TODAY, 14:30"
        }
      };
      const res = await apiClient.updateCase(currentCase.id, patchData);
      if (res) {
        setCurrentCase(res);
        setCasesList(casesList.map((c) => (c.id === res.id ? res : c)));
      }
      if (onNotification) onNotification(`Action updated on ${currentCase.id}. State persisted in backend.`);
    } catch (e) {
      if (onNotification) onNotification('Action update error.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Button 2: Submit Evidence (Does NOT close the case!)
  const handleSubmitEvidence = async () => {
    setActionInProgress(true);
    try {
      const patchData = {
        evidence: "Photographic LOTO zero-voltage verification & signoff attached"
      };
      const res = await apiClient.updateCase(currentCase.id, patchData);
      if (res) {
        setCurrentCase(res);
        setCasesList(casesList.map((c) => (c.id === res.id ? res : c)));
      }
      if (onNotification) {
        onNotification(`Evidence submitted for ${currentCase.id}. Ready for supervisor verification.`);
      }
    } catch (e) {
      if (onNotification) onNotification('Evidence submission error.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Button 3: Verify Corrective Action (Independent Supervisor Action)
  const handleVerifyCase = async () => {
    setActionInProgress(true);
    try {
      const patchData = {
        verification: "Verified by HSE Reviewer A"
      };
      const res = await apiClient.updateCase(currentCase.id, patchData);
      if (res) {
        setCurrentCase(res);
        setCasesList(casesList.map((c) => (c.id === res.id ? res : c)));
      }
      if (onNotification) {
        onNotification(`Case ${currentCase.id} verified and closed by HSE Reviewer A.`);
      }
    } catch (e) {
      if (onNotification) onNotification('Verification error.');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleExport = () => {
    const rows = [
      ['Case ID', 'Type', 'Hazard', 'Location', 'Review Priority', 'SIF Potential', 'Assigned To', 'Status'],
      ...casesList.map((c) => [c.id, c.type, c.hazard, c.location, c.risk, c.sifPotential, c.assignedTo, c.status]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `SIF_Cases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onNotification) onNotification('CSV dataset downloaded.');
  };

  // Check if evidence is submitted to enable verification
  const isEvidenceSubmitted = currentCase.evidence && currentCase.evidence !== "Pending";
  const isClosed = currentCase.status === "CLOSED";

  return (
    <div className="flex-grow flex flex-col p-container-padding gap-5 max-w-[1920px] mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display-lg text-[28px] text-primary font-bold tracking-tight uppercase">CASES</h1>
          <p className="font-body-md text-sm text-secondary">Track Potential-SIF cases from detection through corrective action, verification and closure.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="bg-surface-container-lowest text-primary border border-outline-variant px-3.5 py-2 rounded font-label-md text-xs font-bold uppercase hover:bg-surface-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span> EXPORT CSV
          </button>
          <button 
            onClick={() => onNavigate('analyze-report')}
            className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-xs font-bold uppercase hover:bg-on-background transition-colors flex items-center gap-1.5"
          >
            + NEW CASE
          </button>
        </div>
      </header>

      {/* Toolbar Filters */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select className="bg-surface-container-lowest border border-outline-variant text-primary text-xs font-bold rounded p-2"><option>ALL CASES ⌵</option></select>
          <select className="bg-surface-container-lowest border border-outline-variant text-primary text-xs font-bold rounded p-2"><option>RISK LEVEL: ANY ⌵</option></select>
          <select className="bg-surface-container-lowest border border-outline-variant text-primary text-xs font-bold rounded p-2"><option>STATUS: ACTIVE ⌵</option></select>
          <select className="bg-surface-container-lowest border border-outline-variant text-primary text-xs font-bold rounded p-2"><option>LOCATION: ALL ⌵</option></select>
        </div>
        <div className="relative min-w-[280px]">
          <input type="text" placeholder="Search case ID, hazard or location..." className="w-full bg-surface-container-lowest border border-outline-variant text-xs rounded pl-8 pr-3 py-2 text-primary focus:ring-1 focus:ring-primary"/>
          <span className="material-symbols-outlined text-secondary text-sm absolute left-2.5 top-2.5">search</span>
        </div>
      </section>

      {/* 60/40 Split View */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap items-start">
        {/* Left: SIF Case Management Table (60% -> 7-col) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant flex flex-col overflow-hidden">
          <div className="p-3.5 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h2 className="font-bold text-primary text-xs">SIF Case Management</h2>
            <span className="text-xs text-secondary font-mono-label">{casesList.length} Records Found ⫧</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-outline-variant font-label-md text-xs text-secondary">
                  <th className="p-3">CASE ID</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">HAZARD</th>
                  <th className="p-3">LOCATION</th>
                  <th className="p-3">REVIEW PRIORITY</th>
                  <th className="p-3">SIF POTENTIAL</th>
                  <th className="p-3">ASSIGNED TO</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-xs">
                {casesList.map((c) => {
                  const isSelected = c.id === currentCase.id;
                  const rowBg = isSelected ? 'bg-[#e0edff] border-l-4 border-l-primary' : 'hover:bg-surface-container-low';
                  
                  let riskPill = <span className="font-mono-label text-xs bg-surface-container text-secondary px-1.5 py-0.5 rounded">{c.risk}</span>;
                  if (c.risk >= 90) {
                    riskPill = <span className="font-mono-label text-xs bg-[#fee2e2] text-[#991b1b] font-bold px-1.5 py-0.5 rounded border border-[#fecaca]">{c.risk}</span>;
                  } else if (c.risk >= 70) {
                    riskPill = <span className="font-mono-label text-xs bg-[#fef3c7] text-[#92400e] font-semibold px-1.5 py-0.5 rounded border border-[#fde68a]">{c.risk}</span>;
                  }

                  const sifBadge = c.sifPotential === 'Y' || c.sifPotential === 'YES'
                    ? <span className="font-bold text-error">Y</span> 
                    : <span className="text-secondary">N</span>;

                  let statusPill = <span className="bg-[#f1f5f9] text-secondary text-[11px] px-2 py-0.5 rounded-full border border-outline-variant">{c.status}</span>;
                  if (c.status === 'ACTION IN PROGRESS') {
                    statusPill = <span className="bg-[#dbeafe] text-[#1e40af] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#bfdbfe]">ACTION IN PROGRESS</span>;
                  } else if (c.status === 'EVIDENCE SUBMITTED') {
                    statusPill = <span className="bg-[#fef3c7] text-[#92400e] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#fde68a]">EVIDENCE SUBMITTED</span>;
                  } else if (c.status === 'ASSIGNED') {
                    statusPill = <span className="bg-[#e0e7ff] text-[#3730a3] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#c7d2fe]">ASSIGNED</span>;
                  } else if (c.status === 'ALERTED') {
                    statusPill = <span className="bg-[#fef3c7] text-[#92400e] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#fde68a]">ALERTED</span>;
                  } else if (c.status === 'CLOSED') {
                    statusPill = <span className="bg-[#dcfce7] text-[#166534] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#bbf7d0]">CLOSED</span>;
                  }

                  return (
                    <tr 
                      key={c.id} 
                      className={`border-b border-outline-variant transition-colors cursor-pointer ${rowBg} h-12 text-xs`}
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setCurrentCase(c);
                      }}
                    >
                      <td className="p-3 font-mono-label font-bold text-primary">{c.id}</td>
                      <td className="p-3 text-secondary">{c.type}</td>
                      <td className="p-3 text-primary font-medium">{c.hazard}</td>
                      <td className="p-3 text-secondary">{c.location}</td>
                      <td className="p-3">{riskPill}</td>
                      <td className="p-3">{sifBadge}</td>
                      <td className="p-3 text-secondary">{c.assignedTo}</td>
                      <td className="p-3">{statusPill}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-outline-variant flex justify-between items-center text-xs text-secondary bg-surface-container-low">
            <span>Showing 1 to {casesList.length} of 124 records</span>
            <div className="flex items-center gap-1 font-mono-label">
              <button className="px-2 py-0.5 border border-outline-variant rounded bg-white text-secondary">&lt;</button>
              <button className="px-2 py-0.5 rounded bg-primary text-white font-bold">1</button>
              <button className="px-2 py-0.5 border border-outline-variant rounded bg-white text-secondary">2</button>
              <button className="px-2 py-0.5 border border-outline-variant rounded bg-white text-secondary">3</button>
              <span>...</span>
              <button className="px-2 py-0.5 border border-outline-variant rounded bg-white text-secondary">&gt;</button>
            </div>
          </div>
        </div>

        {/* Right: Detailed Case Dossier (40% -> 5-col) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant flex flex-col p-5 gap-4">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <div>
              <h2 className="font-bold text-primary text-lg leading-tight">{currentCase.id}</h2>
              <span className="text-xs text-[#dc2626] font-bold">🔴 CRITICAL · REVIEW PRIORITY {currentCase.risk}</span>
            </div>
            <span className="text-xs text-secondary font-mono-label">{currentCase.status}</span>
          </div>

          {/* Assignment Detail & Demo Notice */}
          <div className="flex justify-between items-start bg-surface-container-low p-2.5 rounded border border-outline-variant">
            <div className="flex flex-col">
              <span className="font-label-md text-[10px] text-secondary uppercase font-bold">ASSIGNED TO</span>
              <span className="text-xs font-bold text-primary">{currentCase.assignedTo || "HSE Engineer A"}</span>
              <span className="text-[10px] text-secondary font-medium">ROLE: {currentCase.assignedRole || "HSE Engineer"}</span>
            </div>
            <span className="text-[10px] text-secondary bg-surface-container px-2 py-0.5 rounded border border-outline-variant italic">
              Demo Scenario — Hypothetical Assignment
            </span>
          </div>

          {/* Risk Origin & Related Reports */}
          <div className="flex flex-col gap-1">
            <span className="font-label-md text-[10px] text-secondary uppercase font-bold">RISK ORIGIN</span>
            <p className="text-xs text-primary font-medium">{currentCase.riskOrigin || "Recurring Pattern Escalation"}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-md text-[10px] text-secondary uppercase font-bold">RELATED REPORTS</span>
            <div className="flex flex-wrap gap-1.5">
              {(currentCase.relatedReports || ["R001", "R017", "R043", "R081", "R104"]).map((r) => (
                <span key={r} className="bg-surface-container text-primary font-mono-label text-xs px-2 py-1 rounded border border-outline-variant font-semibold">{r}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-md text-[10px] text-secondary uppercase font-bold">REVIEW-PRIORITY TRAJECTORY</span>
            <p className="text-xs font-mono-label font-bold text-primary">{currentCase.riskTrajectory || "22 → 39 → 57 → 76 → 91"}</p>
            <span className="text-[10px] text-secondary italic">Illustrative review-priority scores; not calibrated probabilities of injury or fatality.</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-md text-[10px] text-secondary uppercase font-bold">WHY ESCALATED</span>
            <p className="text-xs text-primary font-medium">Potential-SIF review priority increased due to recurring related observations.</p>
            <ul className="list-none space-y-0.5 mt-1 text-secondary">
              {(currentCase.whyEscalated || [
                "Repeated energy isolation observations",
                "Same process area",
                "Same equipment",
                "Increasing review-priority trajectory",
                "Related Life-Saving Rule concern"
              ]).map((item, idx) => (
                <li key={idx} className="text-xs text-primary leading-tight">• {item}</li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => onNavigate('risk-evolution')}
            className="w-full border border-outline-variant py-2 rounded text-xs font-bold uppercase hover:bg-surface-container transition-colors flex items-center justify-center gap-1 text-primary"
          >
            <span className="material-symbols-outlined text-sm">trending_up</span> VIEW RISK EVOLUTION
          </button>

          {/* Corrective Action Box */}
          {currentCase.correctiveAction && (
            <div className="border border-[#fed7aa] bg-[#fff7ed] p-3 flex flex-col gap-2 rounded">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#c2410c]">
                <span className="material-symbols-outlined text-sm">warning</span> CORRECTIVE ACTION
              </div>
              <p className="text-xs text-[#9a3412] leading-tight">
                {currentCase.correctiveAction.text}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-[#fed7aa]">
                <div>
                  <span className="text-secondary">ASSIGNED TO:</span> 
                  <strong className="text-primary block">{currentCase.correctiveAction.assignedTo}</strong>
                  <span className="text-secondary text-[9px] block">ROLE: {currentCase.correctiveAction.assignedRole || "HSE Engineer"}</span>
                </div>
                <div><span className="text-secondary">PRIORITY:</span> <strong className="text-error block">{currentCase.correctiveAction.priority}</strong></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-secondary font-mono-label">
                <div>⏰ DUE: <strong className="text-primary">{currentCase.correctiveAction.due}</strong></div>
                <span className="text-[9px] text-[#9a3412] italic font-sans">Demo Scenario — Hypothetical Assignment</span>
              </div>
            </div>
          )}

          {/* Case Lifecycle Stepper (7-step) */}
          <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant">
            <span className="font-label-md text-[10px] text-secondary uppercase font-bold">CASE LIFECYCLE</span>
            <div className="flex flex-col gap-1.5 pl-1">
              {(currentCase.lifecycle || [
                { name: "DETECTED", completed: true, active: false },
                { name: "ALERTED", completed: true, active: false },
                { name: "ASSIGNED", completed: true, active: false },
                { name: "ACTION IN PROGRESS", completed: false, active: true },
                { name: "EVIDENCE SUBMITTED", completed: false, active: false },
                { name: "VERIFIED", completed: false, active: false },
                { name: "CLOSED", completed: false, active: false }
              ]).map((step, idx) => {
                let icon = <span className="w-4 h-4 rounded-full border border-outline flex items-center justify-center text-[10px]"></span>;
                let textStyle = "text-secondary";

                if (step.completed) {
                  icon = <span className="w-4 h-4 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[10px] font-bold">✓</span>;
                  textStyle = "text-primary font-medium";
                } else if (step.active) {
                  icon = <span className="w-4 h-4 rounded-full border-2 border-[#2563eb] flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-[#2563eb]"></span></span>;
                  textStyle = "text-[#1e40af] font-bold";
                }

                return (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {icon}
                    <span className={textStyle}>{step.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evidence & Verification Status */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-outline-variant">
            <div>
              <span className="text-secondary">EVIDENCE</span> 
              <span className="text-primary font-medium block truncate" title={currentCase.evidence}>
                {currentCase.evidence || "Pending"}
              </span>
            </div>
            <div>
              <span className="text-secondary">VERIFICATION</span> 
              <span className="text-primary font-medium block truncate" title={currentCase.verification}>
                {currentCase.verification || "Pending Evidence"}
              </span>
            </div>
          </div>

          {/* Action Buttons connected to API */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleUpdateAction}
              disabled={actionInProgress || isClosed}
              className="w-full border border-outline-variant py-2 rounded font-label-md text-xs font-bold uppercase hover:bg-surface-container text-primary transition-colors disabled:opacity-50"
            >
              UPDATE ACTION
            </button>

            <button 
              onClick={handleSubmitEvidence}
              disabled={actionInProgress || isClosed || isEvidenceSubmitted}
              className={`w-full py-2 rounded font-label-md text-xs font-bold uppercase transition-colors ${
                isEvidenceSubmitted 
                  ? 'bg-slate-100 text-slate-500 border border-slate-300 cursor-default'
                  : 'bg-primary text-on-primary hover:bg-on-background'
              }`}
            >
              {isEvidenceSubmitted ? '✓ EVIDENCE SUBMITTED' : 'SUBMIT EVIDENCE'}
            </button>

            <button 
              onClick={handleVerifyCase}
              disabled={actionInProgress || isClosed || !isEvidenceSubmitted}
              className={`w-full py-2 rounded font-label-md text-xs font-bold uppercase transition-colors ${
                isClosed
                  ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] cursor-default'
                  : isEvidenceSubmitted
                    ? 'bg-[#10b981] text-white hover:bg-[#059669] cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              {isClosed ? '✓ CASE VERIFIED & CLOSED' : 'VERIFY CORRECTIVE ACTION'}
            </button>
          </div>

          {/* Audit Trail from Backend */}
          <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant">
            <span className="font-label-md text-[10px] text-secondary uppercase font-bold">AUDIT TRAIL</span>
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {(currentCase.auditTrail || []).map((entry, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <span className="font-mono-label text-secondary whitespace-nowrap">{entry.time}</span>
                  <span className="text-primary">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
