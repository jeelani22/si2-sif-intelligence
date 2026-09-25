import React, { useState, useEffect } from 'react';
import { SIF_DATA } from '../data/sifData';
import { apiClient } from '../services/api';

export default function CommandCenter({ onSelectCase, onNavigate }) {
  const [data, setData] = useState({
    metrics: SIF_DATA.metrics || {
      totalReports: "1,247",
      potentialSif: "86",
      nonSif: "1,161",
      highRisk: "19",
      escalated: "7"
    },
    alerts: SIF_DATA.alerts || [],
    recentCases: SIF_DATA.cases || SIF_DATA.recentCases || []
  });

  useEffect(() => {
    let isMounted = true;
    apiClient.getDashboard().then((res) => {
      if (res && isMounted) {
        setData({
          metrics: res.metrics || SIF_DATA.metrics,
          alerts: res.alerts || SIF_DATA.alerts || [],
          recentCases: (res.recentCases && res.recentCases.length > 0) ? res.recentCases : (SIF_DATA.cases || [])
        });
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const metrics = data.metrics || SIF_DATA.metrics;
  const alerts = data.alerts || SIF_DATA.alerts || [];
  const recentCases = data.recentCases || SIF_DATA.cases || [];

  return (
    <div className="flex-grow flex flex-col p-container-padding gap-5 max-w-[1920px] mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col gap-0.5">
        <h1 className="font-display-lg text-[28px] text-primary font-bold tracking-tight">DRISHTI-SIF Safety Command Center</h1>
        <p className="font-body-md text-sm text-secondary">Potential-SIF screening, recurring-pattern detection and continuous risk review</p>
      </header>

      {/* 5 KPI Cards (Exact match to Image 1) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-element-gap">
        {/* Total Reports */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase tracking-wider">TOTAL REPORTS</span>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-2xl text-primary leading-none font-bold">{metrics.totalReports?.toLocaleString() || "1,247"}</span>
            <div className="w-2 h-2 rounded-full bg-secondary-fixed"></div>
          </div>
        </div>

        {/* Potential SIF */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase tracking-wider">POTENTIAL SIF</span>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-2xl text-primary leading-none font-bold">{metrics.potentialSif?.toLocaleString() || "86"}</span>
            <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
          </div>
        </div>

        {/* Non-SIF */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase tracking-wider">NON-SIF</span>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-2xl text-secondary leading-none font-bold">{metrics.nonSif?.toLocaleString() || "1,161"}</span>
            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
          </div>
        </div>

        {/* High Risk */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase tracking-wider">HIGH RISK</span>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-2xl text-error leading-none font-bold">{metrics.highRisk?.toLocaleString() || "19"}</span>
            <div className="w-2 h-2 rounded-full bg-error"></div>
          </div>
        </div>

        {/* Escalated */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-24">
          <span className="font-label-md text-xs text-secondary uppercase tracking-wider">ESCALATED</span>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-2xl text-error leading-none font-bold">{metrics.escalated?.toLocaleString() || "7"}</span>
            <div className="w-2 h-2 rounded-full bg-error"></div>
          </div>
        </div>
      </section>

      {/* Emerging Risk Ribbon */}
      <section className="bg-surface-container-lowest border border-outline-variant p-3.5 flex items-center justify-between text-xs text-secondary">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-error">warning</span>
          <strong className="text-primary font-label-md uppercase font-bold tracking-wider">EMERGING RISK</strong>
          <span className="text-outline">|</span>
          <span><strong className="text-primary font-mono-label">3</strong> recurring hazard patterns</span>
          <span>•</span>
          <span><strong className="text-primary font-mono-label">5</strong> rising review-priority trajectories</span>
          <span>•</span>
          <span><strong className="text-error font-mono-label font-bold">2</strong> reports escalated from Non-SIF context</span>
        </div>
      </section>

      {/* 2-Column Split: Review-Priority Distribution & Active Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-element-gap items-start">
        {/* Left: Review-Priority Distribution (7-col) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
          <h2 className="font-label-md text-xs text-primary uppercase font-bold tracking-wider">REVIEW-PRIORITY DISTRIBUTION</h2>

          {/* Bar Charts Representation */}
          <div className="flex flex-col gap-3.5 pt-1">
            {/* Non-SIF */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-medium">Non-SIF</span>
                <span className="font-mono-label text-primary font-bold">1,161</span>
              </div>
              <div className="w-full bg-[#dbeafe] h-2 rounded-full overflow-hidden">
                <div className="bg-[#94a3b8] h-full w-[88%] rounded-full"></div>
              </div>
            </div>

            {/* Potential SIF */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-medium">Potential SIF</span>
                <span className="font-mono-label text-primary font-bold">86</span>
              </div>
              <div className="w-full bg-[#dbeafe] h-2 rounded-full overflow-hidden">
                <div className="bg-[#f59e0b] h-full w-[14%] rounded-full"></div>
              </div>
            </div>

            {/* High Risk */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-medium">High Risk</span>
                <span className="font-mono-label text-primary font-bold">19</span>
              </div>
              <div className="w-full bg-[#dbeafe] h-2 rounded-full overflow-hidden">
                <div className="bg-[#dc2626] h-full w-[8%] rounded-full"></div>
              </div>
            </div>

            {/* Rising Review Priority */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-secondary font-medium">Rising Review Priority</span>
                <span className="font-mono-label text-primary font-bold">5</span>
              </div>
              <div className="w-full bg-[#dbeafe] h-2 rounded-full overflow-hidden">
                <div className="bg-[#991b1b] h-full w-[4%] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-secondary border-t border-outline-variant pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#94a3b8]"></div>
              <span>Non-SIF (1,161)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#f59e0b]"></div>
              <span>Potential SIF (86)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#dc2626]"></div>
              <span>High Risk (19)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#991b1b]"></div>
              <span>Rising Review Priority (5)</span>
            </div>
          </div>

          {/* Explanatory Note */}
          <p className="text-[11px] text-secondary border-t border-outline-variant/60 pt-2 leading-tight">
            Illustrative review-priority scores generated by the prototype&apos;s explainable scoring logic; not calibrated probabilities of injury or fatality.
          </p>
        </div>

        {/* Right: Active Alerts (5-col) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-label-md text-xs text-primary uppercase font-bold tracking-wider">ACTIVE ALERTS</h2>
            <button className="text-secondary text-xs flex items-center gap-1 hover:text-primary">
              <span className="material-symbols-outlined text-sm">filter_list</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {alerts.map((alert) => {
              const displayTitle = alert.title === "Increasing risk trajectory detected - Tank Farm" 
                ? "Increasing review-priority trajectory detected - Tank Farm" 
                : alert.title;
              return (
                <div key={alert.id} className="border border-outline-variant p-3.5 flex flex-col gap-2 border-l-4 border-l-error bg-surface-container-lowest">
                  <div className="flex justify-between items-center">
                    <span className={`font-label-md text-xs font-bold ${
                      alert.level === 'CRITICAL' ? 'text-error' : 'text-[#ea580c]'
                    }`}>{alert.level}</span>
                    <span className="font-mono-label text-xs text-secondary font-bold">Review Priority: {alert.riskScore}</span>
                  </div>
                  <h3 className="font-bold text-xs text-primary leading-tight">{displayTitle}</h3>
                  <div className="flex justify-between items-center text-[11px] text-secondary pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">location_on</span> {alert.location}
                    </span>
                    <span className="text-error font-semibold">{alert.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent SIF Cases Table */}
      <section className="bg-surface-container-lowest border border-outline-variant flex flex-col overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="font-label-md text-xs text-primary uppercase font-bold tracking-wider">Recent SIF Cases</h2>
          <button 
            onClick={() => onNavigate('cases')}
            className="bg-primary text-on-primary px-3 py-1 rounded text-xs font-label-md uppercase font-bold hover:bg-on-background transition-colors"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant font-label-md text-xs text-secondary">
                <th className="p-3">Case ID</th>
                <th className="p-3">Report Type</th>
                <th className="p-3">Hazard</th>
                <th className="p-3">Review Priority</th>
                <th className="p-3">SIF Potential</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-xs">
              {recentCases.map((c) => (
                <tr 
                  key={c.id} 
                  className="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => onSelectCase(c.id)}
                >
                  <td className="p-3 font-mono-label font-bold text-primary">{c.id}</td>
                  <td className="p-3 text-secondary">{c.type}</td>
                  <td className="p-3 text-primary font-medium">{c.hazard}</td>
                  <td className="p-3">
                    <span className={`font-mono-label text-xs font-bold px-1.5 py-0.5 rounded ${
                      c.risk >= 90 ? 'bg-[#fee2e2] text-[#991b1b]' : (c.risk >= 70 ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-surface-container text-secondary')
                    }`}>
                      {c.risk}
                    </span>
                  </td>
                  <td className="p-3">
                    {c.sifPotential === 'Y' || c.sifPotential === 'YES' ? (
                      <span className="font-bold text-error">Y</span>
                    ) : (
                      <span className="text-secondary">N</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      c.status === 'ACTION IN PROGRESS' ? 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]' : (c.status === 'CLOSED' ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-surface-container text-secondary border-outline-variant')
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono-label text-secondary">Today</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
