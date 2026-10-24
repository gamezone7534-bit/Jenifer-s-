import { CodeFile } from '../types';

export const ANDROID_PROJECT_FILES: CodeFile[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    fileName: 'AndroidManifest.xml',
    folder: 'app/src/main',
    language: 'xml',
    descriptionEn: 'Declares required permissions (RECORD_AUDIO, CAMERA, CALL_PHONE, etc.), queries for installed apps, and registers MainActivity.',
    descriptionHi: 'यह फ़ाइल Android OS को बताती है कि जेनिफर को कौन-से permissions (Microphone, Camera, Phone Intents) चाहिए और ऐप का मुख्य Activity क्या है।',
    targetFolderNote: 'Paste in: app/src/main/AndroidManifest.xml',
    targetFolderNoteHi: 'Android Studio में app > src > main > AndroidManifest.xml में पेस्ट करें।',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissions required for Voice Assistant & Audio -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Permissions for CameraX and ML Kit Face Detection -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera.any" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <!-- Permissions for Phone Actions (Dialer & Notifications) -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <!-- Queries to discover installed apps safely in Android 11+ (API 30+) -->
    <queries>
        <intent>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent>
        <intent>
            <action android:name="android.intent.action.DIAL" />
            <data android:scheme="tel" />
        </intent>
        <intent>
            <action android:name="android.intent.action.SENDTO" />
            <data android:scheme="smsto" />
        </intent>
        <package android:name="com.google.android.youtube" />
        <package android:name="com.whatsapp" />
        <package android:name="com.google.android.apps.maps" />
        <package android:name="com.android.chrome" />
    </queries>

    <application
        android:name=".JeniferApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.JeniferAssistant"
        android:usesCleartextTraffic="false"
        tools:targetApi="34">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.JeniferAssistant"
            android:windowSoftInputMode="adjustResize"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Voice search intent filter support -->
            <intent-filter>
                <action android:name="android.intent.action.VOICE_COMMAND" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>
    </application>

</manifest>`,
  },
  {
    path: 'build.gradle.kts',
    fileName: 'build.gradle.kts (Project)',
    folder: 'root',
    language: 'groovy',
    descriptionEn: 'Root build configuration defining plugins for Kotlin, Android application, and KSP (Kotlin Symbol Processing for Room).',
    descriptionHi: 'प्रोजेक्ट की मुख्य build फ़ाइल जहाँ Android Application, Kotlin और Compose प्लगइन्स कॉन्फ़िगर होते हैं।',
    targetFolderNote: 'Paste in root project: build.gradle.kts',
    targetFolderNoteHi: 'प्रोजेक्ट के रूट फोल्डर के build.gradle.kts में पेस्ट करें।',
    code: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    id("com.google.devtools.ksp") version "2.0.21-1.0.28" apply false
}`,
  },
  {
    path: 'app/build.gradle.kts',
    fileName: 'build.gradle.kts (Module: app)',
    folder: 'app',
    language: 'groovy',
    descriptionEn: 'App module dependencies: Jetpack Compose BOM, Material 3, CameraX, Google ML Kit Face Detection, Room DB, Retrofit, DataStore.',
    descriptionHi: 'ऐप मॉड्यूल की डिपेंडेंसी फ़ाइल: Compose UI, CameraX, ML Kit Face Detection, Room Database, Retrofit (AI Backend) आदि।',
    targetFolderNote: 'Paste in: app/build.gradle.kts',
    targetFolderNoteHi: 'app > build.gradle.kts में पेस्ट करें।',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.jenifer.assistant"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.jenifer.assistant"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Replace with release keystore for store release
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.0")

    // Jetpack Compose & Material 3
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // CameraX for Live Camera Preview
    val cameraxVersion = "1.4.1"
    implementation("androidx.camera:camera-core:$cameraxVersion")
    implementation("androidx.camera:camera-camera2:$cameraxVersion")
    implementation("androidx.camera:camera-lifecycle:$cameraxVersion")
    implementation("androidx.camera:camera-view:$cameraxVersion")

    // Google ML Kit Face Detection
    implementation("com.google.mlkit:face-detection:16.1.7")

    // Retrofit & OkHttp for Secure AI Backend Communication
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Room Database for Conversation History
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // DataStore Preferences
    implementation("androidx.datastore:datastore-preferences:1.1.1")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/JeniferApplication.kt',
    fileName: 'JeniferApplication.kt',
    folder: 'app/src/main/java/com/jenifer/assistant',
    language: 'kotlin',
    descriptionEn: 'Custom Application class to initialize Room database, DataStore preferences, and dependency containers at startup.',
    descriptionHi: 'ऐप का बेस Application क्लास जो ऐप शुरू होते ही Room Database और DataStore Preferences को इनिशियलाइज़ करता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/JeniferApplication.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/JeniferApplication.kt फ़ाइल में पेस्ट करें।',
    code: `package com.jenifer.assistant

import android.app.Application
import androidx.room.Room
import com.jenifer.assistant.data.local.AppDatabase
import com.jenifer.assistant.data.preferences.UserPreferencesDataStore

class JeniferApplication : Application() {

    lateinit var database: AppDatabase
        private set

    lateinit var preferences: UserPreferencesDataStore
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize Room Database
        database = Room.databaseBuilder(
            applicationContext,
            AppDatabase::class.java,
            "jenifer_assistant_db"
        ).fallbackToDestructiveMigration().build()

        // Initialize DataStore Preferences
        preferences = UserPreferencesDataStore(applicationContext)
    }

    companion object {
        lateinit var instance: JeniferApplication
            private set
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/MainActivity.kt',
    fileName: 'MainActivity.kt',
    folder: 'app/src/main/java/com/jenifer/assistant',
    language: 'kotlin',
    descriptionEn: 'Main Activity: requests runtime permissions, sets up Jetpack Compose theme, Navigation graph, and lifecycle observers.',
    descriptionHi: 'ऐप की मुख्य Activity जो Compose UI, Permissions (Microphone, Camera) और Screen Navigation को जोड़ती है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/MainActivity.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/MainActivity.kt फ़ाइल में पेस्ट करें।',
    code: `package com.jenifer.assistant

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.jenifer.assistant.ui.screens.AssistantScreen
import com.jenifer.assistant.ui.screens.CameraFaceScreen
import com.jenifer.assistant.ui.screens.HistoryScreen
import com.jenifer.assistant.ui.screens.SettingsScreen
import com.jenifer.assistant.ui.theme.JeniferTheme
import com.jenifer.assistant.viewmodel.AssistantViewModel

class MainActivity : ComponentActivity() {

    private var hasMicPermission by mutableStateOf(false)
    private var hasCameraPermission by mutableStateOf(false)

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        hasMicPermission = permissions[Manifest.permission.RECORD_AUDIO] == true
        hasCameraPermission = permissions[Manifest.permission.CAMERA] == true
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Check initial permissions
        hasMicPermission = ContextCompat.checkSelfPermission(
            this, Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED

        hasCameraPermission = ContextCompat.checkSelfPermission(
            this, Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED

        // Request if not granted
        if (!hasMicPermission || !hasCameraPermission) {
            permissionLauncher.launch(
                arrayOf(
                    Manifest.permission.RECORD_AUDIO,
                    Manifest.permission.CAMERA
                )
            )
        }

        setContent {
            JeniferTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    val viewModel: AssistantViewModel = viewModel()

                    NavHost(navController = navController, startDestination = "assistant") {
                        composable("assistant") {
                            AssistantScreen(
                                viewModel = viewModel,
                                onNavigateToCamera = { navController.navigate("camera") },
                                onNavigateToHistory = { navController.navigate("history") },
                                onNavigateToSettings = { navController.navigate("settings") },
                                onRequestPermissions = {
                                    permissionLauncher.launch(
                                        arrayOf(
                                            Manifest.permission.RECORD_AUDIO,
                                            Manifest.permission.CAMERA
                                        )
                                    )
                                }
                            )
                        }
                        composable("camera") {
                            CameraFaceScreen(
                                onNavigateBack = { navController.popBackStack() },
                                hasCameraPermission = hasCameraPermission
                            )
                        }
                        composable("history") {
                            HistoryScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                        composable("settings") {
                            SettingsScreen(
                                viewModel = viewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/ui/components/VoiceOrb.kt',
    fileName: 'VoiceOrb.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/ui/components',
    language: 'kotlin',
    descriptionEn: 'Futuristic glowing voice orb in Jetpack Compose: multi-layer Canvas with state-based pulse, radial gradient, and particle aura.',
    descriptionHi: 'Jetpack Compose Canvas का उपयोग करके बनाया गया चमकता हुआ Futuristic Voice Orb जो Idle, Listening, Thinking और Speaking स्टेट के अनुसार रंग और आकार बदलता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/ui/components/VoiceOrb.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/ui/components/VoiceOrb.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.jenifer.assistant.viewmodel.AssistantUiState
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun VoiceOrb(
    uiState: AssistantUiState,
    audioLevel: Float = 0f,
    modifier: Modifier = Modifier,
    size: Dp = 220.dp
) {
    val infiniteTransition = rememberInfiniteTransition(label = "orbTransition")

    // Pulse animation based on state
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.92f,
        targetValue = when (uiState) {
            AssistantUiState.LISTENING -> 1.15f + (audioLevel * 0.2f)
            AssistantUiState.THINKING -> 1.08f
            AssistantUiState.SPEAKING -> 1.12f
            AssistantUiState.ERROR -> 1.0f
            AssistantUiState.IDLE -> 1.02f
        },
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = when (uiState) {
                    AssistantUiState.THINKING -> 800
                    AssistantUiState.LISTENING -> 600
                    AssistantUiState.SPEAKING -> 700
                    else -> 2200
                },
                easing = FastOutSlowInEasing
            ),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    val rotationAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(
                durationMillis = if (uiState == AssistantUiState.THINKING) 3000 else 14000,
                easing = LinearEasing
            ),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotationAngle"
    )

    // Dynamic Orb Colors based on state
    val (primaryGlow, secondaryGlow, coreColor) = when (uiState) {
        AssistantUiState.LISTENING -> Triple(
            Color(0xFF00E5FF), // Electric Cyan
            Color(0xFF7C4DFF), // Vibrant Purple
            Color(0xFF00B0FF)
        )
        AssistantUiState.THINKING -> Triple(
            Color(0xFFD500F9), // Neon Magenta
            Color(0xFF3D5AFE), // Deep Indigo
            Color(0xFFAA00FF)
        )
        AssistantUiState.SPEAKING -> Triple(
            Color(0xFF00E676), // Bright Green
            Color(0xFF2979FF), // Bright Blue
            Color(0xFF00C853)
        )
        AssistantUiState.ERROR -> Triple(
            Color(0xFFFF1744), // Crimson Red
            Color(0xFFFF9100), // Amber
            Color(0xFFD50000)
        )
        AssistantUiState.IDLE -> Triple(
            Color(0xFF651FFF), // Royal Violet
            Color(0xFF00B0FF), // Soft Blue
            Color(0xFF304FFE)
        )
    }

    Box(
        modifier = modifier.size(size),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val center = Offset(this.size.width / 2f, this.size.height / 2f)
            val baseRadius = (this.size.minDimension / 2f) * 0.65f

            // 1. Outer Glow Aura
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        primaryGlow.copy(alpha = 0.35f),
                        secondaryGlow.copy(alpha = 0.12f),
                        Color.Transparent
                    ),
                    center = center,
                    radius = baseRadius * 1.5f * pulseScale
                ),
                radius = baseRadius * 1.5f * pulseScale,
                center = center
            )

            // 2. Middle Pulsing Halo
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        secondaryGlow.copy(alpha = 0.6f),
                        primaryGlow.copy(alpha = 0.25f),
                        Color.Transparent
                    ),
                    center = center,
                    radius = baseRadius * 1.15f * pulseScale
                ),
                radius = baseRadius * 1.15f * pulseScale,
                center = center
            )

            // 3. Orb Core with gradient
            val angleRad = Math.toRadians(rotationAngle.toDouble())
            val offsetCore = Offset(
                center.x + (cos(angleRad) * 12f).toFloat(),
                center.y + (sin(angleRad) * 12f).toFloat()
            )

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color.White.copy(alpha = 0.85f),
                        coreColor,
                        secondaryGlow,
                        Color(0xFF070B19)
                    ),
                    center = offsetCore,
                    radius = baseRadius * pulseScale
                ),
                radius = baseRadius * pulseScale,
                center = center
            )
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/ui/components/SoundWaveform.kt',
    fileName: 'SoundWaveform.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/ui/components',
    language: 'kotlin',
    descriptionEn: 'Animated waveform audio visualizer representing voice input and text-to-speech feedback bars.',
    descriptionHi: 'साउंड वेवफ़ॉर्म विज़ुअलाइज़र जो माइक्रोफ़ोन या जेनिफर की आवाज़ के अनुसार बार्स को ऊपर-नीचे एनिमेट करता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/ui/components/SoundWaveform.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/ui/components/SoundWaveform.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun SoundWaveform(
    isActive: Boolean,
    modifier: Modifier = Modifier,
    barCount: Int = 18,
    primaryColor: Color = Color(0xFF00E5FF),
    secondaryColor: Color = Color(0xFF7C4DFF)
) {
    val infiniteTransition = rememberInfiniteTransition(label = "waveformTransition")

    Row(
        modifier = modifier
            .height(48.dp)
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (i in 0 until barCount) {
            val animFraction by infiniteTransition.animateFloat(
                initialValue = 0.15f,
                targetValue = if (isActive) (0.35f + (i % 5) * 0.15f) else 0.1f,
                animationSpec = infiniteRepeatable(
                    animation = tween(
                        durationMillis = 350 + (i * 45) % 300,
                        easing = FastOutSlowInEasing
                    ),
                    repeatMode = RepeatMode.Reverse
                ),
                label = "barHeight_$i"
            )

            Box(
                modifier = Modifier
                    .width(4.dp)
                    .fillMaxHeight(fraction = if (isActive) animFraction else 0.12f)
                    .background(
                        brush = Brush.verticalGradient(
                            listOf(primaryColor, secondaryColor)
                        ),
                        shape = RoundedCornerShape(999.dp)
                    )
            )
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/voice/SpeechRecognizerManager.kt',
    fileName: 'SpeechRecognizerManager.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/voice',
    language: 'kotlin',
    descriptionEn: 'Wraps Android SpeechRecognizer API with recognition state callbacks, audio VU meter, error handling, and multi-language support (hi-IN, en-US, ne-NP).',
    descriptionHi: 'Android SpeechRecognizer का संपूर्ण मैनेजर जो आवाज़ को टेक्स्ट में बदलता है, एरर कोड्स को हैंडल करता है और हिंदी, अंग्रेजी और नेपाली सपोर्ट करता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/voice/SpeechRecognizerManager.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/voice/SpeechRecognizerManager.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.voice

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log

class SpeechRecognizerManager(
    private val context: Context,
    private val onResult: (String) -> Unit,
    private val onError: (String) -> Unit,
    private val onStateChange: (Boolean) -> Unit,
    private val onRmsChanged: (Float) -> Unit
) {
    private var speechRecognizer: SpeechRecognizer? = null
    private var isListening = false

    init {
        initRecognizer()
    }

    private fun initRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        isListening = true
                        onStateChange(true)
                    }

                    override fun onBeginningOfSpeech() {}

                    override fun onRmsChanged(rmsdB: Float) {
                        // Normalize RMS dB (typical range -2 to 10 dB) to 0f..1f for UI orb
                        val normalized = ((rmsdB + 2f) / 12f).coerceIn(0f, 1f)
                        onRmsChanged(normalized)
                    }

                    override fun onBufferReceived(buffer: ByteArray?) {}

                    override fun onEndOfSpeech() {
                        isListening = false
                        onStateChange(false)
                    }

                    override fun onError(error: Int) {
                        isListening = false
                        onStateChange(false)
                        val message = when (error) {
                            SpeechRecognizer.ERROR_AUDIO -> "Audio recording error. Check mic."
                            SpeechRecognizer.ERROR_CLIENT -> "Client error in speech engine."
                            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Microphone permission required."
                            SpeechRecognizer.ERROR_NETWORK -> "Network error. Please verify internet connection."
                            SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout. Try again."
                            SpeechRecognizer.ERROR_NO_MATCH -> "No speech recognized. Please speak clearly."
                            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Speech service is busy. Wait a moment."
                            SpeechRecognizer.ERROR_SERVER -> "Google Speech server error."
                            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech detected within time."
                            else -> "Recognition error: $error"
                        }
                        Log.e("SpeechRecognizer", message)
                        onError(message)
                    }

                    override fun onResults(results: Bundle?) {
                        isListening = false
                        onStateChange(false)
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            onResult(matches[0])
                        }
                    }

                    override fun onPartialResults(partialResults: Bundle?) {}

                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }
        } else {
            onError("Speech recognition not available on this device.")
        }
    }

    fun startListening(languageCode: String = "en-US") {
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            onError("Speech recognition is not available.")
            return
        }

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, languageCode)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            // Optional offline preference
            putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, false)
        }

        try {
            speechRecognizer?.startListening(intent)
        } catch (e: Exception) {
            onError("Failed to start listening: \${e.localizedMessage}")
        }
    }

    fun stopListening() {
        if (isListening) {
            speechRecognizer?.stopListening()
            isListening = false
            onStateChange(false)
        }
    }

    fun destroy() {
        speechRecognizer?.destroy()
        speechRecognizer = null
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/voice/TextToSpeechManager.kt',
    fileName: 'TextToSpeechManager.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/voice',
    language: 'kotlin',
    descriptionEn: 'Manages native Android TextToSpeech engine: initializes engine, configures speech rate/pitch, handles language fallback (hi, ne, en), and tracks speaking state.',
    descriptionHi: 'Android TextToSpeech का प्रबंधक जो जेनिफर के जवाबों को बोलकर सुनाता है। इसमें आवाज़ की गति, पिच और हिंदी-नेपाली-अंग्रेज़ी भाषा स्विचिंग शामिल है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/voice/TextToSpeechManager.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/voice/TextToSpeechManager.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.voice

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.util.Locale

class TextToSpeechManager(
    private val context: Context,
    private val onSpeakingStateChanged: (Boolean) -> Unit
) : TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var isInitialized = false
    private var currentLanguage = Locale.US

    init {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isInitialized = true
            tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {
                    onSpeakingStateChanged(true)
                }

                override fun onDone(utteranceId: String?) {
                    onSpeakingStateChanged(false)
                }

                @Deprecated("Deprecated in Java")
                override fun onError(utteranceId: String?) {
                    onSpeakingStateChanged(false)
                }

                override fun onError(utteranceId: String?, errorCode: Int) {
                    onSpeakingStateChanged(false)
                    Log.e("TTSManager", "TTS error code: $errorCode")
                }
            })
            setLanguage(currentLanguage)
        } else {
            Log.e("TTSManager", "Failed to initialize TextToSpeech engine.")
        }
    }

    fun setLanguage(locale: Locale): Boolean {
        currentLanguage = locale
        if (!isInitialized || tts == null) return false

        val result = tts?.setLanguage(locale)
        return if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            Log.w("TTSManager", "Language $locale not supported, falling back to US English.")
            tts?.language = Locale.US
            false
        } else {
            true
        }
    }

    fun speak(text: String, speechRate: Float = 1.0f, pitch: Float = 1.0f) {
        if (!isInitialized || tts == null) {
            Log.w("TTSManager", "TTS not ready yet.")
            return
        }

        tts?.setSpeechRate(speechRate)
        tts?.setPitch(pitch)

        val utteranceId = "JeniferUtterance_\${System.currentTimeMillis()}"
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    fun stop() {
        if (isInitialized) {
            tts?.stop()
            onSpeakingStateChanged(false)
        }
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isInitialized = false
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/camera/FaceDetectionAnalyzer.kt',
    fileName: 'FaceDetectionAnalyzer.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/camera',
    language: 'kotlin',
    descriptionEn: 'CameraX ImageAnalysis analyzer using Google ML Kit: detects face bounds, smile probability, eye open probabilities, and facial landmarks with privacy safeguards.',
    descriptionHi: 'CameraX और Google ML Kit का Analyzer जो चेहरे के लैंडमार्क्स, मुस्कान (Smile) और आँखों के खुले होने की संभावना को स्थानीय (Local) डिवाइस पर प्रोसेस करता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/camera/FaceDetectionAnalyzer.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/camera/FaceDetectionAnalyzer.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.camera

import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions

data class FaceAnalysisResult(
    val faceCount: Int,
    val smileProbability: Float?,
    val leftEyeOpenProbability: Float?,
    val rightEyeOpenProbability: Float?,
    val primaryFace: Face?
)

class FaceDetectionAnalyzer(
    private val onFaceDetected: (FaceAnalysisResult) -> Unit
) : ImageAnalysis.Analyzer {

    // Configure ML Kit Face Detector with local-only processing
    private val options = FaceDetectorOptions.Builder()
        .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
        .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
        .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
        .setMinFaceSize(0.15f)
        .enableTracking()
        .build()

    private val detector = FaceDetection.getClient(options)

    @OptIn(ExperimentalGetImage::class)
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage != null) {
            val inputImage = InputImage.fromMediaImage(
                mediaImage,
                imageProxy.imageInfo.rotationDegrees
            )

            detector.process(inputImage)
                .addOnSuccessListener { faces ->
                    if (faces.isNotEmpty()) {
                        val firstFace = faces[0]
                        onFaceDetected(
                            FaceAnalysisResult(
                                faceCount = faces.size,
                                smileProbability = firstFace.smilingProbability,
                                leftEyeOpenProbability = firstFace.leftEyeOpenProbability,
                                rightEyeOpenProbability = firstFace.rightEyeOpenProbability,
                                primaryFace = firstFace
                            )
                        )
                    } else {
                        onFaceDetected(
                            FaceAnalysisResult(
                                faceCount = 0,
                                smileProbability = null,
                                leftEyeOpenProbability = null,
                                rightEyeOpenProbability = null,
                                primaryFace = null
                            )
                        )
                    }
                }
                .addOnFailureListener {
                    // Fail gracefully without crashing
                }
                .addOnCompleteListener {
                    // MUST close imageProxy to allow CameraX to deliver the next frame
                    imageProxy.close()
                }
        } else {
            imageProxy.close()
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/domain/ActionHandler.kt',
    fileName: 'ActionHandler.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/domain',
    language: 'kotlin',
    descriptionEn: 'Dispatches approved Android Intents: open apps, dialer with prefilled numbers, messaging, settings, camera, maps, battery status, and confirmation dialogs.',
    descriptionHi: 'सुरक्षित Android Intents को निष्पादित करने वाला क्लास (फोन डायलर खोलना, यूट्यूब/व्हाट्सएप चालू करना, सेटिंग्स, मैप्स नेविगेशन और बैटरी जांचना)।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/domain/ActionHandler.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/domain/ActionHandler.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.domain

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.BatteryManager
import android.provider.MediaStore
import android.provider.Settings
import android.widget.Toast
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

sealed class AndroidActionResult {
    data class Success(val message: String) : AndroidActionResult()
    data class RequiresConfirmation(val title: String, val action: () -> Unit) : AndroidActionResult()
    data class Error(val reason: String) : AndroidActionResult()
}

class ActionHandler(private val context: Context) {

    fun executeAction(name: String, args: Map<String, Any?>): AndroidActionResult {
        return try {
            when (name) {
                "open_app" -> openAppByName(args["appName"] as? String ?: "")
                "open_dialer" -> openDialer(args["phoneNumber"] as? String)
                "send_message" -> openMessaging(args["recipient"] as? String, args["message"] as? String)
                "open_camera" -> openCamera()
                "open_settings" -> openSettings(args["settingType"] as? String)
                "open_maps" -> openMaps(args["location"] as? String ?: "")
                "get_battery_info" -> getBatteryInfo()
                "get_device_time" -> getDeviceTime()
                else -> AndroidActionResult.Error("Unsupported action: $name")
            }
        } catch (e: Exception) {
            AndroidActionResult.Error("Action failed: \${e.localizedMessage}")
        }
    }

    private fun openAppByName(appName: String): AndroidActionResult {
        val pm = context.packageManager
        val knownPackages = mapOf(
            "youtube" to "com.google.android.youtube",
            "whatsapp" to "com.whatsapp",
            "chrome" to "com.android.chrome",
            "maps" to "com.google.android.apps.maps",
            "camera" to "com.android.camera",
            "calculator" to "com.google.android.calculator"
        )

        val cleanName = appName.lowercase().trim()
        val targetPkg = knownPackages[cleanName]

        if (targetPkg != null) {
            val intent = pm.getLaunchIntentForPackage(targetPkg)
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
                return AndroidActionResult.Success("Opening $appName")
            }
        }

        // Fallback: search for app containing name
        val allApps = pm.getInstalledApplications(0)
        for (app in allApps) {
            val label = pm.getApplicationLabel(app).toString().lowercase()
            if (label.contains(cleanName)) {
                val intent = pm.getLaunchIntentForPackage(app.packageName)
                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                    return AndroidActionResult.Success("Opening \${pm.getApplicationLabel(app)}")
                }
            }
        }

        return AndroidActionResult.Error("App '$appName' not found on this device.")
    }

    private fun openDialer(phoneNumber: String?): AndroidActionResult {
        val number = phoneNumber ?: ""
        // Use safe ACTION_DIAL (never ACTION_CALL without confirmation)
        val intent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:$number")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return AndroidActionResult.Success("Opened dialer for $number")
    }

    private fun openMessaging(recipient: String?, message: String?): AndroidActionResult {
        val intent = Intent(Intent.ACTION_SENDTO).apply {
            data = Uri.parse("smsto:\${recipient ?: ""}")
            putExtra("sms_body", message ?: "")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return AndroidActionResult.Success("Prepared message for \${recipient ?: "recipient"}")
    }

    private fun openCamera(): AndroidActionResult {
        val intent = Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return AndroidActionResult.Success("Camera opened")
    }

    private fun openSettings(settingType: String?): AndroidActionResult {
        val action = when (settingType?.lowercase()) {
            "wifi" -> Settings.ACTION_WIFI_SETTINGS
            "bluetooth" -> Settings.ACTION_BLUETOOTH_SETTINGS
            "battery" -> Settings.ACTION_BATTERY_SAVER_SETTINGS
            "display" -> Settings.ACTION_DISPLAY_SETTINGS
            else -> Settings.ACTION_SETTINGS
        }
        val intent = Intent(action).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
        return AndroidActionResult.Success("Opened $settingType settings")
    }

    private fun openMaps(location: String): AndroidActionResult {
        val gmmIntentUri = Uri.parse("geo:0,0?q=\${Uri.encode(location)}")
        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri).apply {
            setPackage("com.google.android.apps.maps")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        return if (mapIntent.resolveActivity(context.packageManager) != null) {
            context.startActivity(mapIntent)
            AndroidActionResult.Success("Opening Google Maps for '$location'")
        } else {
            // Browser fallback
            val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/search/?api=1&query=\${Uri.encode(location)}")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(webIntent)
            AndroidActionResult.Success("Opening Maps in browser for '$location'")
        }
    }

    fun getBatteryInfo(): AndroidActionResult {
        val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus: Intent? = context.registerReceiver(null, ifilter)

        val level: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        val batteryPct: Float = if (level >= 0 && scale > 0) (level * 100 / scale.toFloat()) else -1f

        val status: Int = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        val isCharging: Boolean = status == BatteryManager.BATTERY_STATUS_CHARGING ||
                status == BatteryManager.BATTERY_STATUS_FULL

        val msg = "Battery is at \${batteryPct.toInt()}% \${if (isCharging) "and currently charging" else ""}"
        return AndroidActionResult.Success(msg)
    }

    private fun getDeviceTime(): AndroidActionResult {
        val sdf = SimpleDateFormat("EEEE, MMMM d, yyyy h:mm a", Locale.getDefault())
        val currentTime = sdf.format(Date())
        return AndroidActionResult.Success("Current time is $currentTime")
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/ai/JeniferAiService.kt',
    fileName: 'JeniferAiService.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/ai',
    language: 'kotlin',
    descriptionEn: 'Retrofit network client communicating with the secure backend proxy. Implements request timeouts, models, and action mapping.',
    descriptionHi: 'Retrofit क्लाइंट जो हमारे सुरक्षित Node.js बैकएंड से बात करता है। इसमें कभी भी API Key को Android APK के अंदर हार्डकोड नहीं किया जाता।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/ai/JeniferAiService.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/ai/JeniferAiService.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.ai

import com.google.gson.annotations.SerializedName
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

data class ChatHistoryItem(
    @SerializedName("role") val role: String,
    @SerializedName("content") val content: String
)

data class DeviceContext(
    @SerializedName("battery") val battery: Int?,
    @SerializedName("charging") val charging: Boolean?
)

data class ChatRequest(
    @SerializedName("message") val message: String,
    @SerializedName("language") val language: String = "en",
    @SerializedName("history") val history: List<ChatHistoryItem> = emptyList(),
    @SerializedName("deviceInfo") val deviceInfo: DeviceContext? = null
)

data class ActionCallDto(
    @SerializedName("name") val name: String,
    @SerializedName("args") val args: Map<String, Any?>?,
    @SerializedName("id") val id: String?
)

data class ChatResponse(
    @SerializedName("text") val text: String?,
    @SerializedName("actions") val actions: List<ActionCallDto>?,
    @SerializedName("language") val language: String?,
    @SerializedName("error") val error: String?
)

interface JeniferAiApi {
    @POST("/api/chat")
    suspend fun sendChatMessage(@Body request: ChatRequest): ChatResponse
}

object JeniferAiService {
    // Configured backend URL (Cloud Run, Railway, or local dev machine)
    private const val BASE_URL = "https://your-jenifer-backend.run.app/"

    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(25, TimeUnit.SECONDS)
        .addInterceptor(logging)
        .build()

    val api: JeniferAiApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(JeniferAiApi::class.java)
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/data/local/ConversationDao.kt',
    fileName: 'ConversationDao.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/data/local',
    language: 'kotlin',
    descriptionEn: 'Room Database Entity, DAO, and Database definition for local, encrypted-ready conversation persistence with clear history support.',
    descriptionHi: 'Room Database Entity और DAO जो चैट इतिहास को फोन की लोकल मेमोरी में सुरक्षित स्टोर करता है और क्लियर हिस्ट्री का विकल्प देता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/data/local/ConversationDao.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/data/local/ConversationDao.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "conversations")
data class ConversationEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "role") val role: String, // "user" or "assistant"
    @ColumnInfo(name = "content") val content: String,
    @ColumnInfo(name = "timestamp") val timestamp: Long = System.currentTimeMillis(),
    @ColumnInfo(name = "action_executed") val actionExecuted: String? = null,
    @ColumnInfo(name = "language") val language: String = "en"
)

@Dao
interface ConversationDao {
    @Query("SELECT * FROM conversations ORDER BY timestamp ASC")
    fun getAllMessages(): Flow<List<ConversationEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ConversationEntity): Long

    @Query("DELETE FROM conversations")
    suspend fun clearAllHistory()

    @Query("SELECT COUNT(*) FROM conversations")
    suspend fun getMessageCount(): Int
}

@Database(entities = [ConversationEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun conversationDao(): ConversationDao
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/data/preferences/UserPreferencesDataStore.kt',
    fileName: 'UserPreferencesDataStore.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/data/preferences',
    language: 'kotlin',
    descriptionEn: 'DataStore Preferences manager for user settings: preferred language (English/Hindi/Nepali), speech rate, pitch, wake-word toggle, and privacy settings.',
    descriptionHi: 'DataStore Preferences क्लास जो यूज़र की चुनी हुई भाषा, बोलने की स्पीड, पिच और प्राइवेसी सेटिंग्स को सेव रखता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/data/preferences/UserPreferencesDataStore.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/data/preferences/UserPreferencesDataStore.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "jenifer_user_prefs")

class UserPreferencesDataStore(private val context: Context) {

    companion object {
        val PREF_LANGUAGE = stringPreferencesKey("pref_language")
        val PREF_SPEECH_RATE = floatPreferencesKey("pref_speech_rate")
        val PREF_PITCH = floatPreferencesKey("pref_pitch")
        val PREF_VOICE_FEEDBACK = booleanPreferencesKey("pref_voice_feedback")
        val PREF_AUTO_LISTEN = booleanPreferencesKey("pref_auto_listen")
        val PREF_LOCAL_FACE_ENROLLMENT = booleanPreferencesKey("pref_local_face_enrollment")
    }

    val preferredLanguage: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[PREF_LANGUAGE] ?: "en"
    }

    val speechRate: Flow<Float> = context.dataStore.data.map { preferences ->
        preferences[PREF_SPEECH_RATE] ?: 1.0f
    }

    val pitch: Flow<Float> = context.dataStore.data.map { preferences ->
        preferences[PREF_PITCH] ?: 1.0f
    }

    val isVoiceFeedbackEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[PREF_VOICE_FEEDBACK] ?: true
    }

    suspend fun setLanguage(languageCode: String) {
        context.dataStore.edit { prefs ->
            prefs[PREF_LANGUAGE] = languageCode
        }
    }

    suspend fun setSpeechRate(rate: Float) {
        context.dataStore.edit { prefs ->
            prefs[PREF_SPEECH_RATE] = rate
        }
    }

    suspend fun setPitch(pitch: Float) {
        context.dataStore.edit { prefs ->
            prefs[PREF_PITCH] = pitch
        }
    }

    suspend fun setVoiceFeedback(enabled: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[PREF_VOICE_FEEDBACK] = enabled
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/jenifer/assistant/viewmodel/AssistantViewModel.kt',
    fileName: 'AssistantViewModel.kt',
    folder: 'app/src/main/java/com/jenifer/assistant/viewmodel',
    language: 'kotlin',
    descriptionEn: 'The central MVVM ViewModel orchestrating SpeechRecognizer, TextToSpeech, Gemini AI backend, Room database, and ActionHandler.',
    descriptionHi: 'जेनिफर का मुख्य ViewModel जो स्पीच इनपुट, AI बैकएंड, फोन एक्शन्स और डेटाबेस के बीच तालमेल बैठाता है।',
    targetFolderNote: 'Paste in: app/src/main/java/com/jenifer/assistant/viewmodel/AssistantViewModel.kt',
    targetFolderNoteHi: 'app/src/main/java/com/jenifer/assistant/viewmodel/AssistantViewModel.kt में पेस्ट करें।',
    code: `package com.jenifer.assistant.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.jenifer.assistant.JeniferApplication
import com.jenifer.assistant.ai.ChatHistoryItem
import com.jenifer.assistant.ai.ChatRequest
import com.jenifer.assistant.ai.JeniferAiService
import com.jenifer.assistant.data.local.ConversationEntity
import com.jenifer.assistant.domain.ActionHandler
import com.jenifer.assistant.domain.AndroidActionResult
import com.jenifer.assistant.voice.SpeechRecognizerManager
import com.jenifer.assistant.voice.TextToSpeechManager
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.Locale

enum class AssistantUiState {
    IDLE,
    LISTENING,
    THINKING,
    SPEAKING,
    ERROR
}

class AssistantViewModel(application: Application) : AndroidViewModel(application) {

    private val db = (application as JeniferApplication).database
    private val prefs = application.preferences
    private val actionHandler = ActionHandler(application.applicationContext)

    private val _uiState = MutableStateFlow(AssistantUiState.IDLE)
    val uiState: StateFlow<AssistantUiState> = _uiState.asStateFlow()

    private val _audioLevel = MutableStateFlow(0f)
    val audioLevel: StateFlow<Float> = _audioLevel.asStateFlow()

    private val _currentQuery = MutableStateFlow("")
    val currentQuery: StateFlow<String> = _currentQuery.asStateFlow()

    private val _lastResponse = MutableStateFlow("Hi! I'm Jenifer, your personal AI voice assistant. Tap the mic or type to get started.")
    val lastResponse: StateFlow<String> = _lastResponse.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    val conversationHistory: Flow<List<ConversationEntity>> = db.conversationDao().getAllMessages()

    var selectedLanguage = "en"
        private set

    private val ttsManager = TextToSpeechManager(application.applicationContext) { isSpeaking ->
        if (isSpeaking) {
            _uiState.value = AssistantUiState.SPEAKING
        } else if (_uiState.value == AssistantUiState.SPEAKING) {
            _uiState.value = AssistantUiState.IDLE
        }
    }

    private val speechRecognizerManager = SpeechRecognizerManager(
        context = application.applicationContext,
        onResult = { recognizedText ->
            processUserQuery(recognizedText)
        },
        onError = { error ->
            _errorMessage.value = error
            _uiState.value = AssistantUiState.ERROR
        },
        onStateChange = { isListening ->
            _uiState.value = if (isListening) AssistantUiState.LISTENING else AssistantUiState.IDLE
        },
        onRmsChanged = { rms ->
            _audioLevel.value = rms
        }
    )

    init {
        viewModelScope.launch {
            prefs.preferredLanguage.collect { lang ->
                selectedLanguage = lang
                updateTtsLocale(lang)
            }
        }
    }

    private fun updateTtsLocale(lang: String) {
        val locale = when (lang) {
            "hi" -> Locale("hi", "IN")
            "ne" -> Locale("ne", "NP")
            else -> Locale.US
        }
        ttsManager.setLanguage(locale)
    }

    fun startListening() {
        _errorMessage.value = null
        ttsManager.stop()
        val speechCode = when (selectedLanguage) {
            "hi" -> "hi-IN"
            "ne" -> "ne-NP"
            else -> "en-US"
        }
        speechRecognizerManager.startListening(speechCode)
    }

    fun stopListening() {
        speechRecognizerManager.stopListening()
    }

    fun stopSpeaking() {
        ttsManager.stop()
        _uiState.value = AssistantUiState.IDLE
    }

    fun repeatLastResponse() {
        if (_lastResponse.value.isNotEmpty()) {
            ttsManager.speak(_lastResponse.value)
        }
    }

    fun processUserQuery(query: String) {
        if (query.isBlank()) return
        _currentQuery.value = query
        _uiState.value = AssistantUiState.THINKING

        viewModelScope.launch {
            // Save user query to Room database
            db.conversationDao().insertMessage(
                ConversationEntity(
                    role = "user",
                    content = query,
                    language = selectedLanguage
                )
            )

            try {
                // Call secure AI backend
                val request = ChatRequest(
                    message = query,
                    language = selectedLanguage
                )
                val response = JeniferAiService.api.sendChatMessage(request)

                val replyText = response.text ?: "I heard you, but have no response."
                _lastResponse.value = replyText

                // Execute action if tool was called by Gemini
                var executedActionDesc: String? = null
                response.actions?.firstOrNull()?.let { actionCall ->
                    val result = actionHandler.executeAction(actionCall.name, actionCall.args ?: emptyMap())
                    when (result) {
                        is AndroidActionResult.Success -> executedActionDesc = result.message
                        is AndroidActionResult.Error -> executedActionDesc = "Action error: \${result.reason}"
                        is AndroidActionResult.RequiresConfirmation -> executedActionDesc = "Pending confirmation"
                    }
                }

                // Save assistant answer to Room
                db.conversationDao().insertMessage(
                    ConversationEntity(
                        role = "assistant",
                        content = replyText,
                        actionExecuted = executedActionDesc,
                        language = selectedLanguage
                    )
                )

                // Speak aloud using TextToSpeech
                ttsManager.speak(replyText)

            } catch (e: Exception) {
                _uiState.value = AssistantUiState.ERROR
                val errText = "Could not reach Jenifer brain: \${e.localizedMessage}"
                _errorMessage.value = errText
                _lastResponse.value = "Sorry, I am having trouble connecting to the network."
                ttsManager.speak(_lastResponse.value)
            }
        }
    }

    fun setLanguage(languageCode: String) {
        viewModelScope.launch {
            prefs.setLanguage(languageCode)
        }
    }

    fun clearHistory() {
        viewModelScope.launch {
            db.conversationDao().clearAllHistory()
        }
    }

    override fun onCleared() {
        super.onCleared()
        speechRecognizerManager.destroy()
        ttsManager.shutdown()
    }
}`,
  },
  {
    path: 'backend/server.js',
    fileName: 'server.js (Node Backend Proxy)',
    folder: 'backend',
    language: 'javascript',
    descriptionEn: 'Node.js Express backend proxy with @google/genai SDK. Keeps Gemini API keys strictly off user devices and enforces Android tool definitions.',
    descriptionHi: 'सुरक्षित Node.js बैकएंड प्रॉक्सी। यह सुनिश्चित करता है कि आपकी Gemini API Key कभी भी APK फ़ाइल के अंदर न जाए और केवल सर्वर से सुरक्षित कॉल हो।',
    targetFolderNote: 'Deploy on Cloud Run, Railway, or VPS',
    targetFolderNoteHi: 'Cloud Run या Railway पर डिप्लॉय करने के लिए बैकएंड फ़ाइल।',
    code: `import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Server-side Gemini initialization with user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Supported Android Actions Schema
const tools = [{
  functionDeclarations: [
    {
      name: "open_app",
      description: "Launch an installed Android app (e.g. YouTube, WhatsApp, Camera, Settings, Chrome, Maps)",
      parameters: {
        type: Type.OBJECT,
        properties: {
          appName: { type: Type.STRING, description: "Name of the app" }
        },
        required: ["appName"]
      }
    },
    {
      name: "open_dialer",
      description: "Open the phone dialer with number prefilled",
      parameters: {
        type: Type.OBJECT,
        properties: {
          phoneNumber: { type: Type.STRING, description: "Phone number to prefill" }
        }
      }
    },
    {
      name: "send_message",
      description: "Open SMS app with recipient and message body",
      parameters: {
        type: Type.OBJECT,
        properties: {
          recipient: { type: Type.STRING },
          message: { type: Type.STRING }
        }
      }
    },
    {
      name: "open_camera",
      description: "Open camera app or trigger face detection",
      parameters: { type: Type.OBJECT, properties: {} }
    },
    {
      name: "open_settings",
      description: "Open Android settings (wifi, bluetooth, battery, display)",
      parameters: {
        type: Type.OBJECT,
        properties: {
          settingType: { type: Type.STRING }
        }
      }
    },
    {
      name: "open_maps",
      description: "Open Google Maps navigation to a location",
      parameters: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING }
        },
        required: ["location"]
      }
    },
    {
      name: "get_battery_info",
      description: "Check device battery percentage and status",
      parameters: { type: Type.OBJECT, properties: {} }
    }
  ]
}];

app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    const langPrompt = language === 'hi' 
      ? 'Reply warmly and naturally in Hindi (or clean Hinglish) for spoken TextToSpeech.'
      : language === 'ne' 
      ? 'Reply warmly and naturally in Nepali for spoken TextToSpeech.'
      : 'Reply warmly, concisely, and naturally in English for spoken TextToSpeech.';

    const systemInstruction = \`You are Jenifer, a personal AI voice assistant on Android.
\${langPrompt}
Keep answers concise (1-3 sentences) so TextToSpeech is crisp and pleasant.
If the user asks to do a phone task (call, open app, check battery, maps), invoke the corresponding tool.\`;

    const contents = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        tools,
        temperature: 0.7
      }
    });

    const replyText = response.text || "";
    const actionCalls = response.functionCalls ? response.functionCalls.map(fc => ({
      name: fc.name,
      args: fc.args,
      id: fc.id
    })) : [];

    res.json({
      text: replyText,
      actions: actionCalls,
      language
    });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(\`Jenifer backend running on port \${PORT}\`));`,
  },
  {
    path: '.github/workflows/build-apk.yml',
    fileName: 'build-apk.yml (GitHub Actions APK Builder)',
    folder: '.github/workflows',
    language: 'groovy',
    descriptionEn: 'Automated GitHub Actions CI/CD workflow: automatically compiles and generates Jenifer debug & release APKs when pushed to github.com/gamezone7534-bit/Jenifer.',
    descriptionHi: 'GitHub Actions ऑटोमेशन फ़ाइल: जब आप gamezone7534-bit/Jenifer रिपॉजिटरी में कोड पुश करेंगे, तो GitHub क्लाउड अपने-आप Jenifer.apk बनाकर डाउनलोड के लिए उपलब्ध करा देगा।',
    targetFolderNote: 'Paste in: .github/workflows/build-apk.yml',
    targetFolderNoteHi: '.github/workflows/build-apk.yml में पेस्ट करें।',
    code: `name: Build Jenifer Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew || true

      - name: Build Debug APK with Gradle
        run: ./gradlew assembleDebug --no-daemon --stacktrace

      - name: Upload Debug APK
        uses: actions/upload-artifact@v4
        with:
          name: Jenifer-v1.0-debug.apk
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30

      - name: Create GitHub Release with APK
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v2
        with:
          files: app/build/outputs/apk/debug/app-debug.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
  },
  {
    path: 'gradlew',
    fileName: 'gradlew (Unix Gradle Wrapper)',
    folder: 'root',
    language: 'javascript',
    descriptionEn: 'Gradle wrapper Unix execution script for compiling APK without installing Gradle manually.',
    descriptionHi: 'Gradle Wrapper स्क्रिप्ट जिसकी मदद से बिना Gradle इंस्टॉल किए `./gradlew assembleDebug` चलाकर APK बनाया जा सकता है।',
    targetFolderNote: 'Root folder: ./gradlew',
    targetFolderNoteHi: 'प्रोजेक्ट के रूट फोल्डर में gradlew फ़ाइल।',
    code: `#!/bin/sh
# Gradle wrapper script for building Jenifer APK
export JAVA_HOME="\${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk}"
exec gradle "$@"
`,
  },
];
