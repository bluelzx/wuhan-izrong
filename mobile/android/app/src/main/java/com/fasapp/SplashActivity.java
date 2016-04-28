package com.fasapp;

import android.app.Activity;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.widget.ImageView;

public class SplashActivity extends Activity implements Animation.AnimationListener{
    private ImageView mImageView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        mImageView = (ImageView) findViewById(R.id.iv_splash);
        initData();
    }

    @Override
    public void onAnimationStart(Animation animation) {

    }

    @Override
    public void onAnimationEnd(Animation animation) {
        startActivity(new Intent(SplashActivity.this, MainActivity.class));
    }

    @Override
    public void onAnimationRepeat(Animation animation) {

    }

    public void initData() {
        AnimationSet set = new AnimationSet(false);
        AlphaAnimation alphaAnimation = new AlphaAnimation(0, 1f);
//        ScaleAnimation scaleAnimation = new ScaleAnimation(0, 1f, 0, 1f, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        set.addAnimation(alphaAnimation);
//        set.addAnimation(scaleAnimation);
        set.setAnimationListener(this);
        set.setDuration(3000);
        mImageView.setAnimation(set);
        set.start();
    }
}
