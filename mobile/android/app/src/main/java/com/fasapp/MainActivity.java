package com.fasapp;


import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.huawei.android.pushagent.PushManager;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.fasapp.pakage.ZXReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tencent.android.tpush.XGPushManager;
import com.tencent.android.tpush.service.XGPushService;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Nullable;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import cl.json.RNSharePackage;
import io.realm.react.RealmReactPackage;

public class MainActivity extends ReactActivity {
    public static final String RNAU_SHARED_PREFERENCES = "React_Native_Auto_Updater_Shared_Preferences";
    public static final String RNAU_STORED_VERSION = "React_Native_Auto_Updater_Stored_Version";
    public static ReactApplicationContext context;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "FasApp";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected void onStart() {
        super.onStart();
    }


    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFSPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RNSharePackage(),
            new RNDeviceInfo(),
            new ZXReactPackage(this),
            new ExtraDimensionsPackage(this)
        );
    }

    @Nullable
    @Override
    protected String getBundleAssetName() {
        return "index.android.bundle";
    }

    @Nullable
    @Override
    protected String getJSBundleFile() {
//        SharedPreferences prefs = this.getApplicationContext().getSharedPreferences(RNAU_SHARED_PREFERENCES, Context.MODE_PRIVATE);
//        String bundle = prefs.getString(RNAU_STORED_VERSION, "bundle");
//        String jsBundleFile = getDir("jsCode", Context.MODE_PRIVATE).getAbsolutePath() + "/bundle"+ bundle +"/index.android.bundle";
//        File file = new File(jsBundleFile);
//        return file.exists() ? jsBundleFile : null;
        return null;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        PushManager.requestToken(MainActivity.this);
        String sdk=android.os.Build.VERSION.SDK;
        String model=android.os.Build.MODEL;
        String release=android.os.Build.VERSION.RELEASE;
        Log.d("MainActivity", "SDK: " + sdk + "   model: " + model + "   release: " + release);
        //        PushManager.getInstance().initialize(this.getApplicationContext());
                // 开启logcat输出，方便debug，发布时请关闭
        // XGPushConfig.enableDebug(this, true);
        // 如果需要知道注册是否成功，请使用registerPush(getApplicationContext(), XGIOperateCallback)带callback版本
        // 如果需要绑定账号，请使用registerPush(getApplicationContext(),account)版本
        // 具体可参考详细的开发指南
        // 传递的参数为ApplicationContext
//        Context context = getApplicationContext();
//        XGPushManager.registerPush(context);

        // 2.36（不包括）之前的版本需要调用以下2行代码
//        Intent service = new Intent(context, XGPushService.class);
//        context.startService(service);


        // 其它常用的API：
        // 绑定账号（别名）注册：registerPush(context,account)或registerPush(context,account, XGIOperateCallback)，其中account为APP账号，可以为任意字符串（qq、openid或任意第三方），业务方一定要注意终端与后台保持一致。
        // 取消绑定账号（别名）：registerPush(context,"*")，即account="*"为取消绑定，解绑后，该针对该账号的推送将失效
        // 反注册（不再接收消息）：unregisterPush(context)
        // 设置标签：setTag(context, tagName)
        // 删除标签：deleteTag(context, tagName)
    }


}
