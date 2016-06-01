package com.fasapp.utils;

import android.app.Activity;
import android.os.Bundle;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.fasapp.pakage.ZXReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import cl.json.RNSharePackage;
import io.realm.react.RealmReactPackage;

public class RnInfo {

    private String mModuleName;
    private Bundle mLaunchOptions;

    public RnInfo(String moduleName) {
        this.mModuleName = moduleName;
    }

    public RnInfo(String moduleName, Bundle launchOptions) {
        this.mModuleName = moduleName;
        this.mLaunchOptions = launchOptions;
    }


    public Bundle getLaunchOptions() {
        return mLaunchOptions;
    }


    public String getMainComponentName() {
        return mModuleName;
    }


    public String getJSMainModuleName() {
        return "index.android";
    }

    public String getJSBundleFile() {
        return null;
    }

    public boolean getUseDeveloperSupport() {
        return true;
    }

    public static Activity getActivity() {
        Class activityThreadClass = null;
        try {
            activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
            Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
            activitiesField.setAccessible(true);
            Map activities = (Map) activitiesField.get(activityThread);
            for (Object activityRecord : activities.values()) {
                Class activityRecordClass = activityRecord.getClass();
                Field pausedField = activityRecordClass.getDeclaredField("paused");
                pausedField.setAccessible(true);
                if (!pausedField.getBoolean(activityRecord)) {
                    Field activityField = activityRecordClass.getDeclaredField("activity");
                    activityField.setAccessible(true);
                    Activity activity = (Activity) activityField.get(activityRecord);
                    return activity;
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getBundleAssetName() {
        return "index.android.bundle";
    }

    public List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new RNFSPackage(),
                new RealmReactPackage(),
                new VectorIconsPackage(),
                new RNSharePackage(),
                new RNDeviceInfo(),
                new ZXReactPackage(getActivity()),
                new ExtraDimensionsPackage(getActivity())
        );
    }
}
