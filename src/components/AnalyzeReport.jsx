import React, { useState } from 'react';
import { apiClient } from '../services/api';

export default function AnalyzeReport({ onNotification }) {
  const [formData, setFormData] = useState({
    report_type: 'Near Miss',
    location: 'Process Area A',
    equipment: 'Pump P-101',
    hazard: 'Energy Isolation',
    life_saving_rule: 'Energy Isolation',
    description: 'During maintenance activity, the equipment was isolated but the isolation point was not verified before work started. A worker noticed the issue and halted work. Similar observations have been reported in this area.'
  });

  const [analysisResult, setAnalysisResult] = useState({
    potential_sif: 'YES',
    potentialSif: 'YES',
    risk_score: 91,
    riskScore: 91,
    risk_level: 'HIGH',
    riskLevel: 'HIGH',
    identified_hazards: ['Energy Isolation', 'Electrical Energy'],
    identifiedHazard: 'Energy Isolation',
    identified_life_saving_rules: ['Energy Isolation'],
    lifeSavingRulesIdentified: ['Energy Isolation'],
    reasons: 'Analysis detected a failure in verification protocols for energy isolation, indicating a potential SIF precursor.',
    whyFlagged: 'Analysis detected a failure in verification protocols for energy isolation, indicating a potential SIF precursor.',
    pattern_status: 'ESCALATED',
    patternStatus: 'ESCALATED',
    pattern_message: 'Potential SIF risk increased due to recurring related observations and an increasing review-priority trajectory.',
    patternMessage: 'Potential SIF risk increased due to recurring related observations and an increasing review-priority trajectory.',
    escalation_triggered: true,
    escalationTriggered: true,
    pattern_tags: ['Same location', 'Same hazard', 'Repeated related observations', 'Increasing review-priority trajectory'],
    patternTags: ['Same location', 'Same hazard', 'Repeated related observations', 'Increasing review-priority trajectory'],
    related_reports: ['R001', 'R017', 'R043', 'R081', 'R104'],
    relatedReports: ['R001', 'R017', 'R043', 'R081', 'R104']
  });

  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorState(null);
    try {
      const payload = {
        report_type: formData.report_type,
        reportType: formData.report_type,
        location: formData.location,
        equipment: formData.equipment,
        hazard: formData.hazard,
        life_saving_rule: formData.life_saving_rule,
        lifeSavingRule: formData.life_saving_rule,
        description: formData.description
      };
      const res = await apiClient.analyzeReport(payload);
      if (res) {
        setAnalysisResult(res);
        if (onNotification) {
          onNotification(`FastAPI Response: Review Priority ${res.riskScore || res.risk_score}/100 • SIF: ${res.potentialSif || res.potential_sif}`);
        }
      }
    } catch (err) {
      console.error('API analyze error:', err);
      setErrorState('API connection error. Please verify FastAPI backend.');
      if (onNotification) onNotification('API connection error.');
    } finally {
      setLoading(false);
    }
  };

  const potentialSifVal = analysisResult.potential_sif || analysisResult.potentialSif;
  const riskScoreVal = analysisResult.risk_score || analysisResult.riskScore;
  const riskLevelVal = analysisResult.risk_level || analysisResult.riskLevel;
  const lifeSavingRulesList = analysisResult.identified_life_saving_rules || analysisResult.lifeSavingRulesIdentified || ['Energy Isolation'];
  const whyFlaggedVal = analysisResult.reasons || analysisResult.whyFlagged;
  const patternStatusVal = analysisResult.pattern_status || analysisResult.patternStatus;
  const patternMsgVal = analysisResult.pattern_message || analysisResult.patternMessage;
  const isEscalated = analysisResult.escalation_triggered ?? analysisResult.escalationTriggered ?? true;
  const patternTagsList = analysisResult.pattern_tags || analysisResult.patternTags || [];
  const relatedReportsList = analysisResult.related_reports || analysisResult.relatedReports || [];

  return (
    <div className="flex-grow flex flex-col p-container-padding gap-5 max-w-[1920px] mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col gap-0.5">
        <h1 className="font-display-lg text-[28px] text-primary font-bold tracking-tight">Analyze Safety Report</h1>
        <p className="font-body-md text-sm text-secondary">Screen a safety observation or near-miss for potential SIF precursors and recurring patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap items-start">
        {/* Left (7-col): Safety Report Input Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4">
          <h2 className="font-bold text-primary text-base border-b border-outline-variant pb-3">Safety Report Input</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-[11px] text-secondary uppercase font-bold mb-1">REPORT TYPE</label>
                <select 
                  value={formData.report_type} 
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant text-primary text-xs rounded p-2 focus:ring-1 focus:ring-primary"
                >
                  <option value="Near Miss">Near Miss</option>
                  <option value="Unsafe Condition">Unsafe Condition</option>
                  <option value="Unsafe Act">Unsafe Act</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-[11px] text-secondary uppercase font-bold mb-1">LOCATION</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant text-primary text-xs rounded p-2 focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-[11px] text-secondary uppercase font-bold mb-1">EQUIPMENT</label>
                <input 
                  type="text" 
                  value={formData.equipment} 
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant text-primary text-xs rounded p-2 focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-label-md text-[11px] text-secondary uppercase font-bold mb-1">HAZARD</label>
                <select 
                  value={formData.hazard} 
                  onChange={(e) => setFormData({ ...formData, hazard: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant text-primary text-xs rounded p-2 focus:ring-1 focus:ring-primary"
                >
                  <option value="Energy Isolation">Energy Isolation</option>
                  <option value="Electrical Energy">Electrical Energy</option>
                  <option value="Confined Space">Confined Space</option>
                  <option value="Working at Height">Working at Height</option>
                  <option value="Heavy Lifting">Heavy Lifting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-label-md text-[11px] text-secondary uppercase font-bold mb-1">LIFE-SAVING RULE</label>
              <select 
                value={formData.life_saving_rule} 
                onChange={(e) => setFormData({ ...formData, life_saving_rule: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant text-primary text-xs rounded p-2 focus:ring-1 focus:ring-primary"
              >
                <option value="Energy Isolation">Energy Isolation</option>
                <option value="Confined Space Entry">Confined Space Entry</option>
                <option value="Working at Height">Working at Height</option>
              </select>
            </div>

            <div>
              <label className="block font-label-md text-[11px] text-secondary uppercase font-bold mb-1">REPORT DESCRIPTION</label>
              <textarea 
                rows={5} 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant text-primary text-xs rounded p-3 focus:ring-1 focus:ring-primary leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              {errorState ? (
                <span className="text-[11px] text-error font-medium">{errorState}</span>
              ) : <span></span>}
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary text-on-primary px-6 py-2.5 rounded font-label-md text-xs font-bold uppercase tracking-wider hover:bg-on-background transition-colors flex items-center gap-2"
              >
                {loading && <span className="material-symbols-outlined text-xs animate-spin">refresh</span>}
                ANALYZE REPORT
              </button>
            </div>
          </form>
        </div>

        {/* Right (5-col): Intelligence Analysis Results (Image 2) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-outline-variant pb-3">
            <h2 className="font-bold text-primary text-base">Intelligence Analysis Results</h2>
            <div className="flex items-center gap-2">
              {loading && <span className="text-[11px] font-mono-label text-secondary animate-pulse">Analyzing...</span>}
              <span className="material-symbols-outlined text-secondary text-base">analytics</span>
            </div>
          </div>

          {/* Section 1: Individual SIF Analysis */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <span className="w-4 h-4 rounded-full bg-surface-container border border-outline-variant text-primary flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="font-semibold text-primary">Individual SIF Analysis</span>
            </div>

            {/* 3 Metric Boxes */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-outline-variant p-3 text-center flex flex-col justify-center items-center bg-surface-container-lowest">
                <span className="font-label-md text-[10px] text-secondary uppercase block mb-1">POTENTIAL SIF</span>
                <span className={`border text-xs px-2 py-0.5 rounded font-bold ${
                  potentialSifVal === 'YES'
                    ? 'border-[#fca5a5] text-[#dc2626] bg-[#fef2f2]'
                    : 'border-slate-300 text-secondary bg-slate-100'
                }`}>
                  {potentialSifVal === 'YES' ? '⚠ YES' : 'NO'}
                </span>
              </div>
              <div className="border border-outline-variant p-3 text-center flex flex-col justify-center items-center bg-surface-container-lowest" title="Explainable review-priority score generated by the prototype; not a calibrated probability of injury or fatality.">
                <span className="font-label-md text-[10px] text-secondary uppercase block mb-1">REVIEW PRIORITY</span>
                <div className="font-mono-label text-base font-bold text-error">
                  <span className="text-xl">{riskScoreVal}</span><span className="text-xs text-secondary">/100</span>
                </div>
                <div className="w-12 h-0.5 bg-error mt-0.5"></div>
              </div>
              <div className="border border-outline-variant p-3 text-center flex flex-col justify-center items-center bg-surface-container-lowest">
                <span className="font-label-md text-[10px] text-secondary uppercase block mb-1">RISK LEVEL</span>
                <span className="font-bold text-xs text-error">{riskLevelVal}</span>
              </div>
            </div>

            {/* Life-Saving Rules & Identified Hazard */}
            <div className="border border-outline-variant p-3 bg-surface-container-low flex flex-col gap-1.5">
              <span className="font-label-md text-[10px] text-secondary uppercase block">LIFE-SAVING RULES IDENTIFIED</span>
              <div className="flex flex-col gap-1">
                {lifeSavingRulesList.map((rule, idx) => (
                  <p key={idx} className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-error inline-block"></span> {rule}
                  </p>
                ))}
              </div>
            </div>

            {/* Why Flagged */}
            <div className="border border-outline-variant p-3 bg-surface-container-low">
              <span className="font-label-md text-[10px] text-secondary uppercase block mb-1">WHY FLAGGED</span>
              <p className="text-xs text-secondary leading-relaxed">{whyFlaggedVal}</p>
            </div>

            {/* Explanatory Note / Disclaimer */}
            <p className="text-[10px] text-secondary/80 italic leading-tight pt-1">
              Review-priority scores are generated by the prototype&apos;s explainable scoring logic and are not calibrated probabilities of injury or fatality.
            </p>
          </div>

          {/* Section 2: Pattern Intelligence */}
          <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant">
            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <span className="w-4 h-4 rounded-full bg-surface-container border border-outline-variant text-primary flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="font-semibold text-primary">Pattern Intelligence</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Report cross-referenced with database history. Checks related reports for recurring hazards, locations, equipment and review-priority trends.
            </p>

            {/* Pattern Status Red Card */}
            <div className="border border-[#fca5a5] bg-[#fef2f2] p-4 flex flex-col gap-3 rounded">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-xs text-[#991b1b] font-bold uppercase">PATTERN STATUS</span>
                {isEscalated && (
                  <span className="bg-[#dc2626] text-white text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span> {patternStatusVal === 'ESCALATED' ? 'ESCALATION TRIGGERED' : patternStatusVal}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#991b1b] font-medium leading-relaxed">
                {patternMsgVal}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {patternTagsList.map((tag, idx) => (
                  <span key={idx} className="bg-surface-container-lowest border border-[#fca5a5] text-[#991b1b] text-[10px] px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Related Reports list */}
              {relatedReportsList && relatedReportsList.length > 0 && (
                <div className="pt-2 border-t border-[#fca5a5] flex items-center gap-2 text-[10px] text-[#991b1b]">
                  <span className="font-bold">RELATED REPORTS:</span>
                  <div className="flex gap-1 font-mono-label font-bold">
                    {relatedReportsList.map((r) => (
                      <span key={r} className="bg-white px-1.5 py-0.5 rounded border border-[#fca5a5]">{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
