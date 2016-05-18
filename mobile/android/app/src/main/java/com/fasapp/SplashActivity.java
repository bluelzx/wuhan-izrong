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
import com.fasapp.utils.ReactNativeAutoUpdater;

import java.io.File;

public class SplashActivity extends Activity implements Animation.AnimationListener,ReactNativeAutoUpdater.Interface{
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

    @Override
    public void onAnimationStart(Animation animation) {
    }

    @Override
    public void onAnimationEnd(Animation animation) {
        updater = ReactNativeAutoUpdater.getInstance(this);
        updater.setUpdateMetadataUrl(this.getUpdateMetadataUrl())
                .setMetadataAssetName(this.getMetadataAssetName())
                .setUpdateFrequency(this.getUpdateFrequency())
                .setUpdateTypesToDownload(this.getAllowedUpdateType())
                .setHostnameForRelativeDownloadURLs(this.getHostnameForRelativeDownloadURLs())
                .showProgress(this.getShowProgress())
                .setParentActivity(this)
                .checkForUpdates();
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

    public void initData() {
        AnimationSet set = new AnimationSet(false);
        AlphaAnimation alphaAnimation = new AlphaAnimation(0, 1f);
        set.addAnimation(alphaAnimation);
        set.setAnimationListener(this);
        set.setDuration(3000);
        mImageView.setAnimation(set);
        set.start();
    }

    @Override
    public void updateFinished() {
//        try {
//            AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(SplashActivity.this);
//            alertDialogBuilder.setTitle(R.string.auto_updater_downloaded_title);
//            alertDialogBuilder
//                    .setMessage(R.string.auto_updater_downloaded_message)
//                    .setCancelable(false)
//                    .setPositiveButton(
//                            R.string.auto_updater_downloaded_now,
//                            new DialogInterface.OnClickListener() {
//                                public void onClick(DialogInterface dialog, int id) {
//                                    SplashActivity.this.recreate();
//                                }
//                            }
//                    )
//                    .setNegativeButton(
//                            R.string.auto_updater_downloaded_later,
//                            new DialogInterface.OnClickListener() {
//                                public void onClick(DialogInterface dialog, int id) {
//                                    dialog.cancel();
//                                    finishAct();
//                                }
//                            }
//                    );
//
//            AlertDialog alertDialog = alertDialogBuilder.create();
//            alertDialog.show();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
        finishAct();
    }

    public void finishAct() {
        finish();
        startActivity(new Intent(SplashActivity.this, MainActivity.class));
    }
}
