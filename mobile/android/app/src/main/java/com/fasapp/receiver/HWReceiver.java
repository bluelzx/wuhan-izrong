package com.fasapp.receiver;

import android.app.NotificationManager;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import com.fasapp.BaseApplication;
import com.huawei.android.pushagent.api.PushEventReceiver;

/*
 * 接收Push所有消息的广播接收器
 */
public class HWReceiver extends PushEventReceiver {

    /*
     * 显示Push消息
     */
    public void showPushMessage(int type, String msg) {
    }

    @Override
    public void onToken(Context context, String token, Bundle extras){
        String belongId = extras.getString("belongId");
        String content = "获取token和belongId成功，token = " + token + ",belongId = " + belongId;
        BaseApplication.regId = token;
        BaseApplication.deviceModel = "HUAWEI";
        Log.d("HWReceiver.onToken", content);

    }


    @Override
    public boolean onPushMsg(Context context, byte[] msg, Bundle bundle) {
        try {
            String content = "收到一条Push消息： " + new String(msg, "UTF-8");
            Log.d("HWReceiver.onPushMsg", content);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public void onEvent(Context context, Event event, Bundle extras) {
        if (Event.NOTIFICATION_OPENED.equals(event) || Event.NOTIFICATION_CLICK_BTN.equals(event)) {
            int notifyId = extras.getInt(BOUND_KEY.pushNotifyId, 0);
            if (0 != notifyId) {
                NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                manager.cancelAll();
            }
            String content = "收到通知附加消息： " + extras.getString(BOUND_KEY.pushMsgKey);
            Log.d("HWReceiver.onEvent.true", content);
        } else if (Event.PLUGINRSP.equals(event)) {
            final int TYPE_LBS = 1;
            final int TYPE_TAG = 2;
            int reportType = extras.getInt(BOUND_KEY.PLUGINREPORTTYPE, -1);
            boolean isSuccess = extras.getBoolean(BOUND_KEY.PLUGINREPORTRESULT, false);
            String message = "";
            if (TYPE_LBS == reportType) {
                message = "LBS report result :";
            } else if(TYPE_TAG == reportType) {
                message = "TAG report result :";
            }
            Log.d("HWReceiver.onEvent.f", message + isSuccess);
        }
        super.onEvent(context, event, extras);
    }
}