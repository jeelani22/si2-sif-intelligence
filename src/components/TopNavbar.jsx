import React from 'react';

export default function TopNavbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'command-center', label: 'Command Center' },
    { id: 'analyze-report', label: 'Analyze Report' },
    { id: 'bulk-intelligence', label: 'Bulk Intelligence' },
    { id: 'cases', label: 'Cases' },
    { id: 'risk-evolution', label: 'Risk Evolution' },
  ];

  return (
    <nav className="bg-surface-container-lowest border-b border-outline-variant w-full h-12 flex-shrink-0 z-30 sticky top-0">
      <div className="flex justify-between items-center px-container-padding w-full max-w-[1920px] mx-auto h-full">
        <div className="flex items-center gap-6 h-full">
          <span 
            onClick={() => setActiveTab('command-center')} 
            className="font-headline-md text-headline-md font-bold text-primary tracking-tight select-none cursor-pointer"
          >
            SIF Intelligence
          </span>
          <div className="hidden md:flex gap-6 h-full items-center pt-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`font-label-md text-label-md h-full flex items-center cursor-pointer transition-colors duration-150 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary font-semibold pb-1 pt-1'
                      : 'text-secondary font-medium hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search bar on desktop */}
          <div className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-surface-container-low border border-outline-variant text-xs rounded pl-3 pr-7 py-1 text-primary w-48 focus:w-64 transition-all focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <span className="material-symbols-outlined text-secondary text-sm absolute right-2 pointer-events-none">
              search
            </span>
          </div>

          <button className="text-on-surface-variant hover:bg-surface-container p-1 rounded transition-colors duration-150 relative" title="Notifications">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          <button className="text-on-surface-variant hover:bg-surface-container p-1 rounded transition-colors duration-150" title="System Settings">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden cursor-pointer active:opacity-80 transition-opacity flex items-center justify-center bg-slate-300" title="HSE Safety Director">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" 
              alt="Avatar" 
              className="w-full h-full object-cover" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
