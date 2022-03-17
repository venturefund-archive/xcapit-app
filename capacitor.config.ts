/// <reference types="@capacitor/local-notifications" />
/// <reference types="@capacitor/push-notifications" />
/// <reference types="@capacitor/splash-screen" />
/// <reference types="facebook-app-events" />

import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.xcapit.app',
  appName: 'xcapit',
  bundledWebRuntime: false,
  webDir: 'www',
  backgroundColor: '#ffffffff',
  plugins: {
    PushNotifications: { presentationOptions: ['badge', 'sound', 'alert'] },
    SplashScreen: {
      splashFullScreen: true,
      splashImmersive: true,
      launchAutoHide: true,
      launchShowDuration: 2000,
      androidScaleType: 'CENTER_INSIDE',
      backgroundColor: "#1c2d5e"
    },
  },
};

export default config;
