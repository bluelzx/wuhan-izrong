package com.fasapp;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.stetho.common.LogUtil;
import com.fasapp.utils.LogUtils;
import com.fasapp.utils.RNCacheViewManager;
import com.fasapp.utils.ReactNativeAutoUpdater;
import com.fasapp.utils.RnInfo;

import java.io.File;

public class SplashActivity extends Activity implements Animation.AnimationListener{
    private ImageView mImageView;
    private TextView tvUpdate;
    private ReactNativeAutoUpdater updater;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        mImageView = (ImageView) findViewById(R.id.iv_splash);
        tvUpdate = (TextView) findViewById(R.id.tvUpdate);
        initData();
    }


    public void initData() {
//        RNCacheViewManager.init(SplashActivity.this, new RnInfo("FasApp", new Bundle()));
        AnimationSet set = new AnimationSet(false);
        AlphaAnimation alphaAnimation = new AlphaAnimation(0, 1f);
        set.addAnimation(alphaAnimation);
        set.setAnimationListener(this);
        set.setDuration(1000);
        mImageView.setAnimation(set);
        set.start();
    }

    @Override
    public void onAnimationStart(Animation animation) {
    }

    @Override
    public void onAnimationEnd(Animation animation) {
//        finish();
        startActivity(new Intent(SplashActivity.this, MainActivity.class));
    }

    public void setTvUpdateVisible () {
        tvUpdate.setVisibility(View.VISIBLE);
    }

    public void setTvUpdateText (String text) {
        tvUpdate.setText(text);
    }

    protected String getUpdateMetadataUrl(){
        return "http://192.168.64.205:9101/fas/pub/rnupdate/meta?type=ANDROID_PATCH";
    }

    protected String getMetadataAssetName(){
        return "metadata.android.json";
    }

    protected String getHostnameForRelativeDownloadURLs() {
        return null;
    }

    protected ReactNativeAutoUpdater.ReactNativeAutoUpdaterUpdateType getAllowedUpdateType() {
        return ReactNativeAutoUpdater.ReactNativeAutoUpdaterUpdateType.PATCH;
    }

    protected ReactNativeAutoUpdater.ReactNativeAutoUpdaterFrequency getUpdateFrequency() {
        return ReactNativeAutoUpdater.ReactNativeAutoUpdaterFrequency.EACH_TIME;
    }

    protected boolean getShowProgress() {
        return true;
    }

    @Override
    public void onAnimationRepeat(Animation animation) {

    }

    public void finishAct() {
        finish();
        startActivity(new Intent(SplashActivity.this, MainActivity.class));
    }
}
