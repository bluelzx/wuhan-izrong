package com.fasapp.modules;

import android.content.Intent;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import javax.annotation.Nullable;

/**
 * Created by baoyinghai on 5/4/16.
 */
public class ActivityListenerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    public ActivityListenerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //reactContext.addActivityEventListener(this);
        reactContext.addLifecycleEventListener(this);
    }


    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "ActivityListenerModule";
    }

    @Override
    public void onHostResume() {
        // Actvity `onResume`
        sendEvent(getReactApplicationContext(),"onResume",null);
//        getReactApplicationContext().stopService(new Intent(getReactApplicationContext(), AppService.class));
    }

    @Override
    public void onHostPause() {
        // Actvity `onPause`
        sendEvent(getReactApplicationContext(),"onPause",null);
    }

    @Override
    public void onHostDestroy() {
        // Actvity `onDestroy`
    }
}
