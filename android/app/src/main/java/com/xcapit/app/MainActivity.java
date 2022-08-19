package com.xcapit.app;

import android.os.Bundle;

import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(FirebaseAnalytics.class);
        super.onCreate(savedInstanceState);
    }
}
