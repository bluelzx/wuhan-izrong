package com.fasapp.modules;

import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.fasapp.BaseApplication;
import com.fasapp.R;


/**
 * Created by vison on 16/5/17.
 */
public class AppInfoModule extends ReactContextBaseJavaModule {
    private Callback mCallback;
    ReactApplicationContext reactContext;

    @Override
    public String getName() {
        return "AppInfoModule";
    }

    public AppInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    public void getPushRegId (Callback call) {
        call.invoke(BaseApplication.regId, BaseApplication.deviceModel);
    }

    @ReactMethod
    public void getAppVersion(Callback callback) {
        mCallback = callback;
        int versionCode = 0;
        String versionName = null;
        try {
            PackageManager manager = reactContext.getPackageManager();
            PackageInfo info = manager.getPackageInfo(reactContext.getPackageName(), 0);
            versionName = info.versionName;
            mCallback.invoke(versionName );
        } catch (Exception e) {
            e.printStackTrace();
            mCallback.invoke(0);
        }

    }
}
