  import React, { useEffect, useRef, useState } from "react";
  const DEMO_SECONDS = 12;
  type Props = {
    onEnd: () => void;
  };
  const FakeCall: React.FC<Props> = ({ onEnd }) => {
    const [status, setStatus] = useState<"ringing" | "playing" | "done" | "error">(
      "ringing"
    );
    const [secondsLeft, setSecondsLeft] = useState(DEMO_SECONDS);
    const [showFollowup, setShowFollowup] = useState(false);
    const [choice, setChoice] = useState<null | 1 | 2>(null);
    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
    let cancelled = false;
    async function startCall() {
      try {
        setStatus("ringing");
        setShowFollowup(false);
        setChoice(null);
        // Small ring delay
        await new Promise((r) => setTimeout(r, 800));
        if (cancelled) return;
        const res = await fetch("http://localhost:3001/api/voice/fake-call", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text:
              "Hey! Oh my god, I've been trying to reach you! " +
              "There's a family emergency—you need to come home RIGHT NOW. " +
              "No, it can't wait. I need you here in 20 minutes. Okay—see you soon. Hurry!",
          }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `Backend error ${res.status}`);
        }
        const buf = await res.arrayBuffer();
        const blob = new Blob([buf], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        setStatus("playing");
        setSecondsLeft(DEMO_SECONDS);
        // start countdown
        timerRef.current = window.setInterval(() => {
          setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);
        await audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(url);
          // stop timer
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setStatus("done");
          setShowFollowup(true);
        };
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }
    startCall();
    return () => {
      cancelled = true;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onEnd]);

    useEffect(() => {
      if (status === "playing" && secondsLeft === 0) {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setStatus("done");
        setShowFollowup(true);
      }
    }, [secondsLeft, status]);

    return (
      <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-6 text-white shadow-2xl">
  <div className="flex items-center justify-between">
    <div className="text-xs uppercase tracking-widest text-zinc-400 font-black">
      Fake Call
    </div>
    {status === "playing" && (
      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
        ⏱ {secondsLeft}s
      </div>
    )}
  </div>
          <div className="mt-3 text-2xl font-black">
            {status === "ringing" && "📞 Incoming call…"}
            {status === "playing" && "📞 Call in progress…"}
            {status === "done" && "✅ Call ended"}
            {status === "error" && "❌ Call failed"}
          </div>
          <div className="mt-4 text-sm text-zinc-400">
            {status === "ringing" && "Hold on — generating voice…"}
            {status === "playing" && "Stay calm. Use this as an excuse to leave."}
            {status === "done" && "Are you safe now?"}
            {status === "error" && "Check backend is running on :3001"}
          </div>
          {showFollowup && (
    <div className="mt-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">
        SMS from SafetyNet HER
      </div>
      <div className="mt-2 text-sm">
        Are you safe now?
        <div className="mt-2 text-zinc-300">
          <div>1 = Yes, I’m safe</div>
          <div>2 = I need help</div>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => { setChoice(1); setTimeout(onEnd, 900); }}
          className="flex-1 bg-green-600/90 hover:bg-green-600 border border-green-500 rounded-xl py-2 text-xs font-black uppercase tracking-widest"
        >
          1
        </button>
        <button
          onClick={() => { setChoice(2); setTimeout(onEnd, 900); }}
          className="flex-1 bg-red-600/90 hover:bg-red-600 border border-red-500 rounded-xl py-2 text-xs font-black uppercase tracking-widest"
        >
          2
        </button>
      </div>
      {choice && (
        <div className="mt-3 text-xs text-zinc-400">
          Logged: {choice === 1 ? "SAFE ✅" : "NEEDS HELP 🚨"}
        </div>
      )}
    </div>
  )}

        <div className="mt-6 flex gap-3">
    <button
      onClick={() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onEnd();
      }}
      className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-2xl py-3 font-black text-xs uppercase tracking-widest"
    >
      End
    </button>
  </div>
        </div>
      </div>
    );
  };
  export default FakeCall;