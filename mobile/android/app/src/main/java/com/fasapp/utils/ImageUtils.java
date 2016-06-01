package com.fasapp.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;

/**
 * Created by vison on 16/5/31.
 */
public class ImageUtils {

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
