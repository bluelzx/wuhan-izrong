package com.fasapp.modules;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.fasapp.utils.LogUtils;
import com.fasapp.utils.PatternUtils;
import com.fasapp.utils.SDCardUtils;
import com.fasapp.utils.T;
import com.soundcloud.android.crop.Crop;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.util.Date;
import java.util.List;

import cn.finalteam.galleryfinal.FunctionConfig;
import cn.finalteam.galleryfinal.GalleryFinal;
import cn.finalteam.galleryfinal.model.PhotoInfo;

/**
 * Created by vison on 16/4/11.
 */
public class UserPhotoPicModule extends ReactContextBaseJavaModule {
    private static final int USER_IMAGE_REQUEST_CODE = 0x01;
    private static final int USER_CAMERA_REQUEST_CODE = 0x02;
    private Callback mCallback;
    private boolean mCrop;
    private String mFileName;
    private WritableMap mResponse;
    private File file;
    private Uri uri;
    private int mAspectX;
    private int mAspectY;
    private final int REQUEST_CODE_CAMERA = 1000;
    private final int REQUEST_CODE_GALLERY = 1001;
    private final int REQUEST_CODE_CROP = 1002;
    private final FunctionConfig functionConfig = new FunctionConfig.Builder().build();
    private FunctionConfig mCropConfig;


    public UserPhotoPicModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UserPhotoPicModule";
    }

    @ReactMethod
    public void showSaveImgDialog(final Callback callback) {
        Activity currentActivity = getCurrentActivity();
        String[] items = {"保存图片", "删除图片"};
        new AlertDialog.Builder(currentActivity)
                .setItems(items, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                callback.invoke(0);
                                break;
                            case 1:
                                callback.invoke(1);
                                break;
                        }
                    }

                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                }).show();
    }

    @ReactMethod
    public void showImgDialog(final Callback callback) {
        Activity currentActivity = getCurrentActivity();
        String[] items = {"保存图片"};
        new AlertDialog.Builder(currentActivity)
                .setItems(items, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                callback.invoke();
                                break;
                        }
                    }

                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                }).show();
    }

    @ReactMethod
    public void showImagePic(String type, boolean needCrop, String name, int aspectX, int aspectY, Callback callback) {
        showImagePicBySize(type, needCrop, name, aspectX, aspectY, callback, 300);

    }

    @ReactMethod
    public void showImagePicBySize(String type, boolean needCrop, String name, int aspectX, int aspectY, Callback callback, int size) {
        File jsCode = getReactApplicationContext().getDir("JSCode", Context.MODE_PRIVATE);
        LogUtils.i("jsCode", jsCode.getPath());
        getFiles(jsCode.getPath());
        this.mCrop = needCrop;
        this.mFileName = name;
        this.mCallback = callback;
        this.mAspectX = aspectX;
        this.mAspectY = aspectY;
        mCropConfig = new FunctionConfig.Builder()
                .setEnableCrop(true)
                .setEnableRotate(true)
                .setCropSquare(false)
                .setEnablePreview(true)
                .setMutiSelectMaxSize(8)
                .build();
        switch (type) {
            case "all":
                showSelectDdialog();
                break;
            case "library":
                launchImage();
                break;
            case "camera":
                launchCamera();
                break;
        }
    }

    private void getFiles(String filePath) {
        File root = new File(filePath);
        File[] files = root.listFiles();
        for (File file : files) {
            if (file.isDirectory()) {
                getFiles(file.getAbsolutePath());
                LogUtils.i("jsCode", file.getAbsolutePath());
            } else {
                LogUtils.i("jsCode", file.getAbsolutePath());
            }
        }
    }

    private void showSelectDdialog() {
        Activity currentActivity = getCurrentActivity();
        String[] items = {"拍照上传", "本地上传"};
        new AlertDialog.Builder(currentActivity)
                .setItems(items, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        switch (which) {
                            case 0:
                                launchCamera();
                                break;
                            case 1:
                                launchImage();
                                break;
                        }
                    }

                })
                .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                }).show();
    }

    @ReactMethod
    public void launchCamera() {
        if (SDCardUtils.hasSdcard()) {
            GalleryFinal.openCamera(REQUEST_CODE_CAMERA, functionConfig, mOnHanlderResultCallback);
        } else {
            Toast.makeText(getCurrentActivity(), "请检查SD卡是否挂载", Toast.LENGTH_SHORT).show();
        }
    }

    @ReactMethod
    public void launchImage() {
        if (SDCardUtils.hasSdcard()) {
            GalleryFinal.openGallerySingle(REQUEST_CODE_GALLERY, functionConfig, mOnHanlderResultCallback);
        } else {
            Toast.makeText(getCurrentActivity(), "请检查SD卡是否挂载", Toast.LENGTH_SHORT).show();
        }
    }

    //选择图片或拍照后回调
    private GalleryFinal.OnHanlderResultCallback mOnHanlderResultCallback = new GalleryFinal.OnHanlderResultCallback() {
        @Override
        public void onHanlderSuccess(int reqeustCode, List<PhotoInfo> resultList) {
            PhotoInfo info = resultList.get(0);
            String path = info.getPhotoPath();
            mResponse = Arguments.createMap();
            switch (reqeustCode) {
                case REQUEST_CODE_CAMERA:
                    if (mCrop) {
                        GalleryFinal.openCrop(REQUEST_CODE_CROP, path, mOnHanlderResultCallback);
                    } else {
                        mResponse.putString("uri", path);
                        mCallback.invoke(mResponse);
                    }
                    break;
                case REQUEST_CODE_GALLERY:
                    if (mCrop) {
                        GalleryFinal.openCrop(REQUEST_CODE_CROP, mCropConfig, path, mOnHanlderResultCallback);
                    } else {
                        mResponse.putString("uri", path);
                        mCallback.invoke(mResponse);
                    }
                    break;
                case REQUEST_CODE_CROP:
                    mResponse.putString("uri", path);
                    mCallback.invoke(mResponse);
                    break;
                default:
                    break;
            }
        }

        @Override
        public void onHanlderFailure(int requestCode, String errorMsg) {
            Toast.makeText(getCurrentActivity(), errorMsg, Toast.LENGTH_SHORT).show();
        }
    };

    //将content:  uri的bitMap缓存到本地，转化为file： uri
    private Uri saveFile(String path) {
        File image;
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inSampleSize = 2;
            Bitmap tempBitMap = BitmapFactory.decodeFile(path, options);

            File tmpDir = new File(Environment.getExternalStorageDirectory() + "/fas_wuhan");
            if (!tmpDir.exists()) {
                tmpDir.mkdir();
            }
            image = new File(tmpDir + "/" + mFileName + ".png");
            FileOutputStream fos = new FileOutputStream(image);
            tempBitMap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
            tempBitMap.recycle();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return Uri.fromFile(image);
    }

    public static Uri compressImage(File file, String path, int size) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inSampleSize = 2;
            Bitmap bitmap = BitmapFactory.decodeFile(path, options);
            if (bitmap != null) {
                if (file.exists()) {
                    file.delete();
                }
                // 保存图片
                FileOutputStream fos = null;
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
                System.out.println("aaaabbbb" + baos.toByteArray().length / 1024);
                int per = 100;
                while (baos.toByteArray().length / 1024 > size) {
                    System.out.println("bbbb " + baos.toByteArray().length / 1024);
                    baos.reset();
                    bitmap.compress(Bitmap.CompressFormat.PNG, per, baos);
                    per -= 10;
                    System.out.println("aaaabbbb " + baos.toByteArray().length / 1024 + " 9999 " + per);
                }
                System.out.println("aaaabbbb" + per);
                fos = new FileOutputStream(file);
                bitmap.compress(Bitmap.CompressFormat.PNG, per, fos);
                fos.flush();
                fos.close();
            }
            if (bitmap != null && !bitmap.isRecycled()) {
                bitmap.recycle();
                bitmap = null;
                System.gc();
            }
            return Uri.fromFile(file);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

