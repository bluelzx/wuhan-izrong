package com.fasapp;

import android.app.Application;

import com.fasapp.utils.CrashHandler;

/**
 * Created by amarsoft on 16/5/26.
 */
public class BaseApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        CrashHandler mCrashHandler = CrashHandler.getInstance();
        mCrashHandler.init(getApplicationContext());
    }
}
