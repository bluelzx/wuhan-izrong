package com.fasapp.modules;

import android.content.Intent;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.io.File;


/**
 * Created by vison on 16/5/17.
 */
public class SaveFileModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private File file;
    private Callback mCallback;
    private WritableMap response;

    @Override
    public String getName() {
        return "SaveFileModule";
    }

    public SaveFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

    }

    @ReactMethod
    public void saveFile(String url) {
//        OkHttpUtils.get()
//                .url(url)
//                .build()
//                .execute(new Callback() {
//                    @Override
//                    public Object parseNetworkResponse(Response response) throws IOException {
//                        InputStream inputStream = response.body().byteStream();
//                        return inputStream;
//                    }
//
//                    @Override
//                    public void onError(Request request, Exception e) {
//
//                    }
//
//                    @Override
//                    public void onResponse(Object file) {
//
//                    }
//                });
    }

}
