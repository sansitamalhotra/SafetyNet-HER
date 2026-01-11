
import React, { useState } from 'react';
import { MOCK_INCIDENTS, MOCK_VOLUNTEERS } from '../constants';
import { Urgency, Incident } from '../types';

type Tab = 'feed' | 'map' | 'history';

const VolunteerDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);

  const activeMission = incidents.find(i => i.id === activeMissionId);

  const handleAction = (id: string, newStatus: Incident['status']) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status: newStatus } : inc
    ));
    if (newStatus === 'accepted') {
      setActiveMissionId(id);
      setActiveTab('map');
    }
    if (newStatus === 'resolved') {
      setActiveMissionId(null);
      setActiveTab('history');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white select-none">
      {/* Volunteer Header */}
      <header className="px-6 py-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#09090b]/80 backdrop-blur-md z-50">
        <div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-1">SafetyNet Responder</h1>
          <p className="text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Sarah M. (Online)
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
             <span className="text-[10px] font-black text-violet-400">MESH: ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        
        {activeTab === 'feed' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-violet-500">Live Queue</h2>
              <span className="text-[10px] font-bold text-zinc-500">3 Nearby</span>
            </div>

            <div className="space-y-4">
              {incidents.filter(i => i.status === 'open' || (i.status === 'accepted' && i.id !== activeMissionId)).map(incident => (
                <div key={incident.id} className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 space-y-5 shadow-2xl relative overflow-hidden group hover:border-violet-500/50 transition-all">
                  {incident.urgencyScore >= 8 && (
                    <div className="absolute top-0 right-0 p-4">
                       <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black rounded-full border border-rose-500/20 animate-pulse">URG {incident.urgencyScore}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {incident.category === 'FOLLOWED' ? '👣' : '🚶‍♀️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">{incident.category}</p>
                      <p className="text-base font-black truncate">{incident.location.area}</p>
                      <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 italic leading-relaxed font-medium">"{incident.description}"</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAction(incident.id, 'accepted')}
                    className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-500 transition-all active:scale-95 shadow-xl shadow-violet-600/20"
                  >
                    Accept Dispatch
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
            {activeMission ? (
              <>
                <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Active Mission</p>
                        <h3 className="text-xl font-black">{activeMission.location.area}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-500 uppercase">ETA</p>
                        <p className="text-lg font-black text-white">4 MIN</p>
                      </div>
                   </div>
                   <div className="h-48 bg-zinc-800 rounded-2xl relative overflow-hidden border border-white/5">
                      {/* Stylized Nav Grid */}
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                      {/* Path to User */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                         <path d="M40 160 L100 120 L160 40" stroke="#7c3aed" strokeWidth="4" fill="none" strokeDasharray="10 5" className="animate-[dash_2s_linear_infinite]" />
                         <circle cx="40" cy="160" r="6" fill="#10b981" />
                         <circle cx="160" cy="40" r="8" fill="#f43f5e" className="animate-pulse" />
                      </svg>
                      <style>{`@keyframes dash { to { stroke-dashoffset: -15; } }`}</style>
                      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-black">NAVIGATING TO USER</div>
                   </div>
                   <div className="grid grid-cols-2 gap-3 pt-2">
                     <button 
                       onClick={() => handleAction(activeMission.id, 'on-scene')}
                       className="bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95"
                     >
                       On Scene
                     </button>
                     <button 
                       onClick={() => handleAction(activeMission.id, 'resolved')}
                       className="bg-zinc-800 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95"
                     >
                       Resolved
                     </button>
                   </div>
                </div>
                <div className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Live User Transcript</p>
                   <p className="text-xs italic text-zinc-400">"I'm at the Tim Hortons entrance, wearing a denim jacket..."</p>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                 <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-3xl">🗺️</div>
                 <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">No Active Mission</p>
                 <button onClick={() => setActiveTab('feed')} className="mt-4 text-xs font-black text-violet-500 uppercase">Back to Queue</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Mission Archive</h2>
            <div className="space-y-3">
              {incidents.filter(i => i.status === 'resolved').map(incident => (
                <div key={incident.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="text-lg opacity-60">✅</div>
                      <div>
                        <p className="text-xs font-bold">{incident.location.area}</p>
                        <p className="text-[9px] text-zinc-600 uppercase font-black">{incident.category} • {incident.time}</p>
                      </div>
                   </div>
                   <div className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Verified Safe</div>
                </div>
              ))}
              {incidents.filter(i => i.status === 'resolved').length === 0 && (
                 <p className="text-center text-zinc-700 text-[10px] font-black uppercase py-20">No resolved incidents tonight</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Volunteer Bottom Navigation */}
      <nav className="h-24 border-t border-white/5 flex items-center justify-around px-8 bg-black/80 backdrop-blur-md shrink-0 pb-6">
         <button onClick={() => setActiveTab('feed')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'feed' ? 'text-violet-500' : 'text-zinc-600'}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Feed</span>
         </button>
         <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'map' ? 'text-violet-500' : 'text-zinc-600'}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">Map</span>
         </button>
         <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'history' ? 'text-violet-500' : 'text-zinc-600'}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[9px] font-black uppercase tracking-widest">History</span>
         </button>
      </nav>
    </div>
  );
};

export default VolunteerDashboard;
