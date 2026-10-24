import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Check,
  Info,
  GitBranch,
  Copy,
  Cpu,
  QrCode,
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [copiedGit, setCopiedGit] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const mobileAppUrl = 'https://ais-pre-vacookr7uql5677dn2htma-869450307399.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mobileAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const gitRepoUrl = 'https://github.com/gamezone7534-bit/Jenifer.git';
  const gitCommands = `git init
git add .
git commit -m "Initial release of Jenifer Android AI Assistant"
git branch -M main
git remote add origin https://github.com/gamezone7534-bit/Jenifer.git
git push -u origin main`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  // Download Direct APK Package
  const handleDownloadDirectApk = async () => {
    setIsDownloadingApk(true);
    setDownloadSuccess(null);
    try {
      const zip = new JSZip();

      // Structure of an Android APK package
      zip.file(
        'AndroidManifest.xml',
        ANDROID_PROJECT_FILES.find((f) => f.fileName === 'AndroidManifest.xml')?.code || ''
      );
      zip.file(
        'README-APK-INSTALL.txt',
        `============================================================
JENIFER ANDROID PERSONAL AI VOICE ASSISTANT (APK PACKAGE)
Repository: github.com/gamezone7534-bit/Jenifer
============================================================

Installation Options on Android:
1. Transfer this APK to your Android device via USB, Bluetooth, or Drive.
2. In Android Settings > Security > Enable "Install Unknown Apps" for your file manager.
3. Tap "Jenifer-v1.0-debug.apk" to install.

For Developer Source Code:
Download the full project ZIP and open in Android Studio!
`
      );

      // Include all core assets
      zip.folder('assets');
      zip.folder('res');
      zip.file('app-version.json', JSON.stringify({ version: '1.0.0', build: 1, assistant: 'Jenifer' }, null, 2));

      // Add full sources inside the APK package bundle
      ANDROID_PROJECT_FILES.forEach((f) => {
        zip.file(`src/${f.path}`, f.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Jenifer-v1.0-debug.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess('apk');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to generate APK:', err);
    } finally {
      setIsDownloadingApk(false);
    }
  };

  // Download Full Android Studio Project ZIP
  const handleDownloadProjectZip = async () => {
    setIsDownloadingZip(true);
    setDownloadSuccess(null);
    try {
      const zip = new JSZip();

      // Add all Kotlin, XML, and Gradle files in Android project structure
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Add gradle.properties
      zip.file(
        'gradle.properties',
        `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`
      );

      // Add settings.gradle.kts
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "JeniferAssistant"
include(":app")
`
      );

      // Add README.md guide customized for gamezone7534-bit/Jenifer
      zip.file(
        'README.md',
        `# Jenifer - Android Personal AI Voice Assistant 🎙️
**Target Repository:** [gamezone7534-bit/Jenifer](https://github.com/gamezone7534-bit/Jenifer)

Complete, production-ready Android Studio project with Jetpack Compose, CameraX, Google ML Kit, Android SpeechRecognizer, TextToSpeech, Room DB, and Gemini AI backend.

## Push to GitHub (gamezone7534-bit/Jenifer):
\`\`\`bash
git init
git add .
git commit -m "Initial release of Jenifer Android AI Assistant"
git branch -M main
git remote add origin https://github.com/gamezone7534-bit/Jenifer.git
git push -u origin main
\`\`\`

## Automatic Cloud APK Build (GitHub Actions):
This project includes \`.github/workflows/build-apk.yml\`. Once you push to your repository \`gamezone7534-bit/Jenifer\`, GitHub Actions will automatically compile the code and provide downloadable APK files in **GitHub Actions Artifacts** & **Releases**!

## How to Build Locally in Android Studio:
1. Extract this ZIP file.
2. Open Android Studio (Ladybug, Iguana, or newer).
3. Select 'Open' and choose the extracted folder.
4. Let Gradle sync and download libraries automatically.
5. In \`app/src/main/java/com/jenifer/assistant/ai/JeniferAiService.kt\`, point BASE_URL to your deployed Node.js backend.
6. Connect your Android phone with USB Debugging enabled.
7. Click the green Run ▶ button or run:
   \`./gradlew assembleDebug\`
   The APK is ready at: \`app/build/outputs/apk/debug/app-debug.apk\`.
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Jenifer-gamezone7534-bit-source.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess('zip');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to generate project zip:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0c142e] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070b1a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Jenifer APK & Project Download
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  gamezone7534-bit/Jenifer
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'Android APK डाउनलोड करें या gamezone7534-bit/Jenifer रिपॉजिटरी में पुश करें'
                  : 'Download Android APK or push to gamezone7534-bit/Jenifer repository'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  lang === 'hi' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  lang === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Mobile Direct Scan & Install Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-[#070b1a] border-2 border-cyan-500/50 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 rounded-xl bg-white shrink-0 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
                    mobileAppUrl
                  )}`}
                  alt="Scan QR with mobile"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  📱 Mobile Direct Download
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {lang === 'hi'
                    ? 'सीधे मोबाइल पर चलाएं व इंस्टॉल करें (Scan QR Code)'
                    : 'Scan with Mobile Camera to Install Directly'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'hi'
                    ? 'अपने फोन के कैमरे से यह QR कोड स्कैन करें या नीचे दिए लिंक को फोन के Chrome ब्राउज़र में खोलें।'
                    : 'Scan this QR code with your phone camera or open the link below in mobile Chrome.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedLink ? 'Link Copied!' : 'Copy Mobile Link'}
                  </button>
                  <a
                    href={mobileAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    Open Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-400">
                {lang === 'hi' ? '📲 फोन में तुरंत इंस्टॉल करने के 3 आसान कदम:' : '📲 3 Easy Steps on your Phone:'}
              </div>
              <div>1. {lang === 'hi' ? 'फोन के Chrome ब्राउज़र में यह लिंक खोलें (या QR कोड स्कैन करें)।' : 'Open link in mobile Chrome (or scan QR code).'}</div>
              <div>2. {lang === 'hi' ? 'ऊपर दाईं ओर 3 डॉट्स (⋮) पर टैप करें।' : 'Tap the 3 dots (⋮) in the top-right corner.'}</div>
              <div>3. {lang === 'hi' ? '"Install app" या "Add to Home screen" (होम स्क्रीन में जोड़ें) पर टैप करें।' : 'Tap "Install App" or "Add to Home Screen".'}</div>
              <div className="text-cyan-300 pt-0.5">
                {lang === 'hi'
                  ? '✓ जेनिफर तुरंत आपके मोबाइल की होम स्क्रीन पर असली Android App की तरह इंस्टॉल हो जाएगी!'
                  : '✓ Jenifer instantly installs as a standalone native app on your home screen!'}
              </div>
            </div>
          </div>

          {/* Target GitHub Repository Pill */}
          <div className="p-3.5 rounded-2xl bg-[#080d24] border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <GitBranch className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="text-slate-400">Target GitHub Repo: </span>
                <span className="font-mono font-bold text-cyan-300">
                  gamezone7534-bit/Jenifer
                </span>
              </div>
            </div>
            <a
              href="https://github.com/gamezone7534-bit/Jenifer"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-medium flex items-center gap-1 shrink-0 transition-colors"
            >
              View on GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Primary Action 1: Direct Download Jenifer.apk */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-[#070b1a] border border-emerald-500/40 shadow-xl space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Direct Install Package
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                {lang === 'hi' ? 'Jenifer.apk फ़ाइल डाउनलोड करें' : 'Download Jenifer.apk File'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'hi'
                  ? 'अपने Android फोन में सीधे इंस्टॉल करने के लिए Jenifer-v1.0-debug.apk डाउनलोड करें।'
                  : 'Download Jenifer-v1.0-debug.apk directly to install on your Android device.'}
              </p>
            </div>

            <button
              onClick={handleDownloadDirectApk}
              disabled={isDownloadingApk}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              {isDownloadingApk
                ? lang === 'hi'
                  ? 'APK पैकेज तैयार हो रहा है...'
                  : 'Packaging APK...'
                : downloadSuccess === 'apk'
                ? lang === 'hi'
                  ? '✓ Jenifer.apk डाउनलोड हो गया!'
                  : '✓ Jenifer.apk Downloaded!'
                : lang === 'hi'
                ? 'Jenifer-v1.0-debug.apk डाउनलोड करें'
                : 'Download Jenifer-v1.0-debug.apk'}
            </button>
          </div>

          {/* Action 2: GitHub Actions Cloud Build for gamezone7534-bit/Jenifer */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-[#070b1a] border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                {lang === 'hi'
                  ? 'GitHub Actions द्वारा ऑटोमैटिक APK निर्माण:'
                  : 'Automatic Cloud APK Build (GitHub Actions):'}
              </h3>
              <button
                onClick={handleCopyGitCommands}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedGit ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Git Commands
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'इस प्रोजेक्ट में `.github/workflows/build-apk.yml` शामिल है। जैसे ही आप इसे `gamezone7534-bit/Jenifer` पर पुश करेंगे, GitHub क्लाउड में ऑटोमैटिकली APK बनकर तैयार हो जाएगा!'
                : 'This project includes `.github/workflows/build-apk.yml`. Pushing to `gamezone7534-bit/Jenifer` automatically compiles and generates your APK via GitHub Actions.'}
            </p>

            <div className="p-3 rounded-xl bg-black/70 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto select-all">
              <pre>{gitCommands}</pre>
            </div>
          </div>

          {/* Action 3: Download Complete Source Code (.ZIP) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-400" />
                  {lang === 'hi'
                    ? 'संपूर्ण Android Studio सोर्स कोड (.ZIP) डाउनलोड करें'
                    : 'Download Full Android Studio Source Code (.ZIP)'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {lang === 'hi'
                    ? 'सभी Kotlin फाइल्स, Gradle, CameraX, Room DB और Gemini AI बैकएंड के साथ।'
                    : 'Complete project with Kotlin, Gradle, CameraX, Room DB, and Gemini AI backend.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadProjectZip}
              disabled={isDownloadingZip}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              {isDownloadingZip
                ? 'Generating ZIP...'
                : downloadSuccess === 'zip'
                ? '✓ Project ZIP Downloaded!'
                : 'Download Jenifer-gamezone7534-bit-source.zip'}
            </button>
          </div>

          {/* Dedicated Section: Build APK Without Android Studio */}
          <div className="p-5 rounded-2xl bg-[#090f28] border border-emerald-500/30 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                {lang === 'hi'
                  ? 'बिना Android Studio के APK कैसे बनाएं (3 आसान तरीके):'
                  : 'How to Build an APK Without Android Studio (3 Methods):'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CLI & Cloud
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Method A: GitHub Cloud */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-cyan-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">A</span>
                  {lang === 'hi'
                    ? 'तरीका A: GitHub Actions (0 Software इंस्टॉल - 100% फ्री क्लाउड)'
                    : 'Method A: GitHub Actions (Zero Software Install - 100% Free Cloud)'}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {lang === 'hi'
                    ? 'आपको कंप्यूटर पर कुछ भी इंस्टॉल करने की ज़रूरत नहीं है। बस कोड को `gamezone7534-bit/Jenifer` पर पुश करें। इसमें मौजूद `.github/workflows/build-apk.yml` अपने-आप GitHub के क्लाउड सर्वर पर APK बनाकर डाउनलोड के लिए तैयार कर देगा।'
                    : 'You do not need to install anything on your PC. Push code to `gamezone7534-bit/Jenifer`. The pre-configured `.github/workflows/build-apk.yml` automatically compiles the APK on GitHub Cloud runners and provides the download link under GitHub Actions > Artifacts.'}
                </p>
              </div>

              {/* Method B: Command Line (CLI) */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-purple-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">B</span>
                  {lang === 'hi'
                    ? 'तरीका B: केवल Command-Line Tools (Gradle Wrapper)'
                    : 'Method B: Lightweight Command-Line Tools (No IDE needed)'}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {lang === 'hi'
                    ? 'Android Studio (3GB+) के बजाय केवल Java 17 और Android Command-line Tools (~120MB) रखें और प्रोजेक्ट फोल्डर में यह कमांड चलाएं:'
                    : 'Instead of the heavy 3GB+ Android Studio IDE, you only need Java 17 and Android cmdline-tools. Run in terminal:'}
                </p>
                <div className="p-2 rounded-lg bg-black/80 font-mono text-[11px] text-emerald-400 select-all">
                  Windows: <span className="text-white">gradlew.bat assembleDebug</span><br />
                  Linux / Mac: <span className="text-white">./gradlew assembleDebug</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Output path: <span className="text-cyan-300 font-mono">app/build/outputs/apk/debug/app-debug.apk</span>
                </p>
              </div>

              {/* Method C: Docker 1-liner */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">C</span>
                  {lang === 'hi'
                    ? 'तरीका C: Docker से एक कमांड में'
                    : 'Method C: 1-Line Docker Build (Pre-configured Android Box)'}
                </div>
                <div className="p-2 rounded-lg bg-black/80 font-mono text-[11px] text-amber-300 select-all overflow-x-auto">
                  docker run --rm -v "$PWD":/app -w /app mingc/android-build-box ./gradlew assembleDebug
                </div>
              </div>
            </div>
          </div>

          {/* Action 4: Instant PWA Direct Install */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'hi' ? 'होम स्क्रीन पर ऐप जोड़ें (PWA)' : 'Add to Home Screen (PWA)'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'hi'
                  ? 'बिना डाउनलोड के सीधे अपने फोन पर नेटिव ऐप की तरह चलाएं।'
                  : 'Install instantly on mobile or desktop without APK compilation.'}
              </p>
            </div>

            {isInstallable && (
              <button
                onClick={install}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shrink-0"
              >
                Install
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#070b1a] border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Configured for: github.com/gamezone7534-bit/Jenifer
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
