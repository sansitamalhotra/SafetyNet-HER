
import React, { useState, useEffect } from 'react';
import { analyzeSmsUrgency } from '../services/geminiService';

interface UserMobileAppProps {
  onIncidentTriggered: (details: any) => void;
  onCallRequested: () => void;
}

type AppMode = 'home' | 'followed' | 'evidence' | 'havens' | 'stealth';

const UserMobileApp: React.FC<UserMobileAppProps> = ({ onIncidentTriggered, onCallRequested }) => {
  const [activeMode, setActiveMode] = useState<AppMode>('home');
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const triggerSOS = () => {
    setIsSOSActive(true);
    onIncidentTriggered({
      type: 'EMERGENCY_SOS',
      description: '911 Emergency Button Pressed',
      urgency: 'CRITICAL'
    });
    setTimeout(() => setIsSOSActive(false), 3000);
    // Silent execution of emergency protocols
    console.log("ALERT: SOS Dispatched to Mesh Network");
  };

  const startRecording = () => {
    setIsRecording(true);
    onIncidentTriggered({
      type: 'EVIDENCE_COLLECTION',
      description: 'User started encrypted cloud recording',
      urgency: 'MEDIUM'
    });
    setTimeout(() => setIsRecording(false), 5000);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 max-h-screen">
      {/* 
        Ultra-Responsive Phone Shell 
        - Using aspect ratio and max-h-full to ensure it never exceeds its parent container.
        - Scaling down on shorter viewports.
      */}
      <div className="relative w-full max-w-[280px] lg:max-w-[300px] aspect-[9/19] max-h-[95%] bg-black rounded-[3rem] p-2 lg:p-2.5 shadow-2xl border-[6px] lg:border-[8px] border-zinc-800 ring-4 ring-zinc-700/20 overflow-hidden flex flex-col">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 lg:w-24 h-4 lg:h-5 bg-black rounded-b-2xl z-50"></div>
        
        {/* Screen Content */}
        <div className="flex-1 w-full bg-[#0a0a0b] rounded-[2rem] overflow-hidden flex flex-col relative text-white">
          
          {/* Status Bar */}
          <div className="pt-4 lg:pt-5 pb-1 px-5 flex justify-between items-center text-[7px] lg:text-[8px] font-bold opacity-60 z-40">
            <span>9:41</span>
            <div className="flex gap-1 items-center">
              <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
              <div className="w-3.5 h-1.5 border border-white/50 rounded-sm relative"><div className="absolute inset-0.5 bg-green-400 w-3/4"></div></div>
            </div>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-4 pt-1 pb-16 no-scrollbar">
            
            {activeMode === 'home' && (
              <div className="space-y-3 lg:space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-between items-center py-2 lg:py-3">
                  <h1 className="text-base lg:text-lg font-black text-violet-400">SafetyNet</h1>
                  <button onClick={() => setActiveMode('stealth')} className="p-1.5 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                    <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  </button>
                </div>

                {/* THE 911 BUTTON - Survivor Priority */}
                <button 
                  onClick={triggerSOS}
                  className={`w-full h-16 lg:h-20 rounded-[1.8rem] flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 shadow-xl ${isSOSActive ? 'bg-red-500 animate-pulse' : 'bg-red-600'}`}
                >
                  <span className="text-xl lg:text-2xl">🚨</span>
                  <span className="font-black text-[9px] lg:text-[10px] uppercase tracking-[0.2em]">EMERGENCY 911</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setActiveMode('followed')}
                    className="bg-zinc-900 border border-zinc-800 h-22 lg:h-26 rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center gap-1.5 hover:bg-zinc-800 transition-all p-2"
                  >
                    <span className="text-xl lg:text-2xl">👣</span>
                    <div className="text-center">
                      <p className="text-[7px] lg:text-[8px] font-black uppercase text-violet-400">Followed</p>
                      <p className="text-[5px] lg:text-[6px] text-zinc-500 mt-0.5">MESH TRACKING</p>
                    </div>
                  </button>
                  <button 
                    onClick={onCallRequested}
                    className="bg-zinc-900 border border-zinc-800 h-22 lg:h-26 rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center gap-1.5 hover:bg-zinc-800 transition-all p-2"
                  >
                    <span className="text-xl lg:text-2xl">📞</span>
                    <div className="text-center">
                      <p className="text-[7px] lg:text-[8px] font-black uppercase text-blue-400">Exit Out</p>
                      <p className="text-[5px] lg:text-[6px] text-zinc-500 mt-0.5">FAKE EMERGENCY</p>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={() => setActiveMode('evidence')}
                  className="w-full bg-gradient-to-r from-violet-600/10 to-pink-600/10 border border-white/5 p-3 lg:p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📹</span>
                    <div className="text-left">
                      <p className="text-[9px] lg:text-[10px] font-black">Secure Evidence</p>
                      <p className="text-[6px] lg:text-[7px] text-zinc-600 uppercase font-bold tracking-widest">Instant Cloud Backup</p>
                    </div>
                  </div>
                  <svg className="w-3 h-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>

                <div className="bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/40 flex items-center justify-between">
                   <div>
                     <p className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Nearby Support</p>
                     <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-black flex items-center justify-center text-[8px] font-bold text-violet-400">S</div>
                        <div className="w-6 h-6 rounded-full bg-pink-500/20 border border-black flex items-center justify-center text-[8px] font-bold text-pink-400">M</div>
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-black flex items-center justify-center text-[8px] font-bold text-blue-400">J</div>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[7px] text-green-500 font-black uppercase tracking-tighter">Response</p>
                     <p className="text-[10px] font-black text-white leading-none">2.4m</p>
                   </div>
                </div>
              </div>
            )}

            {activeMode === 'followed' && (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <button onClick={() => setActiveMode('home')} className="flex items-center gap-1 text-[7px] font-black uppercase text-zinc-600">
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <div className="text-center">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-violet-600/20 rounded-full mx-auto flex items-center justify-center mb-2">
                    <span className="text-xl animate-pulse">🚶‍♀️</span>
                  </div>
                  <h2 className="text-xs lg:text-sm font-black tracking-tight uppercase">Guardian Watch</h2>
                  <p className="text-[7px] lg:text-[8px] text-zinc-500 mt-1 uppercase font-bold px-1 leading-normal">
                    The mesh is tracking your pace. Deviation triggers immediate volunteer escalation.
                  </p>
                </div>

                <div className="space-y-2">
                   <p className="text-[6px] lg:text-[7px] font-black text-violet-400 uppercase tracking-widest">Nearest Safe Havens</p>
                   <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-white">Main St Library</p>
                        <p className="text-[6px] text-zinc-600 uppercase">180m • Staff Vetted</p>
                      </div>
                      <button className="bg-violet-600 px-2 py-1 rounded-lg text-[7px] font-black uppercase">Nav</button>
                   </div>
                   <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-white">Hamilton GO</p>
                        <p className="text-[6px] text-zinc-600 uppercase">310m • Peer mesh</p>
                      </div>
                      <button className="bg-zinc-800 px-2 py-1 rounded-lg text-[7px] font-black uppercase text-zinc-500">Nav</button>
                   </div>
                </div>

                <button 
                  onClick={() => onIncidentTriggered({ type: 'ESCORT_REQUEST', description: 'User requested companion', urgency: 'HIGH' })}
                  className="w-full bg-white text-black py-2.5 lg:py-3 rounded-xl font-black text-[8px] lg:text-[9px] uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Request Walking Buddy
                </button>
              </div>
            )}

            {activeMode === 'evidence' && (
              <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                <button onClick={() => setActiveMode('home')} className="text-[7px] font-black uppercase text-zinc-600">Back</button>
                <div className="aspect-square bg-zinc-900 rounded-[1.5rem] lg:rounded-[2rem] border border-red-500/20 flex flex-col items-center justify-center relative overflow-hidden">
                   {isRecording ? (
                     <div className="absolute inset-0 bg-red-500/5 flex flex-col items-center justify-center animate-pulse">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-600 rounded-full mb-3 shadow-[0_0_20px_rgba(220,38,38,0.5)]"></div>
                        <p className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-red-500">Streaming Evidence...</p>
                     </div>
                   ) : (
                     <>
                      <span className="text-2xl lg:text-3xl mb-3">🤳</span>
                      <p className="text-[7px] lg:text-[8px] text-zinc-500 font-bold px-4 text-center uppercase leading-normal">
                        Encrypted stream starts instantly. Data is immutable and saved off-device.
                      </p>
                     </>
                   )}
                </div>
                <button 
                  onClick={startRecording}
                  className={`w-full py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[8px] lg:text-[9px] uppercase tracking-widest transition-all ${isRecording ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
                >
                  {isRecording ? 'End & Secure' : 'Start Secure Recording'}
                </button>
              </div>
            )}

            {activeMode === 'stealth' && (
              <div className="h-full flex flex-col items-center justify-center space-y-3 lg:space-y-4 animate-in zoom-in duration-300 pt-2 lg:pt-4">
                <div className="grid grid-cols-4 gap-1.5 lg:gap-2 w-full">
                  {[1,2,3,'+',4,5,6,'-',7,8,9,'*',0,'.','=','/'].map((n, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 rounded-lg flex items-center justify-center text-[8px] lg:text-[10px] font-bold text-zinc-700">
                      {n}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-2">
                   <p className="text-[6px] text-zinc-700 uppercase font-black tracking-widest">Long press code to unlock</p>
                   <button onClick={() => setActiveMode('home')} className="w-8 h-8 rounded-full border border-zinc-900 flex items-center justify-center text-zinc-800 text-[8px] font-black">X</button>
                </div>
              </div>
            )}
          </div>

          {/* Tab Bar - Compact for small screens */}
          <div className="absolute bottom-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/5 px-6 pt-1.5 pb-4 flex justify-between items-center z-40">
             <button onClick={() => setActiveMode('home')} className={`flex flex-col items-center gap-0.5 ${activeMode === 'home' ? 'text-violet-500' : 'text-zinc-700'}`}>
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
               <span className="text-[5px] font-black uppercase">Safety</span>
             </button>
             <button className="flex flex-col items-center gap-0.5 text-zinc-700">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
               <span className="text-[5px] font-black uppercase">Vetted</span>
             </button>
             <button className="flex flex-col items-center gap-0.5 text-zinc-700">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
               <span className="text-[5px] font-black uppercase">Mesh</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMobileApp;
