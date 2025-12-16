# Ionic Video Capture Application

A complete Ionic application that allows users to capture videos using the device camera and store them locally on the device. Built with Ionic 7, Angular 17, and Capacitor 7.4.3.

## Features

- 📹 Capture videos using device camera
- 💾 Store videos locally on the device

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Ionic CLI** (`npm install -g @ionic/cli`)
- **Capacitor CLI** (included with Capacitor)
- For iOS development: **Xcode** (macOS only)
- For Android development: **Android Studio** with Android SDK

## Step-by-Step Implementation Guide

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- `@ionic/angular` - Ionic framework
- `@capacitor/core` - Capacitor core (v7.4.3)
- `@capacitor/camera` - Camera plugin for media access
- `@capacitor/filesystem` - File system plugin for local storage
- `@capacitor/preferences` - Preferences plugin for metadata storage
- `@capacitor/android` and `@capacitor/ios` - Native platform support

### Step 2: Initialize Capacitor

```bash
npx cap init
```

When prompted:
- **App name**: Video Capture (or your preferred name)
- **App ID**: com.example.videocapture (or your preferred bundle ID)
- **Web dir**: www

### Step 3: Add Native Platforms

#### For Android:

```bash
npx cap add android
```

#### For iOS (macOS only):

```bash
npx cap add ios
```

### Step 4: Configure Permissions

#### Android Configuration

Edit `android/app/src/main/AndroidManifest.xml` and add the following permissions inside the `<manifest>` tag:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

#### iOS Configuration

Edit `ios/App/App/Info.plist` and add the following keys:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to capture videos.</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access to record audio with videos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to save and access videos.</string>
```

### Step 5: Build the Application

```bash
npm run build
```

This creates the `www` directory with the compiled application.

### Step 6: Sync Capacitor

```bash
npx cap sync
```

This syncs the web assets to the native projects and installs any required plugins.

### Step 7: Run the Application

#### For Web Development:

```bash
npm start
```

Then open `http://localhost:4200` in your browser.

#### For Android:

```bash
npx cap open android
```

This opens Android Studio. Then:
1. Wait for Gradle sync to complete
2. Select your device or emulator
3. Click the Run button

#### For iOS (macOS only):

```bash
npx cap open ios
```

This opens Xcode. Then:
1. Select your device or simulator
2. Click the Run button

## Project Structure

```
ionic-video-capturing/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   ├── home.page.ts          # Main page component
│   │   │   ├── home.page.html        # Page template
│   │   │   ├── home.page.scss        # Page styles
│   │   │   ├── home.module.ts        # Page module
│   │   │   └── home-routing.module.ts # Page routing
│   │   ├── services/
│   │   │   └── video-capture.service.ts # Video capture logic
│   │   ├── app.component.ts          # Root component
│   │   ├── app.module.ts             # Root module
│   │   └── app-routing.module.ts     # App routing
│   ├── theme/
│   │   └── variables.scss            # Ionic theme variables
│   ├── global.scss                   # Global styles
│   ├── index.html                    # HTML entry point
│   └── main.ts                       # Application entry point
├── android/                          # Android native project
├── ios/                              # iOS native project
├── www/                              # Built web assets
├── capacitor.config.ts               # Capacitor configuration
├── package.json                      # Dependencies
└── README.md                         # This file
```

## Key Components

### VideoCaptureService (`src/app/services/video-capture.service.ts`)

This service handles all video-related operations:

- **`captureVideo()`**: Captures a video from the device camera
- **`getVideos()`**: Retrieves all saved videos


### HomePage (`src/app/home/home.page.ts`)

The main page component that provides:

- UI for capturing videos
- List of saved videos


## Usage

1. **Capture a Video**: Tap the "Capture Video" button. On web, this opens a file picker. On native devices, it opens the camera/video picker.

2. **View Videos**: All captured videos are listed below the capture button with their name, size, and date.

## Platform-Specific Notes

### Web Platform

- Uses HTML5 file input for video capture
- Videos are stored as blob URLs in browser storage
- Best tested in Chrome, Firefox, or Safari

### Android Platform

- Requires camera and storage permissions
- Videos are stored in the app's data directory
- Tested on Android 8.0+ (API level 26+)

### iOS Platform

- Requires camera and microphone permissions
- Videos are stored in the app's documents directory
- Tested on iOS 13.0+

## Troubleshooting

### Camera Permission Denied

- **Android**: Check `AndroidManifest.xml` has the required permissions
- **iOS**: Check `Info.plist` has the usage descriptions
- Make sure to request permissions at runtime (handled by Capacitor plugins)

### Videos Not Saving

- Check that the Filesystem plugin is properly installed
- Verify app has storage permissions
- Check console for any error messages

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Run `npx cap sync` to sync native projects
- Clear build cache: `rm -rf node_modules www` then `npm install`

## Advanced: Using Media Capture Plugin

For better native video recording support, you can install the Media Capture plugin:

```bash
npm install @capacitor/media
```

Then update `src/app/services/video-capture.service.ts` to use the Media Capture API for native video recording.

## Additional Resources

- [Ionic Documentation](https://ionicframework.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- [Capacitor Filesystem Plugin](https://capacitorjs.com/docs/apis/filesystem)

## License

MIT

## Support

For issues or questions, please check:
- Ionic Forum: https://forum.ionicframework.com/
- Capacitor GitHub: https://github.com/ionic-team/capacitor

