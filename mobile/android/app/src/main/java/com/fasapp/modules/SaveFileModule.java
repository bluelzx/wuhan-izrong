package com.fasapp.modules;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import com.fasapp.utils.FileUtils;
import com.zhy.http.okhttp.OkHttpUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;


/**
 * Created by vison on 16/5/17.
 */
public class SaveFileModule extends ReactContextBaseJavaModule {
    private Callback mCallback;
    private WritableMap response;
    ReactApplicationContext reactContext;

    @Override
    public String getName() {
        return "SaveFileModule";
    }

    public SaveFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void saveFile(String url,Callback callback) {
        mCallback = callback;
        OkHttpUtils.get()
                .url(url)
                .build()
                .execute(new com.zhy.http.okhttp.callback.Callback() {
                    @Override
                    public Object parseNetworkResponse(okhttp3.Response response) throws Exception {
                        InputStream inputStream = response.body().byteStream();
                        //String fileName = new Date().getTime() + ".png";
                        //File file = new File(Environment.getExternalStorageDirectory()+"/fas-wuhan/",fileName);
                        File photoDir = new File(reactContext.getFilesDir().getAbsolutePath() + "/fas-wuhan");
                        if (!photoDir.exists()) {
                            photoDir.mkdir();
                        }
                        File file = new File(photoDir.getAbsolutePath() + "/"+ new Date().getTime() + ".png");
                        FileUtils.inputStreamToFile(inputStream,file);
                        return file;
                    }

                    @Override
                    public void onError(okhttp3.Call call, Exception e) {
                        mCallback.invoke(0);
                    }

                    @Override
                    public void onResponse(Object o) {
                        try {
                            File file1 = (File)o;
                            MediaStore.Images.Media.insertImage(getCurrentActivity().getContentResolver(), file1.getPath(), "title", "description");
                            getCurrentActivity().sendBroadcast(new Intent(Intent.ACTION_MEDIA_MOUNTED, Uri.parse("file://" + file1.getPath())));
                            mCallback.invoke(1);
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                            mCallback.invoke(0);
                        }
                    }
                });
    }
}
