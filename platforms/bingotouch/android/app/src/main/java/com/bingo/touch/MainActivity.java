package com.bingo.touch;

import android.os.Bundle;

import com.touchcore.core.BTActivity;

public class MainActivity extends BTActivity {

    String startPage;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();

        startPage = "file:///android_asset/www/" + BuildConfig.StartPage;
        loadUrl(startPage, null);

    }

    @Override
    public void launchSetting() {
        super.launchSetting();
        this.splashscreen = R.mipmap.splash;
        this.showSplashScreen(3000);
    }
}
