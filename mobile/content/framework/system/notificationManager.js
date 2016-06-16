/**
 * Created by amarsoft on 16/4/11.
 */
"use strict";
var React = require('react-native');
var {
  PushNotificationIOS,
  Platform,
  DeviceEventEmitter,
  AppStateIOS
  } = React;
var CommonAction = require('../action/commonAction');
var AppStore = require('../store/appStore');

let _handleAppStateChange = function (currentAppState) {
  //if (AppStore.getRevBillMessage()) {
  console.log('############## app state : ' + currentAppState);
    //switch (currentAppState) {
    //  case "active":
    //  {
    //    let navigator = AppStore.getNavigator();
    //    console.log('############## app state : ' + navigator);
    //    navigator&&navigator.push({comp:'tabView',tabName:'IM'});
    //    break;
    //  }
    //}
  //}
}

module.exports = {

  openNotification:function() {

      if (Platform.OS === 'ios') {
        if (!AppStore.getAPNSToken()) {
          PushNotificationIOS.requestPermissions();
        }
        PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
        PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
        AppStateIOS.removeEventListener('change', _handleAppStateChange);


        PushNotificationIOS.addEventListener('register', CommonAction.notificationRegister);
        PushNotificationIOS.addEventListener('notification', CommonAction.onNotification);

        AppStateIOS.addEventListener('change', _handleAppStateChange);

      } else {
        DeviceEventEmitter.addListener('Msg', (e:Event)=>CommonAction.onNotification());
        DeviceEventEmitter.addListener('MsgByNotification', (e:Event)=> {
          CommonAction.onNotification();
        });

      }

  },
  closeNotification:function(){
      if (Platform.OS === 'ios') {
        PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
        PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
        //AppStateIOS.removeEventListener('change', _handleAppStateChange);
        //PushNotificationIOS.setApplicationIconBadgeNumber(0);
      }
  }


}
