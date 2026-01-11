
import React, { useState, useEffect, useRef } from 'react';
import { analyzeSmsUrgency } from '../services/geminiService';
import { SmsMessage } from '../types';

interface SmsSimulatorProps {
  onIncidentTriggered: (details: any) => void;
  onCallRequested: () => void;
}

type FlowStep = 'initial' | 'menu' | 'location' | 'action' | 'dispatching';

const SmsSimulator: React.FC<SmsSimulatorProps> = ({ onIncidentTriggered, onCallRequested }) => {
  const [messages, setMessages] = useState<SmsMessage[]>([
    { id: 'start', sender: 'system', text: "SafetyNet HER: You're safe to text here. Type 'UNSAFE' if you need help.", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState<FlowStep>('initial');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender: 'user' | 'system', text: string) => {
    setMessages(prev => [...prev, { id: Math.random().toString(), sender, text, timestamp: new Date() }]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    addMessage('user', text);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);
      const lowerText = text.toLowerCase();
      
      if (lowerText === 'unsafe' || step === 'initial') {
        setStep('menu');
        addMessage('system', "You're safe to text here. What’s happening?\n\n1) Someone following me\n2) Feeling threatened where I am\n3) Need to leave now\n4) Check-in / stay with me\n5) Emergency now\n\nReply 1-5");
      } 
      else if (step === 'menu') {
        setStep('location');
        addMessage('system', "Okay. I can help. Share location?\n\nReply:\nA) YES (send pin)\nB) NO (describe location)");
      }
      else if (step === 'location') {
        setStep('action');
        addMessage('system', "Quick options:\n\nA) Send volunteer escort\nB) Call me (fake urgent call)\nC) Stay on text & check in\nD) Emergency help\n\nReply A, B, C, or D");
      }
      else if (step === 'action') {
        if (text.toUpperCase() === 'B') {
          onCallRequested();
          addMessage('system', "✓ Call incoming now. Use this to exit safely.");
        } else {
          setStep('dispatching');
          addMessage('system', "✓ Volunteer dispatched: Sarah (ETA 4 min)\nMeet near: Tim Hortons (2 min away)\n\nCheck-in in 5 minutes. Reply OK if safe.");
          onIncidentTriggered({ id: '1042', text: "User needs escort", analysis: { urgency: 9, category: 'FOLLOWED' } });
        }
      }
      else {
        const analysis = await analyzeSmsUrgency(text);
        if (analysis) {
          addMessage('system', `Understood. ${analysis.recommended_action === 'phone_call' ? 'I can initiate a check-in call if you wish.' : 'A volunteer is monitoring this line.'}`);
        } else {
          addMessage('system', "I'm listening. Tell me what's happening.");
        }
      }
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[9/19] bg-gradient-to-b from-[#e2e2e7] via-[#d1d1d6] to-[#e2e2e7] rounded-[3.5rem] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.1)] border-[4px] border-[#a1a1aa] ring-1 ring-white/20 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-700">
      
      {/* Side Buttons (Simulated) */}
      <div className="absolute left-[-2px] top-24 w-[3px] h-12 bg-[#a1a1aa] rounded-r-sm"></div>
      <div className="absolute left-[-2px] top-40 w-[3px] h-16 bg-[#a1a1aa] rounded-r-sm"></div>
      <div className="absolute left-[-2px] top-60 w-[3px] h-16 bg-[#a1a1aa] rounded-r-sm"></div>
      <div className="absolute right-[-2px] top-40 w-[3px] h-24 bg-[#a1a1aa] rounded-l-sm"></div>

      {/* Internal Bezel */}
      <div className="flex-1 bg-white rounded-[2.8rem] overflow-hidden flex flex-col relative text-black shadow-inner border-[6px] border-black">
        
        {/* Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-end pr-4">
           <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
        </div>

        {/* Header - Light Mode */}
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

        {/* Message Feed - Light Mode */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-6 space-y-3 bg-white scroll-smooth no-scrollbar">
          <div className="flex justify-center mb-6">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Today 9:41 PM</span>
          </div>

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-300`}>
              <div className={`max-w-[82%] p-2.5 px-4 text-[14px] leading-[1.35] ${
                m.sender === 'user' 
                  ? 'bg-[#007AFF] text-white rounded-[18px] rounded-br-[4px] font-normal shadow-sm' 
                  : 'bg-[#E9E9EB] text-black rounded-[18px] rounded-bl-[4px] font-normal shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-[#E9E9EB] p-2.5 px-4 rounded-[18px] rounded-bl-[4px] flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar - Light Mode */}
        <div className="px-3 pb-8 pt-2 bg-white flex gap-2 items-center border-t border-zinc-100">
          <button className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors">
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
          <div className="flex-1 relative flex items-center">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="iMessage"
              className="w-full bg-white border border-zinc-200 rounded-full py-2 px-4 pr-10 focus:outline-none text-[15px] text-black placeholder-zinc-400 transition-all focus:border-zinc-300"
            />
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`absolute right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                inputText.trim() ? 'bg-[#007AFF] text-white' : 'bg-zinc-100 text-zinc-300'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default SmsSimulator;
