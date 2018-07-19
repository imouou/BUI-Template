package com.bingo.touch;

import android.os.Bundle;

import com.touchcore.core.BTActivity;
import com.uuzuche.lib_zxing.activity.ZXingLibrary;

public class MainActivity extends BTActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getSupportActionBar().hide();
        String startPage = BuildConfig.StartPage;
        //从gradle.properties读取启动页面
        if (!BuildConfig.StartPage.startsWith("http")) {
            startPage = "file:///android_asset/www/" + BuildConfig.StartPage;
        }
        loadUrl(startPage, null);
        ZXingLibrary.initDisplayOpinion(this);
    }

    @Override
    public void launchSetting() {
        super.launchSetting();
        this.splashscreen = R.mipmap.splash;
        this.showSplashScreen(3000);
    }
}
