package com.fasapp.service;

import android.app.NotificationManager;

import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.app.PendingIntent;

import java.net.URI;
import java.net.URISyntaxException;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fasapp.utils.LogUtils;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import com.fasapp.R;
import com.fasapp.MainActivity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import com.fasapp.modules.ServiceModule;

/**
 * Created by amarsoft on 2016/1/17.
 */
public class AppService extends Service {

  //  private static String MY_PKG_NAME = "com.amarsoft.zxbill_fe_android";
    private WebSocketClient mWebSocketClient;
    private NotificationManager manager;
    private NotificationCompat.Builder mBuilder;

    @Override
    public void onCreate() {
        super.onCreate();

        URI uri;
        final String url_str = "ws://"+ ServiceModule.getHOST() +"/"+ ServiceModule.getToken() + "?lastSyncTime=" + ServiceModule.getLastSyncTime() + "&AIBG=0";
        LogUtils.d("url_str",url_str);
        try {
            uri = new URI(url_str);
        } catch (URISyntaxException e) {
            e.printStackTrace();
            return;
        }

        mWebSocketClient =  new WebSocketClient(uri) {
            @Override
            public void onOpen(ServerHandshake serverHandshake) {
                LogUtils.d("onOpen" , url_str);
                //  mWebSocketClient.send("Hello from " + Build.MANUFACTURER + " " + Build.MODEL);
            }

            @Override
            public void onMessage(String s) {
                JSONObject mJSONObject = JSON.parseObject(s);
                String errMsg = mJSONObject.getString("errMsg");
                if(errMsg==null){
                    //TODO: 解析格式并显示到通知栏
                    if(mJSONObject.getString("msgType").equals("ANDRIOD_NOTIFY")){
                        String content = mJSONObject.getString("content");
                        Intent mIntent = new Intent(AppService.this, MainActivity.class);
                        PendingIntent mPendingIntent = PendingIntent.getActivity(AppService.this,
                                0, mIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                        manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                        Bitmap mBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
                       // CharSequence appName = R.string.app_name;
                        mBuilder = new NotificationCompat.Builder(AppService.this)
                                .setLargeIcon(mBitmap)
                                .setSmallIcon(R.mipmap.ic_launcher)
                                .setContentTitle("消息通知")
                                .setContentText(content)
                                .setWhen(System.currentTimeMillis())
                                .setTicker("环渤银通")
                                .setAutoCancel(true)
                                .setContentIntent(mPendingIntent);
                        manager.notify(121, mBuilder.build());
                    }
                }else{
                    String content = errMsg;
                    Intent mIntent = new Intent(AppService.this, MainActivity.class);
                    PendingIntent mPendingIntent = PendingIntent.getActivity(AppService.this,
                            0, mIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                    manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                    Bitmap mBitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
                    mBuilder = new NotificationCompat.Builder(AppService.this)
                            .setLargeIcon(mBitmap)
                            .setSmallIcon(R.mipmap.ic_launcher)
                            .setContentTitle("消息通知")
                            .setContentText(content)
                            .setWhen(System.currentTimeMillis())
                            .setTicker("Ticker")
                            .setAutoCancel(true)
                            .setContentIntent(mPendingIntent);
                    manager.notify(121, mBuilder.build());
                }
                LogUtils.d("errMsg", mJSONObject.getString("errMsg"));
            }

            @Override
            public void onClose(int i, String s, boolean b) {
                LogUtils.d("Closed " , s);
            }

            @Override
            public void onError(Exception e) {
                LogUtils.d("Error " , e.getMessage());
            }
        };
        Log.d("true", "AppService");
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        LogUtils.d("AppService:onStartCommand");
        flags = START_STICKY;
        mWebSocketClient.connect();
        return super.onStartCommand(intent, flags, startId);
    }


    @Override
    public void onDestroy() {
        mWebSocketClient.close();
        LogUtils.d("AppService:onDestroy");

    }


    @Override
    public IBinder onBind(Intent intent) {
        LogUtils.d("AppService" + "onBind");
        return null;
    }

}
