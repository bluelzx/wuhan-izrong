package com.fasapp.pakage;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.fasapp.modules.ActivityListenerModule;
import com.fasapp.modules.AppInfoModule;
import com.fasapp.modules.NotificationModule;
import com.fasapp.modules.SaveFileModule;
//import com.fasapp.modules.ServiceModule;
import com.fasapp.modules.UserPhotoPicModule;
import com.fasapp.view.viewpager.ZXViewPagerManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by amarsoft ./on 16/3/9.
 */
public class ZXReactPackage implements ReactPackage {
    Activity activity;
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new UserPhotoPicModule(reactContext));
//        modules.add(new ServiceModule(reactContext));
        modules.add(new ActivityListenerModule(reactContext));
        modules.add(new SaveFileModule(reactContext));
        modules.add(new NotificationModule(reactContext));
        modules.add(new AppInfoModule(reactContext));
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new ZXViewPagerManager()
        );
    }

    public ZXReactPackage(Activity activity) {
        this.activity = activity;
    }
}
