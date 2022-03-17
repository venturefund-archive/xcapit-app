package com.xcapit.app;

import android.os.Bundle;

import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;
import com.getcapacitor.BridgeActivity;
import com.xcapit.plugins.facebookappevents.FacebookAppEventsPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(FirebaseAnalytics.class);
        registerPlugin(FacebookAppEventsPlugin.class);
    }
}
