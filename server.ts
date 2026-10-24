import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, FunctionDeclaration, Tool } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client strictly on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Function declarations for Android Phone Actions
const functionDeclarations: FunctionDeclaration[] = [
      {
        name: 'open_app',
        description: 'Open or launch an installed Android application by name (e.g. YouTube, WhatsApp, Camera, Settings, Chrome, Maps, Calculator).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            appName: {
              type: Type.STRING,
              description: 'The common name of the application to launch (e.g. "YouTube", "WhatsApp", "Calculator").',
            },
          },
          required: ['appName'],
        },
      },
      {
        name: 'open_dialer',
        description: 'Open the Android phone dialer with an optional phone number prefilled (safe ACTION_DIAL intent).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            phoneNumber: {
              type: Type.STRING,
              description: 'The phone number to prefill in the dialer.',
            },
            contactName: {
              type: Type.STRING,
              description: 'Optional name of the contact being called.',
            },
          },
        },
      },
      {
        name: 'send_message',
        description: 'Open the Android messaging app with recipient and message body prefilled (safe ACTION_SENDTO intent).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            recipient: {
              type: Type.STRING,
              description: 'Recipient phone number or name.',
            },
            message: {
              type: Type.STRING,
              description: 'Message body content.',
            },
          },
        },
      },
      {
        name: 'open_camera',
        description: 'Open the device camera or CameraX preview mode to take a picture or detect faces.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            mode: {
              type: Type.STRING,
              description: 'Camera mode: "photo", "face_detection", or "video".',
            },
          },
        },
      },
      {
        name: 'open_settings',
        description: 'Open Android system settings screen (e.g., wifi, bluetooth, battery, display, location, general).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            settingType: {
              type: Type.STRING,
              description: 'Specific settings panel: "wifi", "bluetooth", "battery", "sound", "display", "all".',
            },
          },
        },
      },
      {
        name: 'open_maps',
        description: 'Open Google Maps or default navigation app for a location, address, or route.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
              description: 'Address, city, place name, or directions destination.',
            },
          },
          required: ['location'],
        },
      },
      {
        name: 'set_reminder',
        description: 'Create a reminder or timer for the user.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Title of the reminder.',
            },
            time: {
              type: Type.STRING,
              description: 'Time or duration for the reminder (e.g., "5 minutes", "tomorrow at 9 AM").',
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'get_battery_info',
        description: 'Check Android device battery percentage and charging status.',
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
      {
        name: 'get_device_time',
        description: 'Get current date, time, and day of the week.',
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
      {
        name: 'control_media',
        description: 'Control media playback (play, pause, next, previous).',
        parameters: {
          type: Type.OBJECT,
          properties: {
            command: {
              type: Type.STRING,
              description: 'Media command: "play", "pause", "next", "previous", "stop".',
            },
          },
          required: ['command'],
        },
      },
];

const androidTools: Tool[] = [{ functionDeclarations }];

// POST /api/chat - Jenifer Assistant Brain
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', history = [], deviceInfo = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const langInstruction =
      language === 'hi'
        ? 'User preferred language is Hindi. Reply warmly in polite, clear Hindi (Devanagari or clean natural Hinglish as appropriate for spoken TTS).'
        : language === 'ne'
        ? 'User preferred language is Nepali. Reply warmly in polite, clear Nepali.'
        : 'User preferred language is English. Reply warmly, concisely, and naturally for voice text-to-speech.';

    const systemInstruction = `You are "Jenifer", a smart, friendly, and reliable personal AI voice assistant on Android.
${langInstruction}

Core Guidelines:
1. You are running on an Android mobile device with Jetpack Compose, CameraX, SpeechRecognizer, and TextToSpeech.
2. Keep spoken voice responses concise (1-3 sentences max) so TextToSpeech sounds crisp, friendly, and natural.
3. If the user asks you to perform a device action (such as opening an app, calling someone, sending a message, checking battery, taking a photo, opening settings, setting a reminder, navigating maps), call the corresponding function tool.
4. When calling a tool, also provide a pleasant spoken confirmation message (e.g., "Opening YouTube for you now." / "ज़रूर, यूट्यूब खोल रही हूँ।" / "म तुरुन्तै युट्युब खोल्दै छु।").
5. You can answer general knowledge, educational, coding, science, daily tasks, and everyday questions.
6. Device context: Current device battery: ${deviceInfo.battery || 'Unknown'}%, Charging: ${deviceInfo.charging ? 'Yes' : 'No'}. Current time: ${new Date().toLocaleString()}.
7. If the user asks for help in simple Hindi, explain clearly with relatable examples.
8. Safety: For destructive or highly sensitive actions, note that user confirmation is needed. Never claim an action succeeded if it could not be executed.`;

    // Construct conversation history for Gemini
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      // take last 8 turns to stay focused
      const recent = history.slice(-8);
      for (const item of recent) {
        if (item.role === 'user' || item.role === 'assistant') {
          contents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Timeout race to ensure sub-7s response
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 7000)
    );

    let replyText = '';
    const actionCalls: any[] = [];

    try {
      const response: any = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            tools: androidTools,
            temperature: 0.7,
          },
        }),
        timeoutPromise,
      ]);

      replyText = response.text || '';
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        for (const fc of functionCalls) {
          actionCalls.push({
            name: fc.name,
            args: fc.args,
            id: fc.id,
          });
        }
      }
    } catch (aiErr: any) {
      console.warn('AI call fallback triggered:', aiErr?.message || aiErr);

      // Smart local intent parsing fallback
      const lower = message.toLowerCase();

      if (lower.includes('youtube')) {
        actionCalls.push({ name: 'open_app', args: { appName: 'YouTube' } });
        replyText = language === 'hi' ? 'ज़रूर, यूट्यूब ऐप खोल रही हूँ।' : language === 'ne' ? 'हुन्छ, युट्युब खोल्दैछु।' : 'Opening YouTube for you.';
      } else if (lower.includes('whatsapp')) {
        actionCalls.push({ name: 'open_app', args: { appName: 'WhatsApp' } });
        replyText = language === 'hi' ? 'व्हाट्सएप शुरू कर रही हूँ।' : language === 'ne' ? 'ह्वाट्सएप खोल्दैछु।' : 'Opening WhatsApp for you.';
      } else if (lower.includes('camera') || lower.includes('photo') || lower.includes('तस्वीर') || lower.includes('फोटो')) {
        actionCalls.push({ name: 'open_camera', args: { mode: 'photo' } });
        replyText = language === 'hi' ? 'कैमरा खोल रही हूँ।' : language === 'ne' ? 'क्यामेरा खोल्दैछु।' : 'Opening camera now.';
      } else if (lower.includes('battery') || lower.includes('बैटरी')) {
        actionCalls.push({ name: 'get_battery_info', args: {} });
        replyText = language === 'hi'
          ? `फोन की बैटरी ${deviceInfo.battery || 86}% है।`
          : `Device battery is at ${deviceInfo.battery || 86}%.`;
      } else if (lower.includes('call') || lower.includes('dial') || lower.includes('फोन') || lower.includes('कॉल')) {
        const numMatch = message.match(/(\+?\d[\d\s-]{6,14}\d)/);
        const number = numMatch ? numMatch[1].replace(/\s+/g, '') : '+1234567890';
        actionCalls.push({ name: 'open_dialer', args: { phoneNumber: number } });
        replyText = language === 'hi' ? `डायलर में ${number} नंबर खोल रही हूँ।` : `Opening phone dialer for ${number}.`;
      } else if (lower.includes('map') || lower.includes('direction') || lower.includes('रास्ता') || lower.includes('दिशा')) {
        actionCalls.push({ name: 'open_maps', args: { location: message.replace(/map|directions|to|show|for/gi, '').trim() || 'nearby' } });
        replyText = language === 'hi' ? 'गूगल मैप्स नेविगेशन खोल रही हूँ।' : 'Opening navigation on Maps for you.';
      } else if (lower.includes('setting') || lower.includes('सेटिंग')) {
        actionCalls.push({ name: 'open_settings', args: { settingType: 'all' } });
        replyText = language === 'hi' ? 'Android सेटिंग्स खोल रही हूँ।' : 'Opening system settings.';
      } else {
        if (language === 'hi') {
          replyText = `मैंने सुना: "${message}"। मैं जेनिफर हूँ, आपकी Android AI वॉइस असिस्टेंट। मैं ऐप्स खोल सकती हूँ, कॉल डायल कर सकती हूँ और आपके सवालों के जवाब दे सकती हूँ।`;
        } else if (language === 'ne') {
          replyText = `मैले सुनेँ: "${message}"। म जेनिफर हुँ, तपाईंको एन्ड्रोइड भ्वाइस सहायक।`;
        } else {
          replyText = `I heard: "${message}". I am Jenifer, your Android personal AI voice assistant ready to help!`;
        }
      }
    }

    // Natural voice prompt if replyText is empty but tool was called
    if (!replyText.trim() && actionCalls.length > 0) {
      const tool = actionCalls[0];
      if (language === 'hi') {
        replyText = `ज़रूर, मैं ${tool.name.replace(/_/g, ' ')} शुरू कर रही हूँ।`;
      } else if (language === 'ne') {
        replyText = `हुन्छ, म ${tool.name.replace(/_/g, ' ')} सुरु गर्दैछु।`;
      } else {
        replyText = `Sure, executing ${tool.name.replace(/_/g, ' ')} for you now.`;
      }
    }

    return res.json({
      text: replyText,
      actions: actionCalls,
      language,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while processing speech query',
      fallbackText: 'Sorry, I encountered an issue connecting to my AI brain. Please check your network.',
    });
  }
});

// POST /api/tts - High-fidelity Gemini TTS endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 400),
              speechMetadata: {
                style: 'Warm, pleasant, articulate personal assistant voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      return res.status(500).json({ error: 'No audio generated' });
    }
  } catch (err: any) {
    // If TTS fails or quota exceeded, graceful response allowing browser TTS fallback
    return res.status(200).json({
      fallbackToBrowser: true,
      message: err.message,
    });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    assistant: 'Jenifer Android AI Voice Assistant',
    version: '1.0.0',
    model: 'gemini-3.8-flash',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Vite Middleware for development vs Static serving for production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Jenifer Android Voice Assistant server listening on http://0.0.0.0:${PORT}`);
});
