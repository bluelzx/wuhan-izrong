package com.fasapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.view.Menu;

import com.facebook.react.ReactActivity;
import cl.json.RNSharePackage;
import io.realm.react.RealmReactPackage;

import com.facebook.react.bridge.ReactApplicationContext;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;

import com.fasapp.BuildConfig;
import com.fasapp.pakage.ZXReactPackage;
import com.fasapp.view.viewpager.ZXViewPagerManager;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
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
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new RNSharePackage(),
            new RNDeviceInfo(),
            new ZXReactPackage(this),
            new ExtraDimensionsPackage(this)
        );
    }
}
