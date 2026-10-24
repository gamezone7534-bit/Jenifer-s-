import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Camera,
  Battery,
  BatteryCharging,
  Settings,
  Sparkles,
  Phone,
  MessageSquare,
  Globe,
  Info,
  Layers,
  Download,
  Clock,
} from 'lucide-react';
import { VoiceOrbCanvas } from './VoiceOrbCanvas';
import { SoundWaveform } from './SoundWaveform';
import { PhoneActionsDispatcher } from './PhoneActionsDispatcher';
import { AssistantState, ChatMessage, LanguageCode, AndroidAction } from '../types';

interface LiveAssistantViewProps {
  onOpenCamera: () => void;
  onOpenSettings: () => void;
  onOpenDownload?: () => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  speechRate: number;
  speechPitch: number;
  history: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onClearHistory: () => void;
}

export const LiveAssistantView: React.FC<LiveAssistantViewProps> = ({
  onOpenCamera,
  onOpenSettings,
  onOpenDownload,
  selectedLanguage,
  onLanguageChange,
  speechRate,
  speechPitch,
  history,
  onAddMessage,
  onClearHistory,
}) => {
  const [uiState, setUiState] = useState<AssistantState>('idle');
  const [inputText, setInputText] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastResponse, setLastResponse] = useState<string>(
    selectedLanguage === 'hi'
      ? 'नमस्ते! मैं जेनिफर हूँ, आपकी पर्सनल AI वॉइस असिस्टेंट। माइक्रोफ़ोन दबाकर बात करें या नीचे टाइप करें।'
      : selectedLanguage === 'ne'
      ? 'नमस्ते! म जेनिफर हुँ, तपाईंको व्यक्तिगत AI भ्वाइस सहायक। कुरा गर्न माइक थिच्नुहोस्।'
      : "Hi! I'm Jenifer, your personal AI voice assistant on Android. Tap the glowing orb or microphone to speak!"
  );

  const [activeAction, setActiveAction] = useState<AndroidAction | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<{ level: number; charging: boolean } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Read Real Battery Status API if supported
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const update = () => {
          setBatteryInfo({
            level: Math.round(battery.level * 100),
            charging: battery.charging,
          });
        };
        update();
        battery.addEventListener('levelchange', update);
        battery.addEventListener('chargingchange', update);
      });
    } else {
      // Realistic default battery level
      setBatteryInfo({ level: 86, charging: true });
    }
  }, []);

  // Auto-scroll chat transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, uiState]);

  // Text-To-Speech function using browser SpeechSynthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    // Pick suitable voice for selected language
    const voices = window.speechSynthesis.getVoices();
    if (selectedLanguage === 'hi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
      if (hiVoice) utterance.voice = hiVoice;
    } else if (selectedLanguage === 'ne') {
      utterance.lang = 'ne-NP';
      const neVoice = voices.find((v) => v.lang.startsWith('ne'));
      if (neVoice) utterance.voice = neVoice;
    } else {
      utterance.lang = 'en-US';
      const enVoice = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      setUiState('speaking');
    };
    utterance.onend = () => {
      setUiState('idle');
    };
    utterance.onerror = () => {
      setUiState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setUiState('idle');
  };

  // Start Voice Recognition (Web Speech API)
  const startListening = () => {
    stopSpeaking();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use the text input below.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Language code
    recognition.lang =
      selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'ne' ? 'ne-NP' : 'en-US';

    recognition.onstart = () => {
      setUiState('listening');
      setAudioLevel(0.4);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          setAudioLevel(0.7 + Math.random() * 0.3);
        }
      }
      if (finalTranscript.trim()) {
        handleUserQuery(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('SpeechRecognition error:', event.error);
      setUiState('idle');
      setAudioLevel(0);
    };

    recognition.onend = () => {
      if (uiState === 'listening') {
        setUiState('idle');
      }
      setAudioLevel(0);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Send query to Gemini AI Backend
  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Add user message to history
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
    };
    onAddMessage(userMsg);
    setInputText('');
    setUiState('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          language: selectedLanguage,
          history: history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
          deviceInfo: {
            battery: batteryInfo?.level,
            charging: batteryInfo?.charging,
          },
        }),
      });

      const data = await response.json();
      const reply = data.text || 'I understood your command.';
      setLastResponse(reply);

      let action: AndroidAction | null = null;
      if (data.actions && data.actions.length > 0) {
        action = {
          name: data.actions[0].name,
          args: data.actions[0].args || {},
          status: 'pending',
        };
        setActiveAction(action);
      }

      // Add assistant response to history
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
        actionCall: action || undefined,
      };
      onAddMessage(assistantMsg);

      // Speak answer aloud
      speakText(reply);
    } catch (err: any) {
      console.error('Chat error:', err);
      setUiState('error');
      const errReply = 'Sorry, I lost connection to my brain. Please try again.';
      setLastResponse(errReply);
      speakText(errReply);
    }
  };

  const handleActionConfirm = (action: AndroidAction) => {
    setActiveAction((prev) => (prev ? { ...prev, status: 'executed' } : null));
  };

  const handleActionCancel = (action: AndroidAction) => {
    setActiveAction((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
  };

  const quickPrompts = [
    { label: 'Open YouTube', prompt: 'Open YouTube app' },
    { label: 'Check Battery', prompt: 'Check device battery percentage' },
    { label: 'Call (+1234567890)', prompt: 'Call +1234567890 on the phone' },
    { label: 'Open Camera', prompt: 'Open the camera to take a photo' },
    { label: 'Directions to Tokyo', prompt: 'Show directions to Tokyo on maps' },
    { label: 'सरल हिंदी में समझाओ', prompt: 'क्वांटम कंप्यूटर क्या होता है सरल हिंदी में समझाओ' },
    { label: 'नेपालीमा समाचार', prompt: 'आजको ताजा मौसम र खबर के छ?' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full max-w-7xl mx-auto items-stretch">
      {/* Left: Android Assistant Phone Mockup */}
      <div className="w-full lg:w-[420px] shrink-0 flex flex-col rounded-3xl bg-[#090f26] border-2 border-indigo-500/30 shadow-[0_0_50px_rgba(30,27,75,0.7)] overflow-hidden relative">
        {/* Android Status Bar */}
        <div className="px-5 py-2.5 bg-[#060a1a] flex items-center justify-between text-xs text-slate-400 font-mono border-b border-indigo-900/30">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentTime}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-sans">
              5G
            </span>
            <div className="flex items-center gap-1">
              {batteryInfo?.charging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-[11px] font-bold text-slate-200">
                {batteryInfo ? `${batteryInfo.level}%` : '85%'}
              </span>
            </div>
          </div>
        </div>

        {/* Assistant Header */}
        <div className="px-5 py-3 flex items-center justify-between bg-gradient-to-b from-[#0b1330] to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
            <h2 className="text-sm font-bold text-white tracking-wide">JENIFER</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
              v1.0 Compose
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onOpenDownload && (
              <button
                onClick={onOpenDownload}
                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-white transition-colors cursor-pointer border border-emerald-500/30"
                title="Download App / Export Android Project"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenCamera}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 hover:text-white transition-colors cursor-pointer border border-cyan-500/20"
              title="CameraX & ML Kit Face Detection"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-400 hover:text-white transition-colors cursor-pointer border border-purple-500/20"
              title="Settings & Permissions"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Glowing Voice Orb */}
        <div className="relative flex-1 flex flex-col items-center justify-center py-6 px-4">
          <div
            onClick={uiState === 'listening' ? () => recognitionRef.current?.stop() : startListening}
            className="cursor-pointer group relative"
            title="Click or Tap to Speak"
          >
            <VoiceOrbCanvas state={uiState} audioLevel={audioLevel} size={230} />

            {/* Glowing Touch Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  uiState === 'listening'
                    ? 'bg-cyan-500/30 text-cyan-300 scale-110 shadow-[0_0_25px_#22d3ee]'
                    : uiState === 'speaking'
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'bg-indigo-500/20 text-indigo-200 group-hover:scale-105'
                }`}
              >
                {uiState === 'listening' ? (
                  <Mic className="w-7 h-7 text-cyan-300 animate-pulse" />
                ) : uiState === 'speaking' ? (
                  <Volume2 className="w-7 h-7 text-emerald-300 animate-pulse" />
                ) : (
                  <Mic className="w-7 h-7 text-indigo-300" />
                )}
              </div>
            </div>
          </div>

          {/* Assistant State Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
                uiState === 'listening'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 animate-pulse'
                  : uiState === 'thinking'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 animate-pulse'
                  : uiState === 'speaking'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : uiState === 'error'
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}
            >
              {uiState === 'listening' && 'Listening to Voice...'}
              {uiState === 'thinking' && 'Processing Brain...'}
              {uiState === 'speaking' && 'Speaking Response...'}
              {uiState === 'error' && 'Network Error'}
              {uiState === 'idle' && 'Tap Orb to Speak'}
            </span>
          </div>

          {/* Sound Waveform Equalizer */}
          <div className="w-full max-w-xs mt-2">
            <SoundWaveform isActive={uiState === 'listening' || uiState === 'speaking'} />
          </div>

          {/* Last Spoken Response Bubble */}
          <div className="w-full px-4 mt-3">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed shadow-lg relative group">
              <p className="line-clamp-3">{lastResponse}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Sparkles className="w-3 h-3" /> Jenifer Voice
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText(lastResponse)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Repeat Voice Output"
                  >
                    <RotateCcw className="w-3 h-3" /> Repeat
                  </button>
                  {uiState === 'speaking' && (
                    <button
                      onClick={stopSpeaking}
                      className="hover:text-rose-400 flex items-center gap-1 cursor-pointer text-rose-300"
                      title="Stop Speaking"
                    >
                      <VolumeX className="w-3 h-3" /> Stop
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Action Execution Card (if triggered) */}
        {activeAction && (
          <div className="px-4 pb-2">
            <PhoneActionsDispatcher
              action={activeAction}
              onConfirm={handleActionConfirm}
              onCancel={handleActionCancel}
            />
          </div>
        )}

        {/* Text Input / Voice Action Bar */}
        <div className="p-4 bg-[#070b1a] border-t border-indigo-900/40 flex items-center gap-2">
          <button
            onClick={uiState === 'listening' ? () => recognitionRef.current?.stop() : startListening}
            className={`p-3 rounded-2xl transition-all cursor-pointer ${
              uiState === 'listening'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_#f43f5e]'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md'
            }`}
            title="Toggle Voice Input"
          >
            {uiState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(inputText);
            }}
            className="flex-1 flex items-center gap-2 bg-slate-900/90 border border-slate-700 rounded-2xl px-3.5 py-1.5 focus-within:border-cyan-400 transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedLanguage === 'hi'
                  ? 'जेनिफर से कुछ भी पूछें या कमांड दें...'
                  : selectedLanguage === 'ne'
                  ? 'जेनिफरलाई केही सोध्नुहोस्...'
                  : 'Ask Jenifer anything or command...'
              }
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || uiState === 'thinking'}
              className="p-1.5 rounded-xl bg-cyan-600/80 hover:bg-cyan-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right: Interactive Conversation History & Phone Action Logs */}
      <div className="flex-1 flex flex-col rounded-3xl bg-[#090f26] border border-slate-800 overflow-hidden shadow-xl">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#0b1330] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Room Database Conversation Log
            </h3>
            <p className="text-xs text-slate-400">
              Live SQLite Room Entity records • Local-only storage
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Pill Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  selectedLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  selectedLanguage === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('ne')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  selectedLanguage === 'ne' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                नेपाली
              </button>
            </div>

            <button
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Clear Log
            </button>
          </div>
        </div>

        {/* Quick Voice Command Pills */}
        <div className="px-5 py-2.5 bg-[#070b1a] border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Try:
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleUserQuery(item.prompt)}
              className="shrink-0 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Conversation Transcript Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <Mic className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-white">No conversation turns yet</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Speak by tapping the glowing voice orb, or type any command to see Jenifer execute
                Android intents and voice responses in real time.
              </p>
            </div>
          ) : (
            history.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                } space-y-1`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono px-1">
                  <span>{msg.role === 'user' ? 'You (Voice Input)' : 'Jenifer Assistant'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p>{msg.content}</p>

                  {/* If action was attached */}
                  {msg.actionCall && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                        <span>⚡ Tool Executed:</span>
                        <span className="font-bold underline">{msg.actionCall.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 px-1 pt-0.5 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" /> Speak this response
                  </button>
                )}
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
};
