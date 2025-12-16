# Quick Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Initialize Capacitor (if not already done)

```bash
npx cap init
```

## 3. Add Native Platforms

### Android:
```bash
npx cap add android
```

### iOS (macOS only):
```bash
npx cap add ios
```

## 4. Configure Permissions

### Android (`android/app/src/main/AndroidManifest.xml`):
Add these permissions inside `<manifest>`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS (`ios/App/App/Info.plist`):
Add these keys:
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to capture videos.</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access to record audio with videos.</string>
```

## 5. Build and Sync

```bash
npm run build
npx cap sync
```

## 6. Run

### Web:
```bash
npm start
```

### Android:
```bash
npx cap open android
```

### iOS:
```bash
npx cap open ios
```

## Note on Video Recording

The current implementation uses HTML5 file input for video capture, which works well on web and mobile browsers. For native video recording with more control, consider installing:

```bash
npm install @capacitor/media
```

Then update `src/app/services/video-capture.service.ts` to use the Media Capture API.

