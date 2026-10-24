import React, { useState } from 'react';
import { Phone, MessageSquare, Camera, Settings, MapPin, Battery, Clock, Play, Pause, SkipForward, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { AndroidAction } from '../types';

interface PhoneActionsDispatcherProps {
  action: AndroidAction | null;
  onConfirm: (action: AndroidAction) => void;
  onCancel: (action: AndroidAction) => void;
  onDirectTrigger?: (actionName: string, args: Record<string, any>) => void;
}

export const PhoneActionsDispatcher: React.FC<PhoneActionsDispatcherProps> = ({
  action,
  onConfirm,
  onCancel,
  onDirectTrigger,
}) => {
  const [isPlayingMedia, setIsPlayingMedia] = useState(false);

  if (!action) return null;

  // Determine intent name and dangerousness
  const isSensitive = action.name === 'open_dialer' || action.name === 'send_message';

  const getIntentSignature = () => {
    switch (action.name) {
      case 'open_app':
        return `Intent(Intent.ACTION_MAIN).setPackage("${action.args.appName || 'app'}")`;
      case 'open_dialer':
        return `Intent(Intent.ACTION_DIAL, Uri.parse("tel:${action.args.phoneNumber || ''}"))`;
      case 'send_message':
        return `Intent(Intent.ACTION_SENDTO, Uri.parse("smsto:${action.args.recipient || ''}"))`;
      case 'open_camera':
        return `Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA)`;
      case 'open_settings':
        return `Intent(Settings.ACTION_${(action.args.settingType || 'SETTINGS').toUpperCase()}_SETTINGS)`;
      case 'open_maps':
        return `Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=${encodeURIComponent(action.args.location || '')}"))`;
      case 'get_battery_info':
        return `IntentFilter(Intent.ACTION_BATTERY_CHANGED)`;
      case 'set_reminder':
        return `Intent(AlarmClock.ACTION_SET_TIMER)`;
      default:
        return `Android Intent: ${action.name}`;
    }
  };

  const executeBrowserAction = () => {
    switch (action.name) {
      case 'open_app': {
        const appName = (action.args.appName || '').toLowerCase();
        if (appName.includes('youtube')) window.open('https://youtube.com', '_blank');
        else if (appName.includes('whatsapp')) window.open('https://web.whatsapp.com', '_blank');
        else if (appName.includes('map')) window.open('https://maps.google.com', '_blank');
        else if (appName.includes('chrome')) window.open('https://google.com', '_blank');
        break;
      }
      case 'open_dialer':
        if (action.args.phoneNumber) {
          window.location.href = `tel:${action.args.phoneNumber}`;
        }
        break;
      case 'send_message':
        if (action.args.recipient) {
          window.location.href = `sms:${action.args.recipient}?body=${encodeURIComponent(action.args.message || '')}`;
        }
        break;
      case 'open_maps':
        if (action.args.location) {
          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(action.args.location)}`, '_blank');
        }
        break;
    }
    onConfirm(action);
  };

  return (
    <div className="my-2 p-3.5 rounded-xl bg-gradient-to-r from-slate-900/90 to-indigo-950/70 border border-indigo-500/30 shadow-lg text-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {action.name === 'open_dialer' && <Phone className="w-4 h-4 text-emerald-400" />}
          {action.name === 'send_message' && <MessageSquare className="w-4 h-4 text-cyan-400" />}
          {action.name === 'open_camera' && <Camera className="w-4 h-4 text-purple-400" />}
          {action.name === 'open_settings' && <Settings className="w-4 h-4 text-amber-400" />}
          {action.name === 'open_maps' && <MapPin className="w-4 h-4 text-rose-400" />}
          {action.name === 'get_battery_info' && <Battery className="w-4 h-4 text-emerald-400" />}
          {action.name === 'open_app' && <ExternalLink className="w-4 h-4 text-blue-400" />}

          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Android Action: {action.name.replace(/_/g, ' ')}
          </span>
        </div>

        {isSensitive && action.status === 'pending' && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] flex items-center gap-1 font-semibold border border-amber-500/30">
            <ShieldAlert className="w-3 h-3" /> Confirmation Required
          </span>
        )}
      </div>

      {/* Code Signature Box */}
      <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
        {getIntentSignature()}
      </div>

      {/* Action Details */}
      <div className="mt-2 text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(action.args).map(([key, value]) => (
          <div key={key}>
            <span className="text-slate-400">{key}: </span>
            <span className="font-medium text-white">{String(value)}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex items-center gap-2">
        {action.status === 'pending' ? (
          <>
            <button
              onClick={executeBrowserAction}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Confirm & Execute Intent
            </button>
            <button
              onClick={() => onCancel(action)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            ✓ Action executed successfully
          </span>
        )}
      </div>
    </div>
  );
};
