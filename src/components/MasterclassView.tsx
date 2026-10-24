import React, { useState } from 'react';
import { TEACHING_PHASES } from '../data/teachingPhases';
import { TeachingPhase } from '../types';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Code,
  Layers,
  Mic,
  Cpu,
  Volume2,
  Camera,
  Smartphone,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export const MasterclassView: React.FC = () => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(1);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  const currentPhase: TeachingPhase =
    TEACHING_PHASES.find((p) => p.id === selectedPhaseId) || TEACHING_PHASES[0];

  const getPhaseIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Layers className="w-4 h-4" />;
      case 2:
        return <Smartphone className="w-4 h-4" />;
      case 3:
        return <Mic className="w-4 h-4" />;
      case 4:
        return <Volume2 className="w-4 h-4" />;
      case 5:
        return <Cpu className="w-4 h-4" />;
      case 6:
        return <Smartphone className="w-4 h-4" />;
      case 7:
        return <Camera className="w-4 h-4" />;
      case 8:
        return <ShieldCheck className="w-4 h-4" />;
      case 9:
        return <Wrench className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080d22] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#0b132e] border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              9-Phase Android Assistant Masterclass
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                From Zero to Play Store APK
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'चरणबद्ध तरीके से सीखें: आर्किटेक्चर, स्पीच, AI, कैमरा और APK निर्माण'
                : 'Step-by-step guide: Architecture, Speech, AI, Camera, and APK release'}
            </p>
          </div>
        </div>

        {/* Language selector toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setLang('hi')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              lang === 'hi' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी / Hinglish
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              lang === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Grid: Phase Tabs on Left, Content on Right */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Phase Navigation Tabs */}
        <div className="w-full md:w-80 bg-[#060a1a] border-r border-slate-800/80 p-3 overflow-y-auto space-y-1.5 shrink-0 max-h-56 md:max-h-none">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Learning RoadMap (Phases 1 - 9)
          </div>
          {TEACHING_PHASES.map((phase) => {
            const isCurrent = phase.id === selectedPhaseId;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                    isCurrent
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {getPhaseIcon(phase.id)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold truncate">
                    Phase {phase.id}: {lang === 'hi' ? phase.titleHi.split(':')[1] || phase.titleHi : phase.titleEn.split(':')[1] || phase.titleEn}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {lang === 'hi' ? phase.subtitleHi : phase.subtitleEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#070b19]">
          {/* Phase Hero Title */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-purple-500/30">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
              Phase {currentPhase.id} of 9
            </span>
            <h1 className="text-lg md:text-xl font-extrabold text-white mt-1">
              {lang === 'hi' ? currentPhase.titleHi : currentPhase.titleEn}
            </h1>
            <p className="text-sm text-purple-200/90 mt-1">
              {lang === 'hi' ? currentPhase.subtitleHi : currentPhase.subtitleEn}
            </p>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-black/40 p-3 rounded-xl border border-purple-500/20">
              {lang === 'hi' ? currentPhase.summaryHi : currentPhase.summaryEn}
            </p>
          </div>

          {/* Special Interactive Architecture Flow Diagram for Phase 1 */}
          {currentPhase.id === 1 && (
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/60">
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                {lang === 'hi'
                  ? 'इंटरएक्टिव डेटा फ्लो डायग्राम (Architecture Diagram)'
                  : 'Interactive Architecture & Data Flow Diagram'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center">
                  <Mic className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="font-bold text-white">1. User Voice</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Microphone Input</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center">
                  <Smartphone className="w-5 h-5 text-indigo-400 mb-1" />
                  <span className="font-bold text-white">2. SpeechRecognizer</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Audio to Text</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center">
                  <Layers className="w-5 h-5 text-purple-400 mb-1" />
                  <span className="font-bold text-white">3. ViewModel</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">StateFlow Pipeline</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center">
                  <Cpu className="w-5 h-5 text-pink-400 mb-1" />
                  <span className="font-bold text-white">4. Gemini AI Proxy</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">gemini-3.8-flash</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center">
                  <Smartphone className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="font-bold text-white">5. ActionHandler</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Android Intents</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex flex-col items-center">
                  <Volume2 className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="font-bold text-white">6. TextToSpeech</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Spoken Output</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Concepts Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'hi' ? '🔑 मुख्य सिद्धांत (Key Concepts)' : '🔑 Core Architecture Concepts'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPhase.keyConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Step-by-Step Instructions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'hi' ? '📖 स्टेप-बाय-स्टेप ट्यूटोरियल' : '📖 Step-by-Step Implementation'}
            </h3>

            {currentPhase.detailedSteps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-xl bg-[#0b132e]/90 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-mono">
                      {step.stepNumber}
                    </span>
                    {lang === 'hi' ? step.titleHi : step.titleEn}
                  </h4>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs font-mono text-cyan-300">
                  📁 {lang === 'hi' ? 'कहाँ पेस्ट करें: ' : 'Where to paste: '}
                  {lang === 'hi' ? step.whereToPasteHi : step.whereToPasteEn}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'hi' ? step.explanationHi : step.explanationEn}
                </p>
              </div>
            ))}
          </div>

          {/* Common Pitfalls & Debugging Solutions */}
          {currentPhase.commonPitfalls.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {lang === 'hi'
                  ? '⚠️ आम गलतियाँ और समाधान (Troubleshooting)'
                  : '⚠️ Common Pitfalls & Solutions'}
              </h3>
              <div className="space-y-2.5">
                {currentPhase.commonPitfalls.map((pitfall, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 text-xs"
                  >
                    <div className="font-semibold text-amber-200">
                      ❌ {lang === 'hi' ? pitfall.problemHi : pitfall.problemEn}
                    </div>
                    <div className="text-slate-300 pl-4 border-l-2 border-emerald-500">
                      ✅ <strong className="text-emerald-400">Fix: </strong>
                      {lang === 'hi' ? pitfall.solutionHi : pitfall.solutionEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation to next phase */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            {selectedPhaseId > 1 && (
              <button
                onClick={() => setSelectedPhaseId(selectedPhaseId - 1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                ← Previous Phase
              </button>
            )}
            <div className="flex-1" />
            {selectedPhaseId < 9 && (
              <button
                onClick={() => setSelectedPhaseId(selectedPhaseId + 1)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                Next: Phase {selectedPhaseId + 1}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
