
import React from 'react';
import PredictiveLayer from './PredictiveLayer';
import TorontoSafetyMap from './TorontoSafetyMap';

const CommunityOpsDashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#fdfdfd] overflow-hidden">
      <header className="px-10 py-8 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Beasley Community Ops</h1>
          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-[0.3em]">Mesh Intelligence Center</p>
        </div>
        <div className="flex gap-6 items-center">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Global Mesh Status</p>
              <p className="text-xs font-black text-emerald-500 uppercase flex items-center justify-end gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE
              </p>
           </div>
           <button className="w-12 h-12 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl flex items-center justify-center text-slate-500 border border-slate-100 shadow-sm">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
           </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: 'Predicted Tonight', val: 'HIGH RISK', color: 'text-rose-600', sub: 'Beasley Hub Sector 4' },
             { label: 'Mesh Nodes On-Duty', val: '42 Active', color: 'text-violet-600', sub: '92.4% Coverage' },
             { label: 'Avg Peer Response', val: '6m 20s', color: 'text-slate-900', sub: '12% Faster than 911' }
           ].map((kpi, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{kpi.label}</p>
                <p className={`text-3xl font-black tracking-tight ${kpi.color}`}>{kpi.val}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-2">{kpi.sub}</p>
             </div>
           ))}
        </div>

        {/* Heatmap Section */}
        <section>
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Real-Time Risk Landscape</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Geospatial Feed • Hamilton/Toronto</p>
            </div>
            <div className="flex gap-3">
               <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Export Hotspots</button>
            </div>
          </div>
          <div className="h-[500px]">
            <TorontoSafetyMap />
          </div>
        </section>

        {/* Predictive Forecasting */}
        <section className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl shadow-slate-100">
           <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Predictive Safety Intelligence</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Synthesized via Gemini-3-Pro Neural Engine</p>
              </div>
              <button className="p-4 bg-violet-50 text-violet-600 rounded-2xl hover:bg-violet-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
           </div>
           <PredictiveLayer />
        </section>

        {/* Recent Events / Log */}
        <section className="pb-10">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-4">Audit Trail</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { type: 'RESOLVED', desc: 'Walking escort from Bay Station safely completed by Volunteer Sarah.', time: '4m ago' },
                { type: 'DISPATCH', desc: 'Emergency mesh alert triggered in Beasley Sector 2. Priority 9.', time: '18m ago' }
              ].map((log, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-[1.8rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'RESOLVED' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-900">{log.type}</p>
                      <p className="text-xs text-slate-500 font-medium leading-snug">{log.desc}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase whitespace-nowrap">{log.time}</span>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default CommunityOpsDashboard;
