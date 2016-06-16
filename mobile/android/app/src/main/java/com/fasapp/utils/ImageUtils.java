package com.fasapp.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by vison on 16/5/31.
 */
public class ImageUtils {

    public static Uri loopCompressImage(File file, String path, int size) {
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
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
                fos = new FileOutputStream(file);
                if (baos.toByteArray().length / 1024 /1024 <= 1) {
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 70, fos);
                } else if (baos.toByteArray().length / 1024 /1024 <= 3) {
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 50, fos);
                } else if (baos.toByteArray().length / 1024 /1024 <= 5) {
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 30, fos);
                } else {
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 10, fos);
                }
                fos.flush();
                fos.close();
//                if(baos.toByteArray().length / 1024 / 1024 <= 1 ){
//                    bitmap.compress(Bitmap.CompressFormat.JPEG, 80, baos);
//                }else if(baos.toByteArray().length / 1024 /1024 <= 3 ){
//                    bitmap.compress(Bitmap.CompressFormat.JPEG, 60, baos);
//                }else if(baos.toByteArray().length / 1024 /1024 <= 5 ){
//                    bitmap.compress(Bitmap.CompressFormat.JPEG, 40, baos);
//                }else if(baos.toByteArray().length / 1024 /1024 <= 7 ){
//                    bitmap.compress(Bitmap.CompressFormat.JPEG, 20, baos);
//                }
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

    public static Uri compressImage(File file, String path) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inSampleSize = 2;
            Bitmap bitmap = BitmapFactory.decodeFile(path, options);
            if (bitmap != null) {
                if (file.exists()) {
                    file.delete();
                }
                // 保存图片
                FileOutputStream fos = new FileOutputStream(file);
                //引入baos,计算图片大小
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.WEBP, 100, baos);
                System.out.println("aaaabbbb" + baos.toByteArray().length / 1024);
                if (baos.toByteArray().length / 1024 <= 1) {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 100, fos);
                    fos.flush();
                } else if (baos.toByteArray().length / 1024 <= 3) {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 50, fos);
                    fos.flush();
                } else if (baos.toByteArray().length / 1024 <= 5) {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 30, fos);
                    fos.flush();
                } else {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 10, fos);
                    fos.flush();
                }
                fos.close();
            }
            if (bitmap != null && !bitmap.isRecycled()) {
                bitmap.recycle();
                System.gc();
            }
            return Uri.fromFile(file);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String compressImage1(String path, String cachePath, String cacheDir) {
        File f = new File(cacheDir);
        if (!f.exists()) {
            f.mkdirs();
        }
        File cacheFile = new File(cachePath);
        File originFile = new File(path);
        FileInputStream fis;
        Bitmap bitmap;
        try {
            fis = new FileInputStream(originFile);
            bitmap = BitmapFactory.decodeStream(fis);
            if (bitmap != null) {
                FileOutputStream fos = new FileOutputStream(cacheFile);
                //bitmap.compress(Bitmap.CompressFormat.PNG, 50, fos);
                //引入baos,计算图片大小
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.WEBP, 100, baos);
                System.out.println("aaaabbbb" + baos.toByteArray().length / 1024);
                if (baos.toByteArray().length / 1024 <= 1) {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 100, fos);
                    fos.flush();
                } else if (baos.toByteArray().length / 1024 <= 3) {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 50, fos);
                    fos.flush();
                } else if (baos.toByteArray().length / 1024 <= 5) {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 30, fos);
                    fos.flush();
                } else {
                    bitmap.compress(Bitmap.CompressFormat.WEBP, 10, fos);
                    fos.flush();
                }
                fos.close();
                return Uri.fromFile(cacheFile).toString();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


}
