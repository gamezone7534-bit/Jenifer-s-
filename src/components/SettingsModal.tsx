import React, { useState } from 'react';
import { Settings, Shield, Mic, Camera, Bell, Phone, Trash2, CheckCircle2, AlertTriangle, Globe, Volume2 } from 'lucide-react';
import { LanguageCode, PermissionItem } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  speechPitch: number;
  onSpeechPitchChange: (pitch: number) => void;
  onClearHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onLanguageChange,
  speechRate,
  onSpeechRateChange,
  speechPitch,
  onSpeechPitchChange,
  onClearHistory,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [permissions, setPermissions] = useState<PermissionItem[]>([
    {
      id: 'mic',
      name: 'Microphone',
      manifestPermission: 'android.permission.RECORD_AUDIO',
      descriptionEn: 'Required for real-time speech recognition and voice commands.',
      descriptionHi: 'आवाज़ को पहचानने और वॉइस कमांड्स सुनने के लिए आवश्यक।',
      isGranted: true,
      isDangerous: true,
      whyNeededEn: 'Jenifer converts your voice into text commands using Android SpeechRecognizer.',
      whyNeededHi: 'जेनिफर आपकी बोली को टेक्स्ट में बदलने के लिए माइक का उपयोग करती है।',
    },
    {
      id: 'camera',
      name: 'Camera (CameraX & ML Kit)',
      manifestPermission: 'android.permission.CAMERA',
      descriptionEn: 'Required for live camera preview, landmark analysis, and optional local enrollment.',
      descriptionHi: 'लाइव कैमरा प्रीव्यू, फेस लैंडमार्क डिटेक्शन और लोकल इनरोलमेंट के लिए आवश्यक।',
      isGranted: true,
      isDangerous: true,
      whyNeededEn: 'Used only for on-device ML Kit face detection and taking photos upon user command.',
      whyNeededHi: 'केवल फोन पर लोकल फेस डिटेक्शन और यूज़र के कहने पर फोटो लेने के लिए इस्तेमाल होता है।',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      manifestPermission: 'android.permission.POST_NOTIFICATIONS',
      descriptionEn: 'Sends alarms, reminders, and completed task alerts.',
      descriptionHi: 'अलार्म, रिमाइंडर्स और टास्क पूरा होने की सूचना देने के लिए।',
      isGranted: true,
      isDangerous: false,
      whyNeededEn: 'Notifies you when a scheduled timer, task, or reminder finishes.',
      whyNeededHi: 'जब आपका टाइमर या रिमाइंडर पूरा हो जाए, तो आपको सूचित करने के लिए।',
    },
    {
      id: 'dialer',
      name: 'Phone Dialer & Intents',
      manifestPermission: 'Safe Intent: ACTION_DIAL',
      descriptionEn: 'Prefills phone numbers safely in your device dialer without direct calling.',
      descriptionHi: 'फोन डायलर में नंबर पहले से भरकर खोलता है (बिना यूज़र की मर्जी के कॉल नहीं करता)।',
      isGranted: true,
      isDangerous: false,
      whyNeededEn: 'Allows you to review the number and tap Call yourself, keeping calls safe.',
      whyNeededHi: 'सुरक्षा के लिए यूज़र खुद नंबर देखकर कॉल बटन दबा सकता है।',
    },
  ]);

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isGranted: !p.isGranted } : p))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0c142e] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b1a]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Settings & Privacy Safeguards</h2>
              <p className="text-xs text-slate-400">Language, voice engine, and Android permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" /> Assistant Language (भाषा)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onLanguageChange('en')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedLanguage === 'en'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>English</span>
                <span className="text-[10px] text-slate-400 font-normal">en-US</span>
              </button>

              <button
                onClick={() => onLanguageChange('hi')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedLanguage === 'hi'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                <span className="text-[10px] text-slate-400 font-normal">hi-IN</span>
              </button>

              <button
                onClick={() => onLanguageChange('ne')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  selectedLanguage === 'ne'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>नेपाली (Nepali)</span>
                <span className="text-[10px] text-slate-400 font-normal">ne-NP</span>
              </button>
            </div>
          </div>

          {/* TTS Speech Rate & Pitch */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-400" /> Voice Speed: {speechRate.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.6"
              step="0.1"
              value={speechRate}
              onChange={(e) => onSpeechRateChange(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-slate-300">
                Voice Pitch: {speechPitch.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.4"
              step="0.1"
              value={speechPitch}
              onChange={(e) => onSpeechPitchChange(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Android Permissions Manager */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" /> Android Runtime Permissions
            </label>
            <div className="space-y-2">
              {permissions.map((perm) => (
                <div
                  key={perm.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {perm.name}
                      <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                        {perm.manifestPermission}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{perm.whyNeededEn}</p>
                    <p className="text-[10px] text-indigo-300/80">हिन्दी: {perm.whyNeededHi}</p>
                  </div>

                  <button
                    onClick={() => togglePermission(perm.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      perm.isGranted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {perm.isGranted ? 'Granted' : 'Denied'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Clear Conversation History (Safeguard) */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-400" /> Clear Conversation History
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Wipes all local conversation transcripts and action records from Room Database.
                </p>
              </div>

              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearHistory();
                      setShowClearConfirm(false);
                    }}
                    className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#070b1a] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
