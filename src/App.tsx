import React, { useState, useEffect } from 'react';
import {
  Mic,
  BookOpen,
  Code,
  Camera,
  Settings,
  Sparkles,
  Download,
  Shield,
  Layers,
  Cpu,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { LiveAssistantView } from './components/LiveAssistantView';
import { MasterclassView } from './components/MasterclassView';
import { CodebaseBrowser } from './components/CodebaseBrowser';
import { CameraXFaceDetectionModal } from './components/CameraXFaceDetectionModal';
import { SettingsModal } from './components/SettingsModal';
import { DownloadModal } from './components/DownloadModal';
import { ChatMessage, LanguageCode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'assistant' | 'masterclass' | 'codebase'>('assistant');
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(true);

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('jenifer_lang') as LanguageCode) || 'en';
  });

  const [speechRate, setSpeechRate] = useState<number>(() => {
    return parseFloat(localStorage.getItem('jenifer_speech_rate') || '1.0');
  });

  const [speechPitch, setSpeechPitch] = useState<number>(() => {
    return parseFloat(localStorage.getItem('jenifer_speech_pitch') || '1.0');
  });

  // Load chat history from localStorage to simulate Room database
  const [history, setHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('jenifer_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'init_1',
        role: 'assistant',
        content:
          'Hello! I am Jenifer, your personal AI voice assistant on Android. You can speak to me or type your questions. Try asking me to open YouTube, check your battery, or explain coding concepts in simple Hindi!',
        timestamp: 'Just now',
        language: 'en',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('jenifer_chat_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('jenifer_lang', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem('jenifer_speech_rate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    localStorage.setItem('jenifer_speech_pitch', speechPitch.toString());
  }, [speechPitch]);

  const handleAddMessage = (msg: ChatMessage) => {
    setHistory((prev) => [...prev, msg]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('jenifer_chat_history');
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-[#070b1a]/95 backdrop-blur-md border-b border-indigo-950/60 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo & Persona */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <div className="w-full h-full bg-[#070b19] rounded-[14px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-wide text-white">JENIFER</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Android AI Voice Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Jetpack Compose • Android SpeechRecognizer • CameraX ML Kit • Gemini Brain
              </p>
            </div>
          </div>

          {/* Primary View Navigation Tabs */}
          <nav className="flex items-center bg-[#0d1633] border border-indigo-500/20 rounded-2xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Live Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('masterclass')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'masterclass'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>9-Phase Masterclass</span>
            </button>

            <button
              onClick={() => setActiveTab('codebase')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'codebase'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Android Studio Code</span>
            </button>
          </nav>

          {/* Action Modals Trigger */}
          <div className="flex items-center gap-2">
            {/* Prominent Download App Button */}
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download App</span>
            </button>

            <button
              onClick={() => setIsCameraModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden md:inline">CameraX ML Kit</span>
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Assistant Settings & Permissions"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col overflow-hidden">
        {activeTab === 'assistant' && (
          <LiveAssistantView
            onOpenCamera={() => setIsCameraModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenDownload={() => setIsDownloadModalOpen(true)}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            speechRate={speechRate}
            speechPitch={speechPitch}
            history={history}
            onAddMessage={handleAddMessage}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === 'masterclass' && <MasterclassView />}

        {activeTab === 'codebase' && <CodebaseBrowser />}
      </main>

      {/* Download App & Project Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* CameraX & ML Kit Face Detection Modal */}
      <CameraXFaceDetectionModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
      />

      {/* Settings & Privacy Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        speechRate={speechRate}
        onSpeechRateChange={setSpeechRate}
        speechPitch={speechPitch}
        onSpeechPitchChange={setSpeechPitch}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
