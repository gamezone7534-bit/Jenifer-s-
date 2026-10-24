import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { CodeFile } from '../types';
import JSZip from 'jszip';
import { Folder, FileCode, Copy, Check, Download, Info, Globe, ExternalLink, Terminal } from 'lucide-react';

export const CodebaseBrowser: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [langExplanation, setLangExplanation] = useState<'hi' | 'en'>('hi');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Add all files into their respective directory structures
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.code);
      });

      // Add standard gradle.properties and settings
      zip.file(
        'gradle.properties',
        `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`
      );

      // Add README.md with setup guide in both languages
      zip.file(
        'README.md',
        `# Jenifer - Android Personal AI Voice Assistant 🎙️

A production-grade, modular Android AI Voice Assistant built with Kotlin, Jetpack Compose, Android SpeechRecognizer, TextToSpeech, CameraX, Google ML Kit Face Detection, and Gemini AI backend.

## Quick Start in Android Studio:
1. Extract this zip file.
2. Open Android Studio (Ladybug, Iguana, or later).
3. Select "Open" and choose the extracted folder.
4. Let Gradle sync and download dependencies.
5. In \`app/src/main/java/com/jenifer/assistant/ai/JeniferAiService.kt\`, point BASE_URL to your deployed Node.js backend.
6. Connect your Android phone with USB Debugging enabled, and click Run!

## Node.js Backend Deployment:
Deploy \`backend/server.js\` to Google Cloud Run, Railway, or Render.
Set environment variable: \`GEMINI_API_KEY="your_gemini_api_key"\`.
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jenifer-android-assistant-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate zip:', e);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080d22] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-[#0b132e] border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Android Studio Project Codebase
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {ANDROID_PROJECT_FILES.length} Files Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean Architecture (MVVM) • Jetpack Compose • CameraX • Speech • Room • DataStore
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle for explanation */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setLangExplanation('hi')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                langExplanation === 'hi'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              सरल हिंदी
            </button>
            <button
              onClick={() => setLangExplanation('en')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                langExplanation === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Download Complete Project Zip */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isDownloadingZip ? 'Generating ZIP...' : 'Export Complete Android Project (.zip)'}
          </button>
        </div>
      </div>

      {/* Main split: File Tree on left, Code & Explanation on right */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-full lg:w-72 bg-[#060a1a] border-r border-slate-800/80 p-3 overflow-y-auto max-h-60 lg:max-h-none shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
            Project Navigator
          </div>
          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/40 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="truncate">
                    <div className="truncate font-mono">{file.fileName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{file.folder}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content & Hindi/English Guide */}
        <div className="flex-1 flex flex-col bg-[#070b1a] overflow-hidden">
          {/* File Header Bar & Where to Paste */}
          <div className="px-5 py-3 bg-[#0d1633] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {selectedFile.path}
              </span>
              <p className="text-xs text-amber-300 font-medium mt-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {langExplanation === 'hi'
                  ? selectedFile.targetFolderNoteHi
                  : selectedFile.targetFolderNote}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy File Code
                </>
              )}
            </button>
          </div>

          {/* Hindi / English Beginner Explanation Banner */}
          <div className="px-5 py-2.5 bg-indigo-950/40 border-b border-indigo-900/30 text-xs text-indigo-200 leading-relaxed">
            <span className="font-semibold text-white">
              {langExplanation === 'hi' ? '📝 इस कोड का काम:' : '📝 File Purpose:'}{' '}
            </span>
            {langExplanation === 'hi' ? selectedFile.descriptionHi : selectedFile.descriptionEn}
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="flex-1 p-4 overflow-auto bg-[#040714] font-mono text-xs text-slate-200 leading-relaxed">
            <pre className="select-text">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
