package com.fasapp.modules;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.fasapp.utils.FileUtils;
import com.fasapp.utils.ImageUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

import cn.finalteam.galleryfinal.FunctionConfig;
import cn.finalteam.galleryfinal.GalleryFinal;
import cn.finalteam.galleryfinal.model.PhotoInfo;

/**
 * Created by vison on 16/4/11.
 */
public class UserPhotoPicModule extends ReactContextBaseJavaModule {
    private Callback mCallback;
    private boolean mCrop;
    private String mFileName;
    private WritableMap mResponse;
    private File file;
    private Uri uri;
    private boolean cropSquare;
    private String cachePath;
    private String cacheDir = getReactApplicationContext().getExternalFilesDir(null).getAbsolutePath() + "/fasCache/";
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
    public void compressImage(String uri, String fileName, final Callback callback) {
        cachePath = cacheDir + fileName + "compress" + ".jpg";
        File file = new File(cachePath);
        Uri tempUri = ImageUtils.compressImage(file, uri);
        mResponse = Arguments.createMap();
        mResponse.putString("uri", tempUri.toString());
        callback.invoke(mResponse);
    }

    @ReactMethod
    public void showImagePic(String type, boolean needCrop, String fileName, boolean cropSquare, Callback callback) {
        showImagePicBySize(type, needCrop, fileName, cropSquare, callback);
    }

    @ReactMethod
    public void showImagePicBySize(String type, boolean needCrop, String name, boolean cropSquare, Callback callback) {
        this.mCrop = needCrop;
        this.mFileName = name;
        this.mCallback = callback;
        cachePath = cacheDir + mFileName + ".jpg";
        mCropConfig = new FunctionConfig.Builder()
                .setEnableCrop(needCrop)
                .setEnableRotate(true)
                .setCropSquare(cropSquare)
                .setEnablePreview(true)
                .setMutiSelectMaxSize(5)
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
        GalleryFinal.openCamera(REQUEST_CODE_CAMERA, functionConfig, mOnHanlderResultCallback);
    }

    @ReactMethod
    public void launchImage() {
        GalleryFinal.openGallerySingle(REQUEST_CODE_GALLERY, functionConfig, mOnHanlderResultCallback);
    }

    //选择图片或拍照后回调
    public GalleryFinal.OnHanlderResultCallback mOnHanlderResultCallback = new GalleryFinal.OnHanlderResultCallback() {
        @Override
        public void onHanlderSuccess(int reqeustCode, List<PhotoInfo> resultList) {
            PhotoInfo info = resultList.get(0);
            String path = info.getPhotoPath();
            mResponse = Arguments.createMap();
            switch (reqeustCode) {
                case REQUEST_CODE_CAMERA:
                    if (mCrop) {
                        GalleryFinal.openCrop(REQUEST_CODE_CROP, mCropConfig, path, mOnHanlderResultCallback);
                    } else {
                        mResponse.putString("uri", FileUtils.copyFile(path, cachePath, cacheDir).toString());
                        mCallback.invoke(mResponse);
                    }
                    break;
                case REQUEST_CODE_GALLERY:
                    if (mCrop) {
                        GalleryFinal.openCrop(REQUEST_CODE_CROP, mCropConfig, path, mOnHanlderResultCallback);
                    } else {
                        mResponse.putString("uri", FileUtils.copyFile(path, cachePath, cacheDir).toString());
                        mCallback.invoke(mResponse);
                    }
                    break;
                case REQUEST_CODE_CROP:
                    mResponse.putString("uri", FileUtils.renameToFile(path, cachePath, cacheDir).toString());
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
            FileInputStream is = new FileInputStream(path);
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inSampleSize = 1;
            Bitmap tempBitMap = BitmapFactory.decodeStream(is, null, options);
            is.close();
            File tmpDir = new File(this.getReactApplicationContext().getExternalFilesDir(null).getAbsolutePath() + "/fasCache");
            //File tmpDir = new File(ExternalStorage.getSdCardPath()+ "/fasCache");
            if (!tmpDir.exists()) {
                tmpDir.mkdir();
            }
            image = new File(tmpDir + "/" + mFileName + ".jpg");
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
}

