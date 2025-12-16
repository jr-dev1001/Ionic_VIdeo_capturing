import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.videocapture',
  appName: 'Video Capture',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: {
        camera: 'This app needs camera access to capture videos.',
        microphone: 'This app needs microphone access to record audio.'
      }
    }
  }
};

export default config;

