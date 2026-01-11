
import React, { useState, useEffect } from 'react';
import { getPredictiveInsights } from '../services/geminiService';
import { MOCK_INCIDENTS } from '../constants';
import { PredictiveInsight } from '../types';

const PredictiveLayer: React.FC = () => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const data = await getPredictiveInsights(MOCK_INCIDENTS);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-violet-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-500 font-bold uppercase tracking-widest text-[10px]">AI Neural Pattern Synthesis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* High Alert Banner */}
      <div className="bg-rose-50 border border-rose-200 p-6 rounded-[2rem] flex items-start gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-24 h-24 text-rose-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.28 14.1H3.72L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white text-xl shrink-0 shadow-lg shadow-rose-200">⚠️</div>
        <div className="relative z-10">
          <h4 className="text-rose-900 font-black uppercase tracking-widest text-[10px] mb-1">Critical Neighborhood Alert</h4>
          <p className="text-rose-800 font-bold text-lg leading-tight mb-2">Predicted High-Risk Window: 11 PM – 2 AM</p>
          <p className="text-rose-700 text-sm leading-relaxed max-w-xl">
            Pattern matching suggests increased harassment incidents near major transit hubs tonight. Community volunteers advised to cluster in 3-person nodes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-100 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
               <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                 insight.risk === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
               }`}>
                 Risk: {insight.risk}
               </div>
               <span className="text-slate-300 group-hover:text-violet-500 transition-colors">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               </span>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 group-hover:text-violet-600 transition-colors">
              {insight.pattern}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">🕒</div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase">When</p>
                   <p className="text-xs font-bold text-slate-700">{insight.when}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">📍</div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase">Where</p>
                   <p className="text-xs font-bold text-slate-700">{insight.where}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
               <p className="text-[9px] font-black text-violet-600 uppercase tracking-[0.2em] mb-2">Prevention Strategy</p>
               <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{insight.prevention}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveLayer;
