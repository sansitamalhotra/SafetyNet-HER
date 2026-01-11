
import React from 'react';

const TorontoSafetyMap: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#0f172a] rounded-[2rem] overflow-hidden border border-slate-800 shadow-inner group">
      {/* Base Grid Layer */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Stylized Toronto Street Grid Simulation */}
      <svg className="absolute inset-0 w-full h-full text-slate-800 opacity-20" viewBox="0 0 800 600">
        <path d="M0 100 L800 100 M0 200 L800 200 M0 300 L800 300 M0 400 L800 400 M0 500 L800 500" stroke="currentColor" strokeWidth="1" />
        <path d="M100 0 L100 600 M200 0 L200 600 M300 0 L300 600 M400 0 L400 600 M500 0 L500 600 M600 0 L600 600 M700 0 L700 600" stroke="currentColor" strokeWidth="1" />
        {/* Major Roads */}
        <path d="M0 250 Q 400 280 800 250" stroke="#334155" strokeWidth="3" fill="none" />
        <path d="M350 0 Q 380 300 350 600" stroke="#334155" strokeWidth="3" fill="none" />
      </svg>

      {/* Heatmap Clusters */}
      <div className="absolute top-[30%] left-[20%] w-48 h-48 bg-rose-500/30 rounded-full blur-[60px] animate-pulse"></div>
      <div className="absolute top-[50%] left-[45%] w-64 h-64 bg-rose-600/20 rounded-full blur-[80px] animate-pulse [animation-duration:4s]"></div>
      <div className="absolute top-[20%] left-[70%] w-32 h-32 bg-amber-500/20 rounded-full blur-[50px] animate-pulse [animation-duration:3s]"></div>
      
      {/* Active Incident Markers */}
      <div className="absolute top-[32%] left-[22%] group/marker">
        <div className="w-3 h-3 bg-rose-500 rounded-full ring-4 ring-rose-500/20 animate-ping absolute"></div>
        <div className="w-3 h-3 bg-rose-500 rounded-full ring-4 ring-rose-500/20 relative"></div>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-10">
          <p className="text-[10px] font-black text-rose-500">URG 9: STALKING</p>
          <p className="text-[8px] text-white">Queen & Spadina</p>
        </div>
      </div>

      <div className="absolute top-[55%] left-[48%] group/marker">
        <div className="w-3 h-3 bg-violet-500 rounded-full ring-4 ring-violet-500/20 relative"></div>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-10">
          <p className="text-[10px] font-black text-violet-500">ESCORT REQUEST</p>
          <p className="text-[8px] text-white">Union Station Hub</p>
        </div>
      </div>

      {/* Map UI Overlay */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Risk Intensity</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="w-1/3 h-full bg-emerald-500"></div>
              <div className="w-1/3 h-full bg-amber-500"></div>
              <div className="w-1/3 h-full bg-rose-500"></div>
            </div>
            <span className="text-[9px] font-bold text-white uppercase">Critical</span>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex flex-col gap-2">
         <div className="bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl text-[10px] font-black text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            LIVE PREDICTIVE FEED
         </div>
      </div>

      {/* Landmark Labels */}
      <div className="absolute top-[10%] left-[50%] text-[10px] font-black text-slate-600 uppercase tracking-tighter pointer-events-none">Bloor St West</div>
      <div className="absolute top-[90%] left-[30%] text-[10px] font-black text-slate-600 uppercase tracking-tighter pointer-events-none rotate-[-15deg]">Lakeshore Blvd</div>
    </div>
  );
};

export default TorontoSafetyMap;
