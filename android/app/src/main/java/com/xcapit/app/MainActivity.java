package com.xcapit.app;

import android.os.Bundle;

import androidx.core.splashscreen.SplashScreen;

import com.epicshaggy.biometric.NativeBiometric;
import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
    super.onCreate(savedInstanceState);
    registerPlugin(FirebaseAnalytics.class);
    registerPlugin(NativeBiometric.class);
  }
}
