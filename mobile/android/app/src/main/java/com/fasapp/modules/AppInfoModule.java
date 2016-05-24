package com.fasapp.modules;

import android.app.Activity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.fasapp.R;


/**
 * Created by vison on 16/5/17.
 */
public class AppInfoModule extends ReactContextBaseJavaModule {
    private Callback mCallback;
    private Activity mActivity = getCurrentActivity();

    @Override
    public String getName() {
        return "AppInfoModule";
    }

    public AppInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getAppVersion(Callback callback) {
        mCallback = callback;
        int versionCode = 0;
        String versionName = null;
        try {
            PackageManager manager = getCurrentActivity().getPackageManager();
            PackageInfo info = manager.getPackageInfo(getCurrentActivity().getPackageName(), 0);
            versionName = info.versionName;
            mCallback.invoke(versionName );
        } catch (Exception e) {
            e.printStackTrace();
            mCallback.invoke(0);
        }

    }
}
