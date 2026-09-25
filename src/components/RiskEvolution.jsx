import React, { useState, useEffect } from 'react';
import { SIF_DATA } from '../data/sifData';
import { apiClient } from '../services/api';

export default function RiskEvolution({ onNavigate, onNotification }) {
  const [data, setData] = useState(SIF_DATA.riskEvolution);
  const [selectedReportId, setSelectedReportId] = useState('R104');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiClient.getRiskEvolution('PAT-001').then((res) => {
      if (res && isMounted) {
        setData(res);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const riskEvolution = data || SIF_DATA.riskEvolution || {};
  const trajectoryPoints = (riskEvolution.trajectoryPoints && riskEvolution.trajectoryPoints.length > 0)
    ? riskEvolution.trajectoryPoints
    : [
        { id: "R001", risk: 22, band: "NON-SIF", classification: "Non-SIF", status: "MONITORING", title: "Initial unsafe condition identified" },
        { id: "R017", risk: 39, band: "NON-SIF", classification: "Non-SIF", status: "RELATED", title: "Related observation reported" },
        { id: "R043", risk: 57, band: "NON-SIF", classification: "Rising Review Priority", status: "RISING", title: "Review priority escalating due to proximity" },
        { id: "R081", risk: 76, band: "RISING REVIEW PRIORITY", classification: "High Priority", status: "PATTERN DETECTED", title: "Recurring hazard pattern confirmed" },
        { id: "R104", risk: 91, band: "POTENTIAL SIF", classification: "Potential SIF", status: "ESCALATED", title: "Review-priority threshold reached — Potential SIF designated" }
      ];

  const currentReport = trajectoryPoints.find((p) => p.id === selectedReportId) 
    || trajectoryPoints[trajectoryPoints.length - 1] 
    || { id: "R104", risk: 91, status: "ESCALATED", classification: "Potential SIF", band: "POTENTIAL SIF" };

  // SVG coordinates calculation for trajectory line chart
  const svgCoords = trajectoryPoints.map((pt, idx) => {
    const x = 40 + idx * 100;
    // Map risk 0..100 to y 140..15 (inverted)
    const y = 140 - ((pt.risk || 0) * 1.25);
    return { ...pt, x, y };
  });
  const pathD = svgCoords.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const handleSelectReport = (id) => {
    setSelectedReportId(id);
    const selected = trajectoryPoints.find((p) => p.id === id);
    if (onNotification && selected) {
      onNotification(`Selected Report ${id}: Review Priority ${selected.risk}/100 • ${selected.classification || selected.status}`);
    }
  };

  const handleRecalculate = () => {
    if (onNotification) onNotification('Continuous monitoring engine reassessed 5 related observations in Process Area A.');
  };

  const handleUpdatePattern = () => {
    if (onNotification) onNotification('Pattern PAT-001 updated with latest energy isolation trajectory.');
  };

  const handleReassessSif = () => {
    if (onNotification) onNotification('SIF Review Priority Reassessed: Potential-SIF designation active due to recurring pattern.');
  };

  const curRisk = currentReport.risk ?? 91;

  return (
    <div className="flex-grow flex flex-col p-container-padding gap-5 max-w-[1920px] mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col gap-0.5">
        <h1 className="font-display-lg text-[28px] text-primary font-bold tracking-tight uppercase">RISK EVOLUTION</h1>
        <p className="font-body-md text-sm text-secondary">Track how review priority evolves as new related safety observations are reported.</p>
      </header>

      {/* Context Banner Card */}
      <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-primary text-lg">{riskEvolution.hazard || "ENERGY ISOLATION"}</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              curRisk >= 70 ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-surface-container text-primary'
            }`}>
              {curRisk >= 70 ? '🔴 CRITICAL' : 'MONITORING'}
            </span>
            <span className="bg-[#f1f5f9] text-secondary text-[10px] font-bold px-2 py-0.5 rounded border border-outline-variant">
              {currentReport.status || "ESCALATED"}
            </span>
          </div>
          <span className="text-xs text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_on</span> {riskEvolution.location || "Process Area A • Pump P-101"}
          </span>
        </div>

        <div className="text-right">
          <span className="font-label-md text-[10px] text-secondary uppercase block font-bold">CURRENT REVIEW PRIORITY ({selectedReportId})</span>
          <div className="font-mono-label text-error font-bold leading-none mt-1">
            <span className="text-3xl">{curRisk}</span>
            <span className="text-xs text-secondary">/100</span>
          </div>
          <div className="w-16 h-0.5 bg-error mt-1 ml-auto"></div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] p-3.5 flex items-start gap-3">
        <span className="material-symbols-outlined text-sm text-[#1e40af]">lightbulb</span>
        <div className="text-xs text-[#1e3a8a] leading-relaxed">
          <strong className="font-label-md uppercase font-bold text-[#1e40af] block mb-0.5">CONTINUOUS MONITORING LOGIC</strong>
          {riskEvolution.logicBanner || "Non-SIF reports remain in the intelligence pipeline. Recurring related observations + increasing review-priority trajectory = emerging Potential-SIF concern."}
        </div>
      </div>

      {/* Continuous Review-Priority Reassessment Trajectory Chart */}
      <section className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-label-md text-xs text-primary uppercase font-bold">CONTINUOUS REVIEW-PRIORITY REASSESSMENT</h3>
          <span className="text-xs text-secondary font-mono-label">Active Point: <strong className="text-primary">{selectedReportId} ({curRisk}/100)</strong></span>
        </div>

        <div className="relative h-64 w-full border border-slate-200 bg-white overflow-hidden p-6 flex flex-col justify-between">
          {/* Colored Risk / Review-Priority Bands */}
          <div className="absolute top-0 left-0 right-0 h-[28%] bg-[#fef2f2] opacity-70 border-b border-[#fecaca] flex items-start p-2 pointer-events-none">
            <span className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-wider">POTENTIAL SIF (70–100)</span>
          </div>
          <div className="absolute top-[28%] left-0 right-0 h-[28%] bg-[#f8faff] opacity-60 border-b border-slate-200 flex items-start p-2 pointer-events-none">
            <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider">RISING REVIEW PRIORITY (45–70)</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[44%] bg-white flex items-start p-2 pointer-events-none">
            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">NON-SIF (0–45)</span>
          </div>

          {/* SVG Line Curve */}
          <svg className="absolute inset-0 w-full h-full p-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
            <line x1="0" y1="0" x2="500" y2="0" stroke="#cbd5e1" strokeDasharray="2 2"/>
            <line x1="0" y1="37" x2="500" y2="37" stroke="#cbd5e1" strokeDasharray="2 2"/>
            <line x1="0" y1="75" x2="500" y2="75" stroke="#cbd5e1" strokeDasharray="2 2"/>
            <line x1="0" y1="112" x2="500" y2="112" stroke="#cbd5e1" strokeDasharray="2 2"/>
            <line x1="0" y1="150" x2="500" y2="150" stroke="#cbd5e1"/>

            <path d={pathD} fill="none" stroke="#000000" strokeWidth="3" className="trajectory-line"/>
            {/* Highlight line between the last two points in red if rising into potential SIF */}
            {svgCoords.length >= 2 && (
              <path 
                d={`M ${svgCoords[svgCoords.length - 2].x},${svgCoords[svgCoords.length - 2].y} L ${svgCoords[svgCoords.length - 1].x},${svgCoords[svgCoords.length - 1].y}`} 
                fill="none" 
                stroke="#dc2626" 
                strokeWidth="3"
              />
            )}

            {svgCoords.map((pt) => {
              const isSelected = pt.id === selectedReportId;
              const isCritical = (pt.risk || 0) >= 90;
              const circleFill = isSelected ? '#dc2626' : (isCritical ? '#dc2626' : '#000000');
              const radius = isSelected ? 6 : (isCritical ? 5 : 4);

              return (
                <g key={pt.id} className="cursor-pointer" onClick={() => handleSelectReport(pt.id)}>
                  <circle cx={pt.x} cy={pt.y} r={radius} fill={circleFill} stroke={isSelected ? '#ffffff' : 'none'} strokeWidth="2"/>
                  <text 
                    x={pt.x - 6} 
                    y={pt.y - 8} 
                    fontFamily="Inter" 
                    fontSize="10" 
                    fontWeight="bold" 
                    fill={isCritical ? '#dc2626' : '#000000'}
                  >
                    {pt.risk}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Y Axis Scale */}
          <div className="absolute left-2 inset-y-6 flex flex-col justify-between text-[9px] font-mono-label text-secondary pointer-events-none">
            <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
          </div>

          {/* X Axis Labels */}
          <div className="mt-auto w-full flex justify-between text-[11px] font-mono-label text-secondary z-10 px-8">
            {svgCoords.map((pt) => {
              const isSelected = pt.id === selectedReportId;
              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelectReport(pt.id)}
                  className={`cursor-pointer transition-colors px-1 py-0.5 rounded font-mono-label ${
                    isSelected ? 'bg-primary text-white font-bold' : 'hover:text-primary font-semibold text-secondary'
                  }`}
                >
                  {pt.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Score Clarification Note */}
        <p className="text-[11px] text-secondary italic">
          Illustrative review-priority scores generated by the prototype's explainable scoring logic; not calibrated probabilities of injury or fatality.
        </p>

        {/* 4 Methodology Continuous Reassessment Buttons */}
        <div className="flex items-center justify-between text-[11px] font-bold text-center gap-2 overflow-x-auto pt-2">
          <button 
            onClick={() => onNavigate('analyze-report')} 
            className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded text-primary hover:bg-surface-container-high flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-xs">description</span> NEW SAFETY INFORMATION
          </button>
          <span className="text-secondary">→</span>
          <button 
            onClick={handleRecalculate} 
            className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded text-primary hover:bg-surface-container-high flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-xs">analytics</span> RECALCULATE RISK
          </button>
          <span className="text-secondary">→</span>
          <button 
            onClick={handleUpdatePattern} 
            className="bg-surface-container border border-outline-variant px-3 py-1.5 rounded text-primary hover:bg-surface-container-high flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-xs">hub</span> UPDATE PATTERN
          </button>
          <span className="text-secondary">→</span>
          <button 
            onClick={handleReassessSif} 
            className="bg-primary text-white px-3 py-1.5 rounded hover:bg-on-background flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-xs">offline_bolt</span> REASSESS POTENTIAL SIF RISK
          </button>
        </div>
      </section>

      {/* 2-Column Split: Why Did Review Priority Increase & Escalation Triggered */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap">
        {/* Left (7-col): Why Did Review Priority Increase? Checklist */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col justify-between gap-4">
          <h3 className="font-label-md text-xs text-primary uppercase font-bold">WHY DID REVIEW PRIORITY INCREASE?</h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="text-primary font-bold">✓</span> Same location (Process Area A)
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="text-primary font-bold">✓</span> Same equipment (Pump P-101)
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="text-primary font-bold">✓</span> Same hazard
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span className="text-primary font-bold">✓</span> Repeated related observations
            </div>
            <div className="flex items-center gap-2 text-[#dc2626] font-semibold col-span-2">
              <span className="material-symbols-outlined text-sm text-[#dc2626]">trending_up</span> Increasing review-priority trajectory
            </div>
          </div>

          <div className="border-t border-outline-variant pt-3 flex items-center gap-2 text-xs text-[#dc2626] font-bold">
            <span className="material-symbols-outlined text-sm">warning</span> Energy Isolation concern — Critical Life-Saving Rule
          </div>
        </div>

        {/* Right (5-col): Red Escalation Triggered Card */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant flex flex-col overflow-hidden">
          <div className="bg-[#b91c1c] text-white p-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">warning</span> ESCALATION TRIGGERED
          </div>
          <div className="p-5 flex flex-col justify-between flex-grow gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#fef2f2] text-[#b91c1c] text-[10px] font-bold px-2 py-0.5 rounded border border-[#fca5a5]">
                  {currentReport.classification || "Potential SIF"}
                </span>
                <span className="text-xs text-[#b91c1c] font-bold font-mono-label">• REVIEW PRIORITY {curRisk}</span>
              </div>
              <h4 className="font-bold text-primary text-base">Repeated energy-isolation concern</h4>
              <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-xs">location_on</span> Process Area A • Pump P-101
              </p>
            </div>

            <div className="bg-[#fef2f2] border border-[#fca5a5] p-2.5 rounded text-xs text-[#991b1b] font-medium leading-tight">
              {riskEvolution.escalationMessage || "Potential-SIF review priority increased due to recurring related observations."}
            </div>

            <button 
              onClick={() => onNavigate('cases')} 
              className="w-full bg-[#b91c1c] text-white py-2.5 rounded font-label-md text-xs font-bold uppercase hover:bg-[#991b1b] transition-colors flex items-center justify-center gap-1"
            >
              VIEW SIF CASE →
            </button>
          </div>
        </div>
      </section>

      {/* Bottom 2-Column Split: Risk Timeline & Related Reports */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap">
        {/* Left: Risk Timeline Stepper */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
          <h3 className="font-label-md text-xs text-primary uppercase font-bold">RISK TIMELINE</h3>

          <div className="flex flex-col gap-4 relative pl-2">
            {trajectoryPoints.map((item) => {
              const isSelected = item.id === selectedReportId;
              const isLatest = item.id === 'R104';

              let displayTitle = item.title;
              if (item.id === 'R104') {
                displayTitle = "Review-priority threshold reached — Potential SIF designated";
              }

              return (
                <div 
                  key={item.id} 
                  onClick={() => handleSelectReport(item.id)}
                  className={`timeline-item relative flex items-start gap-4 cursor-pointer p-1 rounded transition-colors ${
                    isSelected ? 'bg-surface-container-low' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="timeline-stem relative z-10">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected || isLatest
                        ? 'bg-error border-2 border-error' 
                        : 'border-2 border-slate-300 bg-white'
                    }`}></span>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono-label font-bold ${isLatest ? 'text-error' : 'text-primary'}`}>{item.id}</span>
                        <span className={`text-[11px] ${isLatest ? 'text-error font-bold font-mono-label' : 'text-secondary'}`}>Review Priority {item.risk}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isLatest
                          ? 'bg-[#fee2e2] text-error border border-[#fecaca]'
                          : (item.status === 'RISING' ? 'bg-[#f3e8ff] text-[#6b21a8] border border-[#e9d5ff]' : (item.status === 'PATTERN DETECTED' ? 'bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]' : 'bg-surface-container text-secondary'))
                      }`}>{item.status}</span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isLatest ? 'text-primary font-medium' : 'text-secondary'}`}>{displayTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Related Reports */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-3">
          <div>
            <h3 className="font-label-md text-xs text-primary uppercase font-bold">RELATED REPORTS</h3>
            <p className="text-[11px] text-secondary">All related to Energy Isolation • Process Area A</p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            {trajectoryPoints.filter(r => r.id !== 'R104').map((r) => {
              const isSelected = r.id === selectedReportId;
              return (
                <div 
                  key={r.id} 
                  onClick={() => handleSelectReport(r.id)}
                  className={`border p-3 flex justify-between items-center transition-colors cursor-pointer ${
                    isSelected ? 'border-primary bg-[#e0edff]' : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-sm text-secondary">description</span>
                    <strong className="font-mono-label text-primary">{r.id}</strong>
                    <span className="text-[11px] text-secondary truncate max-w-[120px]">{r.classification || r.status}</span>
                  </div>
                  <span className={`font-mono-label text-xs font-bold ${
                    (r.risk || 0) >= 70 ? 'text-error' : ((r.risk || 0) >= 50 ? 'text-[#7c3aed]' : 'text-[#2563eb]')
                  }`}>
                    Review Priority {r.risk}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
