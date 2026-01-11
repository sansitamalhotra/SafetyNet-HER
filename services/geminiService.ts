**geminiService.ts**



import { Incident } from "../types";
/**
 * Frontend Gemini is disabled for security + stability.
 * All Gemini calls should happen on the backend.
 */
export const analyzeSmsUrgency = async (_text: string) => {
  // TODO: call backend endpoint instead (recommended)
  // Example:
  // const res = await fetch("http://localhost:3001/api/analyze", { ... })
  // return await res.json();
  return {
    urgency: 7,
    category: "general_fear",
    recommended_action: "safety_check",
    sentiment: "fear",
    demo: true,
  };
};
export const getPredictiveInsights = async (_incidents: Incident[]) => {
  // Demo-safe placeholder
  return [
    {
      pattern: "Fridays 10pm–2am spike",
      risk: "High harassment risk",
      when: "Fri/Sat nights 10pm–2am",
      where: "Main St bar district",
      prevention: "Pre-position 2 volunteers near Main & Jackson",
    },
  ];
};