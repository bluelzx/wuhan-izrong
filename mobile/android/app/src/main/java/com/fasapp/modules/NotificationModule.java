package com.fasapp.modules;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v7.app.NotificationCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.fasapp.MainActivity;
import com.fasapp.R;

/**
 * Created by vison on 16/5/18.
 */

public class NotificationModule extends ReactContextBaseJavaModule {

    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void showNotification(String ticker,String title,String message) {
        Bitmap btm = BitmapFactory.decodeResource(getCurrentActivity().getResources(), R.drawable.content_image_login_logo);
        NotificationCompat.Builder mBuilder = (NotificationCompat.Builder) new NotificationCompat.Builder(
                getCurrentActivity()).setSmallIcon(R.drawable.content_image_login_logo)
                .setContentTitle(title)
                .setContentText(message);
        mBuilder.setTicker(ticker);//第一次提示消息的时候显示在通知栏上
        mBuilder.setLargeIcon(btm);
        mBuilder.setAutoCancel(true);//自己维护通知的消失
       /* //构建一个Intent
        Intent resultIntent = new Intent(getCurrentActivity(),
                MainActivity.class);
        //封装一个Intent
        PendingIntent resultPendingIntent = PendingIntent.getActivity(
                getCurrentActivity(), 0, resultIntent,
                PendingIntent.FLAG_UPDATE_CURRENT);
        // 设置通知主题的意图
        mBuilder.setContentIntent(null);*/
        //获取通知管理器对象
        NotificationManager mNotificationManager = (NotificationManager) getCurrentActivity().getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, mBuilder.build());
        mNotificationManager.cancel(0);
    }
}
