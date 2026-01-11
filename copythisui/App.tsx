import React, { useEffect, useRef, useState } from 'react';
import { flows } from '../src/flows/conversationFlows';
import FakeCall from './FakeCall';
import TorontoSafetyMap from './TorontoSafetyMap';

const BACKEND_URL = 'http://localhost:3001';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

interface Incident {
  _id: string;
  userPhone: string;
  message: string;
  category: string;
  urgency: number;
  emotion: string;
  status: string;
  timestamp: string;
  policeInvolved?: boolean;
}

interface AIAnalysis {
  category: string;
  urgency: number;
  emotion: string;
  recommendedAction: string;
  policeNeeded: boolean;
  communityResolution: boolean;
  suggestedResponse?: string;
}

type ViewMode = 'live' | 'community';

const categoryColors: { [key: string]: string } = {
  life_threatening: 'from-red-700 to-red-900',
  domestic_violence: 'from-red-600 to-pink-700',
  assault: 'from-red-500 to-orange-600',
  sexual_assault: 'from-red-600 to-purple-700',
  following: 'from-orange-500 to-yellow-500',
  harassment: 'from-yellow-500 to-amber-500',
  unsafe_location: 'from-amber-500 to-yellow-600',
  intoxicated_person: 'from-orange-400 to-yellow-600',
  uncomfortable: 'from-yellow-400 to-lime-500',
  other: 'from-blue-500 to-cyan-500',
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: flows.START.response, sender: 'system', timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentFlow, setCurrentFlow] = useState('START');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [liveAnalysis, setLiveAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [acceptedDispatch, setAcceptedDispatch] = useState<any>(null);
  const [volunteerDistance, setVolunteerDistance] = useState(2.4);
  const [volunteerTab, setVolunteerTab] = useState<'feed' | 'map' | 'history'>('feed');
  const [activeView, setActiveView] = useState<ViewMode>('live');
  const [showFakeCall, setShowFakeCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (acceptedDispatch && volunteerDistance > 0) {
      const interval = setInterval(() => {
        setVolunteerDistance((prev) => Math.max(0, prev - 0.15));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [acceptedDispatch, volunteerDistance]);

  const loadData = async () => {
    try {
      const [incRes, statRes, volRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/incidents?limit=30`),
        fetch(`${BACKEND_URL}/api/incidents/stats`),
        fetch(`${BACKEND_URL}/api/volunteers`),
      ]);

      const incData = await incRes.json();
      setIncidents(incData);
      setStats(await statRes.json());
      setVolunteers(await volRes.json());
    } catch (err) {
      console.error('Backend error:', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processUserInput = (text: string) => {
    const upperText = text.toUpperCase().trim();
    const currentOptions = flows[currentFlow]?.options;

    if (currentOptions) {
      for (const [key, nextFlow] of Object.entries(currentOptions)) {
        if (upperText === key.toUpperCase() || upperText === key) {
          return nextFlow;
        }
      }
    }

    if (upperText.includes('KILL') || upperText.includes('GUN') || upperText.includes('KNIFE')) return 'EMERGENCY';
    if (upperText.includes('UNSAFE') || upperText.includes('HELP') || upperText.includes('SCARED') || upperText.includes('FOLLOWING')) return 'FOLLOWING';
    if (upperText.includes('CALL')) return 'FAKE_CALL';
    if (upperText.includes('ESCORT') || upperText.includes('WALK')) return 'ESCORT';
    if (upperText.includes('TALK')) return 'TALK';
    if (upperText.includes('EMERGENCY') || upperText === '9') return 'EMERGENCY';
    if (upperText.includes('HARASS') || upperText.includes('CATCALL')) return 'UNSAFE_LOCATION';
    if (upperText.includes('DRUNK') || upperText.includes('BAR')) return 'BAR_EXIT_STRATEGY';
    if (upperText.includes('HOME') || upperText.includes('ALONE')) return 'GUARDIAN_ANGEL';
    if (upperText.includes('BUS') || upperText.includes('WAITING')) return 'UNSAFE_BUS_STOP';

    return 'TALK';
  };

  const analyzeMessage = (text: string): AIAnalysis => {
    const lower = text.toLowerCase();
    let urgency = 5;
    let category = 'other';
    let emotion = 'concern';
    let policeNeeded = false;
    let communityResolution = true;

    if (
      lower.includes('kill') ||
      lower.includes('murder') ||
      lower.includes('gun') ||
      lower.includes('knife') ||
      lower.includes('weapon') ||
      lower.includes('shoot')
    ) {
      category = 'life_threatening';
      urgency = 10;
      emotion = 'terror';
      policeNeeded = true;
      communityResolution = false;
    } else if (
      lower.includes('domestic') ||
      lower.includes('abuse') ||
      lower.includes('hit me') ||
      lower.includes('beating') ||
      lower.includes('partner') ||
      lower.includes('boyfriend') ||
      lower.includes('husband') ||
      lower.includes('ex')
    ) {
      category = 'domestic_violence';
      urgency = 10;
      emotion = 'fear';
      policeNeeded = true;
      communityResolution = false;
    } else if (
      lower.includes('assault') ||
      lower.includes('attack') ||
      lower.includes('grabbed') ||
      lower.includes('touching') ||
      lower.includes('groping') ||
      lower.includes('pushed')
    ) {
      category = 'assault';
      urgency = 10;
      emotion = 'panic';
      policeNeeded = true;
      communityResolution = false;
    } else if (lower.includes('rape') || lower.includes('sexual') || lower.includes('molest')) {
      category = 'sexual_assault';
      urgency = 10;
      emotion = 'trauma';
      policeNeeded = true;
      communityResolution = false;
    } else if (lower.includes('follow') || lower.includes('stalking') || lower.includes('chasing')) {
      category = 'following';
      urgency = 9;
      emotion = 'fear';
    } else if (
      lower.includes('harass') ||
      lower.includes('catcall') ||
      lower.includes('yelling') ||
      lower.includes("won't leave me alone")
    ) {
      category = 'harassment';
      urgency = 7;
      emotion = 'discomfort';
    } else if (
      lower.includes('unsafe') ||
      lower.includes('scared') ||
      lower.includes('alone') ||
      lower.includes('dark') ||
      lower.includes('isolated')
    ) {
      category = 'unsafe_location';
      urgency = 8;
      emotion = 'fear';
    } else if (lower.includes('drunk') || lower.includes('intoxicated') || lower.includes('high')) {
      category = 'intoxicated_person';
      urgency = 7;
      emotion = 'concern';
    } else if (lower.includes('uncomfortable') || lower.includes('creepy') || lower.includes('weird')) {
      category = 'uncomfortable';
      urgency = 6;
      emotion = 'unease';
    } else if (lower.includes('emergency') || lower.includes('911') || lower.includes('help now')) {
      urgency = 10;
      policeNeeded = true;
      communityResolution = false;
    }

    return {
      category,
      urgency,
      emotion,
      recommendedAction: urgency >= 8 ? 'dispatch_immediate' : 'provide_resources',
      policeNeeded,
      communityResolution: !policeNeeded,
    };
  };

  const normalizeAIResponse = (analysis: any, text: string): AIAnalysis => {
    if (!analysis) return analyzeMessage(text);
    const recommendedAction = analysis.recommendedAction || analysis.recommended_action || 'provide_resources';
    const policeNeeded =
      analysis.policeNeeded !== undefined
        ? analysis.policeNeeded
        : analysis.police_needed !== undefined
        ? analysis.police_needed
        : recommendedAction === 'dispatch_immediate' && (analysis.urgency ?? 0) >= 9;

    return {
      category: analysis.category || 'other',
      urgency: Number(analysis.urgency ?? 5),
      emotion: analysis.emotion || 'concern',
      recommendedAction,
      policeNeeded,
      communityResolution: analysis.communityResolution ?? !policeNeeded,
      suggestedResponse: analysis.suggestedResponse || analysis.suggested_response,
    };
  };

  const fetchLiveAnalysis = async (text: string): Promise<AIAnalysis> => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/sms/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return normalizeAIResponse(data.analysis, text);
    } catch (err) {
      console.error('Gemini analysis failed, falling back to keywords', err);
      return analyzeMessage(text);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const userInput = inputText;
    setInputText('');
    setIsTyping(true);
    setIsAnalyzing(true);

    if (userInput.toUpperCase().includes('CALL')) {
      setShowFakeCall(true);
    }

    const analysis = await fetchLiveAnalysis(userInput);
    setLiveAnalysis(analysis);
    setIsAnalyzing(false);

    if (analysis.urgency >= 8) {
      const volunteer = volunteers[0] || { name: 'Sarah Martinez' };
      setAcceptedDispatch({
        incident: {
          _id: Date.now().toString(),
          userPhone: '+16478715609',
          message: userInput,
          category: analysis.category,
          urgency: analysis.urgency,
          emotion: analysis.emotion,
          status: 'dispatched',
          timestamp: new Date().toISOString(),
          policeInvolved: analysis.policeNeeded,
        },
        volunteer: volunteer.name,
        eta: analysis.urgency === 10 ? '2 min' : '4 min',
        action: 'DISPATCH_IMMEDIATE',
      });
      setVolunteerDistance(analysis.urgency === 10 ? 1.5 : 2.4);
    }

    try {
      await fetch(`${BACKEND_URL}/api/sms/incoming`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: '+16478715609',
          Body: userInput,
          analysis,
        }),
      });
    } catch (err) {
      console.error('Backend error:', err);
    }

    setTimeout(() => {
      const nextFlow = processUserInput(userInput);
      setCurrentFlow(nextFlow);

      const flowData = flows[nextFlow];
      if (flowData) {
        setIsTyping(false);

        const systemMsg: Message = {
          id: Date.now().toString(),
          text: flowData.response,
          sender: 'system',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMsg]);
      }

      setTimeout(loadData, 800);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const policeInvolved = incidents.filter((i) => i.policeInvolved).length;
  const communityResolved = incidents.length - policeInvolved;
  const communityPercent = incidents.length > 0 ? Math.round((communityResolved / incidents.length) * 100) : 100;
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  const isHighRiskTime = (dayOfWeek === 5 || dayOfWeek === 6) && hour >= 22;

  const personaNav: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'live', label: 'SMS + Volunteer', icon: '📱' },
    { id: 'community', label: 'Community Ops', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col font-sans">
      <header className="h-16 border-b border-white/5 px-4 lg:px-8 flex items-center justify-between bg-black/40 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center font-black text-xl shadow-lg shadow-violet-500/30">
            S
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">SafetyNet</p>
            <p className="text-base font-black text-white -mt-1">HER Command Mesh</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
          {personaNav.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeView === tab.id ? 'bg-white text-black shadow-lg shadow-violet-500/20' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Mesh Secure
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Gemini
            <span className="text-violet-400">2.5 Flash</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="bg-gradient-to-br from-[#0b0b10] via-[#0f0a15] to-[#0b0b10] rounded-[32px] border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] p-4 lg:p-6">
          {activeView === 'live' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Survivor Phone */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-[360px] aspect-[9/19] bg-gradient-to-b from-[#e2e2e7] via-[#d1d1d6] to-[#e2e2e7] rounded-[3.5rem] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.1)] border-[4px] border-[#a1a1aa] ring-1 ring-white/20 flex flex-col overflow-hidden">
                  <div className="absolute left-[-2px] top-24 w-[3px] h-12 bg-[#a1a1aa] rounded-r-sm"></div>
                  <div className="absolute left-[-2px] top-40 w-[3px] h-16 bg-[#a1a1aa] rounded-r-sm"></div>
                  <div className="absolute left-[-2px] top-60 w-[3px] h-16 bg-[#a1a1aa] rounded-r-sm"></div>
                  <div className="absolute right-[-2px] top-40 w-[3px] h-24 bg-[#a1a1aa] rounded-l-sm"></div>

                  <div className="flex-1 bg-white rounded-[2.8rem] overflow-hidden flex flex-col relative text-black shadow-inner border-[6px] border-black">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-end pr-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                    </div>

                    <div className="pt-10 pb-3 border-b border-zinc-200 flex flex-col items-center shrink-0 bg-[#F6F6F6]/90 backdrop-blur-xl z-40">
                      <div className="w-full flex justify-between items-center px-4 mb-1">
                        <button className="text-[#007AFF] flex items-center gap-0.5">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                          <span className="text-base">9</span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                        <button className="text-[#007AFF] text-sm font-medium opacity-0">Edit</button>
                      </div>
                      <p className="text-[11px] font-bold text-zinc-900 leading-none">SafetyNet HER</p>
                      <div className="flex items-center gap-1 opacity-60 mt-0.5">
                        <span className="text-[9px] text-zinc-500 font-medium">905-SAFE-HER</span>
                        <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-6 space-y-3 bg-white scroll-smooth no-scrollbar">
                      <div className="flex justify-center mb-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Today</span>
                      </div>

                      {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[82%] p-2.5 px-4 text-[14px] leading-[1.35] ${
                              m.sender === 'user'
                                ? 'bg-[#007AFF] text-white rounded-[18px] rounded-br-[4px] font-normal shadow-sm'
                                : 'bg-[#E9E9EB] text-black rounded-[18px] rounded-bl-[4px] font-normal shadow-sm'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-[#E9E9EB] p-2.5 px-4 rounded-[18px] rounded-bl-[4px] flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    <div className="px-3 pb-8 pt-2 bg-white flex gap-2 items-center border-t border-zinc-100">
                      <button className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      </button>
                      <div className="flex-1 relative flex items-center">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="iMessage"
                          className="w-full bg-white border border-zinc-200 rounded-full py-2 px-4 pr-10 focus:outline-none text-[15px] text-black placeholder-zinc-400 transition-all focus:border-zinc-300"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!inputText.trim()}
                          className={`absolute right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            inputText.trim() ? 'bg-[#007AFF] text-white' : 'bg-zinc-100 text-zinc-300'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/10 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Center */}
              <div className="hidden lg:flex">
                <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">AI Analysis</p>
                      <p className="text-lg font-black text-white">Gemini Safety Engine</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${isAnalyzing ? 'bg-amber-500/20 text-amber-200 animate-pulse' : liveAnalysis ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/10 text-zinc-300'}`}>
                      {isAnalyzing ? 'Processing' : liveAnalysis ? 'Complete' : 'Ready'}
                    </span>
                  </div>

                  {liveAnalysis ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400 font-semibold">Category</span>
                        <span className={`px-2 py-1 rounded-full text-[11px] font-black bg-gradient-to-r ${categoryColors[liveAnalysis.category] || categoryColors.other} text-white uppercase`}>
                          {liveAnalysis.category.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400 font-semibold">Urgency</span>
                          <span className={`text-xl font-black ${liveAnalysis.urgency >= 9 ? 'text-red-400' : 'text-white'}`}>{liveAnalysis.urgency}/10</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full ${liveAnalysis.urgency >= 9 ? 'bg-red-500' : liveAnalysis.urgency >= 7 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            style={{ width: `${liveAnalysis.urgency * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] font-black">
                        <div className={`p-3 rounded-2xl border ${liveAnalysis.communityResolution ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
                          <p className="text-zinc-300 mb-1">Community</p>
                          <p className={liveAnalysis.communityResolution ? 'text-emerald-300' : 'text-zinc-500'}>{liveAnalysis.communityResolution ? 'Preferred' : 'Standby'}</p>
                        </div>
                        <div className={`p-3 rounded-2xl border ${liveAnalysis.policeNeeded ? 'border-red-400/40 bg-red-500/10 animate-pulse' : 'border-white/10 bg-white/5'}`}>
                          <p className="text-zinc-300 mb-1">Police</p>
                          <p className={liveAnalysis.policeNeeded ? 'text-red-300' : 'text-zinc-500'}>{liveAnalysis.policeNeeded ? 'Escalate' : 'Not required'}</p>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-sm text-zinc-200">
                        {liveAnalysis.suggestedResponse || 'Monitoring channel and ready to assist.'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                      Awaiting input...
                    </div>
                  )}
                </div>
              </div>

              {/* Volunteer Phone (matches codeThisUI style) */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-[380px] h-[760px] bg-[#0b0b0f] rounded-[3rem] border-[12px] border-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/60 rounded-full"></div>
                  <div className="h-full flex flex-col">
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-black/70 backdrop-blur">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">SafetyNet Responder</p>
                        <p className="text-lg font-black flex items-center gap-2">
                          {volunteers[0]?.name || 'On Duty'}
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-violet-200">
                        Mesh Active
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                      {/* Tabs */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-2 bg-zinc-900 border border-white/5 rounded-full p-1">
                          {(['feed', 'map', 'history'] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setVolunteerTab(tab)}
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                volunteerTab === tab ? 'bg-white text-black shadow' : 'text-zinc-400'
                              }`}
                            >
                              {tab === 'feed' ? 'Queue' : tab === 'map' ? 'Map' : 'History'}
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-zinc-500">Live</span>
                      </div>

                      {volunteerTab === 'feed' && (
                        <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3">
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-violet-300">Live Queue</p>
                              <span className="text-[10px] text-zinc-400">{incidents.slice(0, 4).length} nearby</span>
                            </div>
                            <div className="space-y-3">
                              {incidents.slice(0, 4).map((inc) => (
                                <div key={inc._id} className="bg-zinc-900 border border-white/10 rounded-2xl p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r ${
                                        categoryColors[inc.category] || categoryColors.other
                                      } text-white`}
                                    >
                                      {inc.category.replace('_', ' ')}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                        inc.urgency >= 8 ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-black'
                                      }`}
                                    >
                                      {inc.urgency}/10
                                    </span>
                                  </div>
                                  <p className="text-[12px] text-zinc-200 leading-tight">"{inc.message}"</p>
                                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              ))}
                              {incidents.length === 0 && (
                                <div className="text-[11px] text-zinc-500 text-center py-6 border border-dashed border-white/10 rounded-xl">
                                  Awaiting first incident...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {volunteerTab === 'map' && (
                        <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-5 space-y-4">
                          {acceptedDispatch ? (
                            <>
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Active Mission</p>
                                  <p className="text-xl font-black text-white">{acceptedDispatch.incident.category.replace('_', ' ')}</p>
                                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                                    "{acceptedDispatch.incident.message}"
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-zinc-500 uppercase">ETA</p>
                                  <p className="text-lg font-black text-white">{Math.ceil(volunteerDistance * 2.5)} MIN</p>
                                </div>
                              </div>
                              <div className="h-44 bg-zinc-800 rounded-2xl relative overflow-hidden border border-white/5">
                                <div
                                  className="absolute inset-0 opacity-20"
                                  style={{
                                    backgroundImage:
                                      'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                  }}
                                ></div>
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                                  <path
                                    d="M40 160 L100 120 L160 40"
                                    stroke="#7c3aed"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray="10 5"
                                    className="animate-[dash_2s_linear_infinite]"
                                  />
                                  <circle cx="40" cy="160" r="6" fill="#10b981" />
                                  <circle cx="160" cy="40" r="8" fill="#f43f5e" className="animate-pulse" />
                                </svg>
                                <style>{`@keyframes dash { to { stroke-dashoffset: -15; } }`}</style>
                                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur px-3 py-1 rounded-lg text-[9px] font-black">
                                  NAVIGATING TO USER
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-zinc-500 text-sm py-16">No active mission</div>
                          )}
                        </div>
                      )}

                      {volunteerTab === 'history' && (
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mission Archive</p>
                          <div className="space-y-3">
                            {incidents.filter((i) => i.status === 'resolved').slice(0, 5).map((inc) => (
                              <div key={inc._id} className="bg-zinc-900/70 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-bold text-white">{inc.category.replace('_', ' ')}</p>
                                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{inc.status}</p>
                                </div>
                                <span className="text-[10px] text-zinc-400">{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            ))}
                            {incidents.filter((i) => i.status === 'resolved').length === 0 && (
                              <div className="text-[11px] text-zinc-500 text-center py-6 border border-dashed border-white/10 rounded-xl">
                                No resolved incidents tonight
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'community' && (
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Predicted Tonight', val: 'HIGH RISK', sub: 'Beasley Hub Sector 4', color: 'text-rose-400' },
                    { label: 'Mesh Nodes On-Duty', val: `${volunteers.filter((v) => v.onDuty).length || 0} Active`, sub: '92% Coverage', color: 'text-violet-300' },
                    { label: 'Avg Peer Response', val: '6m 20s', sub: '12% faster than 911', color: 'text-emerald-300' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{kpi.label}</p>
                      <p className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</p>
                      <p className="text-[11px] text-zinc-500 mt-1">{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-[2rem] p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Real-Time Risk Landscape</p>
                      <p className="text-lg font-black text-white">Toronto Heatmap</p>
                    </div>
                    {isHighRiskTime && (
                      <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-[10px] font-black text-red-200 uppercase tracking-[0.2em] animate-pulse">
                        High Risk Window
                      </span>
                    )}
                  </div>
                  <div className="h-[400px]">
                    <TorontoSafetyMap />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Predictive Safety Intelligence</p>
                      <p className="text-sm text-zinc-300">Synthesized via Gemini</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-red-900/30 border border-red-500/40 rounded-2xl p-3">
                      <p className="text-xs font-black text-red-200">High Risk • Friday 10PM-2AM</p>
                      <p className="text-[11px] text-red-100/80">Main St & James • Expect 15-20 incidents tonight.</p>
                    </div>
                    <div className="bg-amber-900/30 border border-amber-500/40 rounded-2xl p-3">
                      <p className="text-xs font-black text-amber-200">Medium Risk • Sat 9PM-1AM</p>
                      <p className="text-[11px] text-amber-100/80">Bar district • Increased harassment reports.</p>
                    </div>
                    <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-2xl p-3">
                      <p className="text-xs font-black text-emerald-200">Low Risk • Weeknights</p>
                      <p className="text-[11px] text-emerald-100/80">Routine patrols and check-ins.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Recent Incidents</p>
                    <span className="text-[10px] text-zinc-500">Live</span>
                  </div>
                  <div className="space-y-3">
                    {incidents.slice(0, 6).map((inc) => (
                      <div key={inc._id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r ${
                            categoryColors[inc.category] || categoryColors.other
                          } text-white`}
                        >
                          {inc.category.replace('_', ' ')}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-white leading-tight line-clamp-2">"{inc.message}"</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                            {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                            inc.policeInvolved ? 'bg-red-900/60 text-red-200' : 'bg-emerald-900/60 text-emerald-200'
                          }`}
                        >
                          {inc.policeInvolved ? '🚔' : '👥'}
                        </span>
                      </div>
                    ))}
                    {incidents.length === 0 && (
                      <div className="text-[11px] text-zinc-500 text-center py-6 border border-dashed border-white/10 rounded-xl">
                        No incidents yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Audit Trail</p>
                  <div className="space-y-3">
                    {incidents.slice(0, 4).map((inc) => (
                      <div key={inc._id} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white truncate">{inc.category.replace('_', ' ')}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{inc.status}</p>
                        </div>
                        <span className="text-[10px] text-zinc-400">{new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))}
                    {incidents.length === 0 && (
                      <div className="text-[11px] text-zinc-500 text-center py-6 border border-dashed border-white/10 rounded-xl">
                        No history yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Live Incidents</p>
                    <p className="text-3xl font-black">{stats?.total || incidents.length}</p>
                    <p className="text-xs text-zinc-500">Last 30 entries</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Community Resolved</p>
                    <p className="text-3xl font-black text-emerald-400">{communityResolved}</p>
                    <p className="text-xs text-zinc-500">{communityPercent}% without police</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Police Involved</p>
                    <p className="text-3xl font-black text-red-400">{policeInvolved}</p>
                    <p className="text-xs text-zinc-500">Flagged escalations</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Volunteers on Duty</p>
                    <p className="text-3xl font-black text-violet-300">{volunteers.filter((v) => v.onDuty).length || 0}</p>
                    <p className="text-xs text-zinc-500">Active mesh nodes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="h-12 border-t border-white/5 flex items-center justify-between px-4 lg:px-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-black/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Mesh encrypted • {volunteers.filter((v) => v.onDuty).length || 0} volunteers live
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">System v1.4.2</span>
          <span>SafetyNet Protocol</span>
        </div>
      </footer>

      {showFakeCall && <FakeCall onEnd={() => setShowFakeCall(false)} />}
    </div>
  );
};

export default App;
