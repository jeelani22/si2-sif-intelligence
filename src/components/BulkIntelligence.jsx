import React, { useState, useEffect } from 'react';
import { SIF_DATA } from '../data/sifData';
import { apiClient } from '../services/api';

export default function BulkIntelligence({ onNotification }) {
  const [reportsList, setReportsList] = useState(SIF_DATA.reports || []);
  const [metrics, setMetrics] = useState({
    totalAnalyzed: 1247,
    potentialSif: 86,
    nonSif: 1161,
    highRisk: 19,
    risingRisk: 5,
    escalated: 7
  });
  const [distribution, setDistribution] = useState({
    nonSif: 1161,
    potentialSif: 86,
    highRisk: 19,
    risingRisk: 5
  });
  const [trajectoryPoints, setTrajectoryPoints] = useState([
    { id: "R001", risk: 22 },
    { id: "R017", risk: 39 },
    { id: "R043", risk: 57 },
    { id: "R081", risk: 76 },
    { id: "R104", risk: 91 }
  ]);
  const [currentFileName, setCurrentFileName] = useState('OIL_Safety_Reports_Sep2026.xlsx');
  const [activeChip, setActiveChip] = useState('All');
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    apiClient.getReports().then((res) => {
      if (res && res.length > 0 && isMounted) {
        setReportsList(res);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const filterChips = ['All', 'Potential SIF', 'Non-SIF', 'High Risk', 'Pattern Detected', 'Escalated'];

  const rawList = reportsList || [];
  const filteredReports = rawList.filter((r) => {
    if (activeChip === 'All') return true;
    if (activeChip === 'Potential SIF') return r.sifPotential === 'Potential SIF' || r.risk >= 90;
    if (activeChip === 'Non-SIF') return r.sifPotential === 'Non-SIF' && r.risk < 70;
    if (activeChip === 'High Risk') return r.sifPotential === 'High Risk' || (r.risk >= 70 && r.risk < 90);
    if (activeChip === 'Pattern Detected') return r.patternStatus === 'PATTERN DETECTED';
    if (activeChip === 'Escalated') return r.patternStatus === 'ESCALATED' || r.caseStatus === 'ACTION REQUIRED';
    return true;
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setUploadError(null);
    try {
      const response = await apiClient.uploadBulkFile(file);
      if (response) {
        setCurrentFileName(response.fileName || file.name);
        if (response.metrics) setMetrics(response.metrics);
        if (response.distribution) setDistribution(response.distribution);
        if (response.trajectory && response.trajectory.length > 0) setTrajectoryPoints(response.trajectory);
        if (response.reports && response.reports.length > 0) setReportsList(response.reports);
      }
      if (onNotification) {
        onNotification(`Successfully analyzed "${file.name}": ${response.totalAnalyzed || 1247} reports parsed.`);
      }
    } catch (err) {
      setUploadError(err.message || 'Error parsing bulk file. Reverting to calibrated dataset.');
      if (onNotification) onNotification(`Upload warning: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Report ID', 'Report Type', 'Location', 'Equipment', 'Hazard', 'Review Priority', 'SIF Potential', 'Pattern Status', 'Life-Saving Rule', 'Case Status'],
      ...filteredReports.map((r) => [
        r.id, r.reportType, r.location, r.equipment, r.hazard, r.risk, r.sifPotential, r.patternStatus, r.lifeSavingRule, r.caseStatus
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `Prioritized_Safety_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trajectory SVG coords
  const trajSvgPoints = trajectoryPoints.map((pt, idx) => {
    const x = 30 + idx * 80;
    const y = 90 - (pt.risk * 0.75);
    return { ...pt, x, y };
  });
  const trajPath = trajSvgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <div className="flex-grow flex flex-col p-container-padding gap-5 max-w-[1920px] mx-auto w-full">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display-lg text-[28px] text-primary font-bold tracking-tight uppercase">BULK INTELLIGENCE</h1>
          <p className="font-body-md text-sm text-secondary">Upload multiple safety reports (CSV / Excel) to detect SIF precursors and emerging risk patterns.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="bg-surface-container-lowest text-primary border border-outline-variant px-3.5 py-2 rounded font-label-md text-xs font-bold uppercase hover:bg-surface-container transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span> EXPORT CSV
          </button>
          <label className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-xs font-bold uppercase hover:bg-on-background transition-colors flex items-center gap-1.5 cursor-pointer">
            <span className="material-symbols-outlined text-sm">upload</span> CHOOSE FILE
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        </div>
      </header>

      {/* 6 Metric KPI Cards (Image 3) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-element-gap">
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">TOTAL ANALYZED</span>
          <span className="font-display-lg text-2xl text-primary font-bold">{metrics.totalAnalyzed.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">POTENTIAL SIF</span>
          <span className="font-display-lg text-2xl text-error font-bold">{metrics.potentialSif.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">NON-SIF</span>
          <span className="font-display-lg text-2xl text-secondary font-bold">{metrics.nonSif.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">HIGH RISK</span>
          <span className="font-display-lg text-2xl text-[#ea580c] font-bold">{metrics.highRisk.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">RISING REVIEW PRIORITY</span>
          <span className="font-display-lg text-2xl text-[#dc2626] font-bold">{metrics.risingRisk.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase font-bold tracking-wider">ESCALATED</span>
          <span className="font-display-lg text-2xl text-error font-bold">{metrics.escalated.toLocaleString()}</span>
        </div>
      </section>

      {/* Dropzone & Processing Pipeline Flow */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap items-center">
        {/* Dropzone (7-col) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border-2 border-dashed border-outline-variant p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-surface-container-low transition-colors relative cursor-pointer">
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleFileUpload} 
          />
          <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
          <div className="flex flex-col gap-0.5">
            <span className="font-label-md text-sm text-primary font-bold">Drag and drop safety reports here, or click to browse</span>
            <span className="text-xs text-secondary">Supports CSV or Excel (.xlsx, .xls) files with incident/near-miss narrative descriptions</span>
          </div>
        </div>

        {/* 5 Pipeline Stages Stepper (5-col) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-4 flex flex-col gap-2">
          <span className="font-label-md text-xs text-secondary uppercase font-bold">INTELLIGENCE PIPELINE</span>
          <div className="flex items-center justify-between text-[11px] font-mono-label font-bold text-secondary">
            <span className="text-primary flex items-center gap-1"><strong className="text-primary">1</strong> Ingest</span>
            <span>➔</span>
            <span className="text-primary flex items-center gap-1"><strong className="text-primary">2</strong> Parse</span>
            <span>➔</span>
            <span className="text-primary flex items-center gap-1"><strong className="text-primary">3</strong> Review Priority</span>
            <span>➔</span>
            <span className="text-primary flex items-center gap-1"><strong className="text-primary">4</strong> Cluster</span>
            <span>➔</span>
            <span className="text-primary flex items-center gap-1"><strong className="text-primary">5</strong> Escalate</span>
          </div>
        </div>
      </section>

      {/* File Status Banner & Progress */}
      <section className="bg-surface-container-lowest border border-outline-variant p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-secondary">draft</span>
          <span className="text-primary font-bold font-mono-label">{currentFileName}</span>
          <span className="text-outline">|</span>
          <span className="text-secondary">{metrics.totalAnalyzed.toLocaleString()} records • 1.2 MB</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-mono-label">{metrics.totalAnalyzed.toLocaleString()} / {metrics.totalAnalyzed.toLocaleString()} analyzed</span>
            <div className="w-32 bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-full"></div>
            </div>
          </div>
          <span className="bg-[#dcfce7] text-[#166534] font-bold text-[10px] px-2 py-0.5 rounded border border-[#bbf7d0]">
            {analyzing ? 'ANALYZING...' : 'COMPLETED'}
          </span>
        </div>
      </section>

      {/* 2-Column Split: Report Distribution & Risk Trajectory Visuals (Image 3) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap">
        {/* Left: Report Distribution (7-col) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="font-label-md text-xs text-primary uppercase font-bold">REPORT DISTRIBUTION</h2>
            <span className="text-xs text-secondary font-mono-label">{metrics.totalAnalyzed.toLocaleString()} Total</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-full bg-[#f1f5f9] h-5 rounded overflow-hidden flex">
              <div style={{ width: `${(distribution.nonSif / metrics.totalAnalyzed) * 100}%` }} className="bg-[#94a3b8] h-full" title="Non-SIF"></div>
              <div style={{ width: `${(distribution.potentialSif / metrics.totalAnalyzed) * 100}%` }} className="bg-[#f59e0b] h-full" title="Potential SIF"></div>
              <div style={{ width: `${(distribution.highRisk / metrics.totalAnalyzed) * 100}%` }} className="bg-[#dc2626] h-full" title="High Risk"></div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-secondary pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#94a3b8]"></div>
                <span>Non-SIF ({distribution.nonSif.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#f59e0b]"></div>
                <span>Potential SIF ({distribution.potentialSif.toLocaleString()})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#dc2626]"></div>
                <span>High Risk ({distribution.highRisk.toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sample Review-Priority Trajectory (5-col) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-label-md text-xs text-primary uppercase font-bold">SAMPLE REVIEW-PRIORITY TRAJECTORY</h2>
            <span className="text-xs text-error font-mono-label font-bold">Process Area A</span>
          </div>

          <div className="relative h-24 w-full bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full p-2" viewBox="0 0 380 90">
              <line x1="0" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeDasharray="2 2" />
              <line x1="0" y1="50" x2="380" y2="50" stroke="#f1f5f9" strokeDasharray="2 2" />
              <line x1="0" y1="80" x2="380" y2="80" stroke="#f1f5f9" strokeDasharray="2 2" />
              <path d={trajPath} fill="none" stroke="#000000" strokeWidth="2.5" />
              {trajSvgPoints.map((p) => (
                <g key={p.id}>
                  <circle cx={p.x} cy={p.y} r="4" fill={p.risk >= 90 ? "#dc2626" : "#000000"} />
                  <text x={p.x - 8} y={p.y - 6} fontSize="9" fontWeight="bold" fill={p.risk >= 90 ? "#dc2626" : "#000000"} fontFamily="Inter">
                    {p.risk}
                  </text>
                  <text x={p.x - 10} y="88" fontSize="8" fill="#64748b" fontFamily="Inter">
                    {p.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="text-[11px] text-secondary font-mono-label flex justify-between">
            <span>R001 (22)</span>
            <span>➔</span>
            <span>R017 (39)</span>
            <span>➔</span>
            <span>R043 (57)</span>
            <span>➔</span>
            <span>R081 (76)</span>
            <span>➔</span>
            <strong className="text-error">R104 (91)</strong>
          </div>

          <p className="text-[10px] text-secondary/80 italic leading-tight pt-0.5">
            Illustrative review-priority scores; not calibrated probabilities of injury or fatality.
          </p>
        </div>
      </section>

      {/* Prioritized Safety Reports (10-Column Table with Filter Chips) (Image 3) */}
      <section className="bg-surface-container-lowest border border-outline-variant flex flex-col overflow-hidden">
        {/* Table Header with Filter Chips */}
        <div className="p-4 border-b border-outline-variant flex flex-wrap justify-between items-center gap-3">
          <h2 className="font-label-md text-xs text-primary uppercase font-bold">PRIORITIZED SAFETY REPORTS</h2>
          <div className="flex flex-wrap items-center gap-1.5">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`text-xs px-2.5 py-1 rounded transition-colors font-medium ${
                  activeChip === chip
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container hover:text-primary border border-outline-variant'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* 10-Column Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant font-label-md text-xs text-secondary">
                <th className="p-3">REPORT ID</th>
                <th className="p-3">REPORT TYPE</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">EQUIPMENT</th>
                <th className="p-3">HAZARD</th>
                <th className="p-3">REVIEW PRIORITY</th>
                <th className="p-3">SIF POTENTIAL</th>
                <th className="p-3">PATTERN STATUS</th>
                <th className="p-3">LIFE-SAVING RULE</th>
                <th className="p-3">CASE STATUS</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-xs">
              {filteredReports.map((r) => {
                const isLatest = r.isLatest;
                const rowClass = isLatest ? 'bg-[#e0edff] border-l-4 border-l-primary font-semibold' : 'hover:bg-surface-container-low';

                let riskBadge = <span className="font-mono-label text-xs bg-surface-container text-secondary px-1.5 py-0.5 rounded">{r.risk}</span>;
                if (r.risk >= 90) {
                  riskBadge = <span className="font-mono-label text-xs bg-[#fee2e2] text-[#991b1b] font-bold px-1.5 py-0.5 rounded border border-[#fecaca]">{r.risk}</span>;
                } else if (r.risk >= 70) {
                  riskBadge = <span className="font-mono-label text-xs bg-[#fef3c7] text-[#92400e] font-semibold px-1.5 py-0.5 rounded border border-[#fde68a]">{r.risk}</span>;
                }

                let sifBadge = <span className="text-secondary">Non-SIF</span>;
                if (r.sifPotential === 'Potential SIF' || r.risk >= 90) {
                  sifBadge = <span className="font-bold text-error">Potential SIF</span>;
                } else if (r.sifPotential === 'High Risk' || r.risk >= 70) {
                  sifBadge = <span className="font-semibold text-[#ea580c]">High Risk</span>;
                }

                let patternBadge = <span className="bg-surface-container text-secondary text-[10px] px-1.5 py-0.5 rounded">{r.patternStatus}</span>;
                if (r.patternStatus === 'ESCALATED') {
                  patternBadge = <span className="bg-[#fee2e2] text-[#dc2626] font-bold text-[10px] px-2 py-0.5 rounded border border-[#fecaca]">ESCALATED</span>;
                } else if (r.patternStatus === 'PATTERN DETECTED') {
                  patternBadge = <span className="bg-[#dbeafe] text-[#1e40af] font-bold text-[10px] px-2 py-0.5 rounded border border-[#bfdbfe]">PATTERN DETECTED</span>;
                } else if (r.patternStatus === 'RISING') {
                  patternBadge = <span className="bg-[#f3e8ff] text-[#6b21a8] font-bold text-[10px] px-2 py-0.5 rounded border border-[#e9d5ff]">RISING</span>;
                }

                return (
                  <tr key={r.id} className={`border-b border-outline-variant transition-colors ${rowClass} h-11 text-xs`}>
                    <td className="p-3 font-mono-label font-bold text-primary">{r.id}</td>
                    <td className="p-3 text-secondary">{r.reportType}</td>
                    <td className="p-3 text-secondary">{r.location}</td>
                    <td className="p-3 text-secondary">{r.equipment}</td>
                    <td className="p-3 text-primary font-medium">{r.hazard}</td>
                    <td className="p-3">{riskBadge}</td>
                    <td className="p-3">{sifBadge}</td>
                    <td className="p-3">{patternBadge}</td>
                    <td className="p-3 text-secondary">{r.lifeSavingRule || '—'}</td>
                    <td className="p-3">
                      {r.caseStatus === 'ACTION REQUIRED' ? (
                        <span className="text-error font-bold text-[11px]">ACTION REQUIRED</span>
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-outline-variant flex justify-between items-center text-xs text-secondary bg-surface-container-low">
          <span>Showing {filteredReports.length} prioritized reports from the recurring-pattern demonstration</span>
          <span className="font-mono-label">Demo Dataset — OIL-style Safety Reports ({currentFileName})</span>
        </div>
      </section>
    </div>
  );
}
