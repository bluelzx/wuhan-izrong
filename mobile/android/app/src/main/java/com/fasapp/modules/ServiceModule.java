package com.fasapp.modules;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.fasapp.service.AppService;
import com.fasapp.utils.AppUtils;
import com.fasapp.utils.LogUtils;
import com.fasapp.utils.SPUtils;

/**
 * Created by wmge on 16/3/15.
 *
 */
public class ServiceModule extends ReactContextBaseJavaModule {

    public ServiceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private static String TOKEN = "";
    private static Integer LASTSYNCTIME = -1;
    private static String HOST = "";

    private void setTokenAndLastSyncTimeAndHost(String token, Integer lastSyncTime, String host){
        TOKEN = token;
        LASTSYNCTIME = lastSyncTime;
        HOST = host;
    }

    public static String getToken() {
        return TOKEN;
    }

    public static Integer getLastSyncTime() {
        return LASTSYNCTIME;
    }

    public static String getHOST() {
        return HOST;
    }

    @Override
    public String getName() {
        return "ServiceModule";
    }

    @ReactMethod
    public void setIsLoginToSP(boolean isLogin) {
        LogUtils.d("isLogin", isLogin + " ");
        SPUtils.put(getReactApplicationContext(), "isLogin", isLogin);
    }

    @ReactMethod
    public void startAppService(String token,int lastSyncTime, String host) {

        if(token==null){
            return;
        }
        setTokenAndLastSyncTimeAndHost(token, lastSyncTime, host);
        if(token.equals(getToken())) {
            if (!AppUtils.isServiceWork(getReactApplicationContext(), "com.fasapp.service.AppService")) {
                getReactApplicationContext().startService(new Intent(getReactApplicationContext(), AppService.class));
            }
        }
    }


    @ReactMethod
    public void stopMyAppService() {
        LogUtils.d("stopMyAppService","option");
        getReactApplicationContext().stopService(new Intent(getReactApplicationContext(), AppService.class));
    }
}
