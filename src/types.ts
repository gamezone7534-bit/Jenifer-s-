export type AssistantState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export type LanguageCode = 'en' | 'hi' | 'ne';

export interface AndroidAction {
  name: string;
  args: Record<string, any>;
  id?: string;
  status: 'pending' | 'confirmed' | 'executed' | 'cancelled';
  result?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language?: LanguageCode;
  actionCall?: AndroidAction;
  audioUrl?: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  manifestPermission: string;
  descriptionEn: string;
  descriptionHi: string;
  isGranted: boolean;
  isDangerous: boolean;
  whyNeededEn: string;
  whyNeededHi: string;
}

export interface FaceDetectionData {
  isActive: boolean;
  facesDetected: number;
  smileProbability: number;
  leftEyeOpenProb: number;
  rightEyeOpenProb: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
  landmarks?: { x: number; y: number; label: string }[];
  enrolledFaceId?: string | null;
}

export interface CodeFile {
  path: string;
  fileName: string;
  folder: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'json' | 'javascript';
  descriptionEn: string;
  descriptionHi: string;
  code: string;
  targetFolderNote: string;
  targetFolderNoteHi: string;
}

export interface TeachingPhase {
  id: number;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  summaryEn: string;
  summaryHi: string;
  keyConcepts: string[];
  filesInvolved: string[];
  detailedSteps: {
    stepNumber: number;
    titleEn: string;
    titleHi: string;
    explanationEn: string;
    explanationHi: string;
    codeSnippet?: string;
    filePath?: string;
    whereToPasteEn: string;
    whereToPasteHi: string;
    proTipEn?: string;
    proTipHi?: string;
  }[];
  commonPitfalls: {
    problemEn: string;
    problemHi: string;
    solutionEn: string;
    solutionHi: string;
  }[];
}
