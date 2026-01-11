
import React, { useState, useEffect } from 'react';

interface FakeCallProps {
  onEnd: () => void;
}

const FakeCall: React.FC<FakeCallProps> = ({ onEnd }) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 w-full max-w-sm h-[600px] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col p-8 text-white border-4 border-zinc-800">
        <div className="text-center mt-20">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-lg shadow-violet-500/20">
            S
          </div>
          <h2 className="text-2xl font-bold mb-1">SafetyNet HER</h2>
          <p className="text-zinc-400 font-medium">Incoming Call...</p>
          <p className="text-violet-400 text-lg font-mono mt-4">{formatTime(timer)}</p>
        </div>

        <div className="mt-auto mb-16 space-y-8">
          <p className="text-center text-sm text-zinc-500 italic px-4">
            "Hey! Oh my god, I've been trying to reach you! There's a family emergency, you need to come home right now..."
          </p>
          
          <div className="flex justify-center gap-12">
            <button 
              onClick={onEnd}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
            </button>
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default FakeCall;
