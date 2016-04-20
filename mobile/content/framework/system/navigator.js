'use strict';
var React = require('react-native');
var {
  StatusBar,
  Navigator,
  StyleSheet,
  Text,
  View,
  BackAndroid,
  DeviceEventEmitter,
  Platform,
  ToastAndroid
  } = React;
var AppAction = require('../action/appAction');
var ImAction = require('../action/imAction');
AppAction.appInit();
var TabView = require('./tabView');
var Login = require('../../biz/login/login');
var AppStore = require('../store/appStore');
let { Alert, Device } = require('mx-artifacts');
let ProgressHUD = require('react-native-progress-hud');
let co = require('co');
let NotificationManager = require('./notificationManager');

let Chat = require('../../biz/im/chat');

var Main = React.createClass({
  _navigator: null,
  mixins: [ProgressHUD.Mixin],
  _getStateFromStores: function() {
    return {
      initLoading: AppStore.getInitLoadingState(),
      token: AppStore.getToken()
    };
  },
  getInitialState: function() {
    return this._getStateFromStores();
  },
  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this._onAndroidBackPressed);
      // Codes to test notifications.
      // DeviceEventEmitter.addListener('Test', function(e: Event) {
      //   console.log(e.test);
      // });
    }
    NotificationManager.openNotification();

  },
  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this._onAndroidBackPressed);
    }
    NotificationManager.closeNotification();
  },
  _onAndroidBackPressed: function () {
    if (this._navigator) {
      if (this._navigator.getCurrentRoutes().length > 1) {
        this._navigator.pop();
        return true;
      }

      if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
        //最近2秒内按过back键，可以退出应用。
        return false;
      }
      this.lastBackPressed = Date.now();
      ToastAndroid.show('再按一次退出应用');
      return true;
    }

    return false;
  },

  _onChange: function () {
    this.setState(this._getStateFromStores());
    if (AppStore.isLogout()) {
      if (AppStore.isForceLogout()) {
        Alert(
          '账号已在别处登陆,系统将切换到登陆界面',
          {text: '确定', onPress: () => this.refs.navigator.resetTo({comp: Login})}
        );
      } else {
        Promise.resolve().then((resolve) => {
          this.refs.navigator.resetTo({comp: TabView});
        }).catch((e) => {
          Alert('系统异常');
        });
      }
    }
  },
  _exec: function (func, showLoading = true) {
    let self = this;
    if (showLoading) {
      this.showProgressHUD();
    }

    co(function* () {
      yield func()
        .then((response) => {
          console.log(response);
        })
        .catch((errorData) => {
          if (showLoading) {
            self.dismissProgressHUD();
          }

          console.log(errorData);
          Alert(errorData.msgContent || errorData.message);
        });

      if (showLoading) {
        self.dismissProgressHUD();
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  _renderScene: function (route, navigator) {
    this._navigator = navigator;
    var Comp = route.comp;
    if (Comp == 'tabView') {
      Comp = TabView;
    }
    navigator.cur = Comp;
    return (
      <Comp param={route.param} navigator={navigator} callback={route.callBack} exec={this._exec}/>
    );
  },
  render: function () {
    if (this.state.initLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFFFFF'
          }}
        >
          <Text>数据加载中,请稍后...</Text>
        </View>
      );
    }

    var initComp = Login;
    //var initComp = Chat;
    if (this.state.token) {
      initComp = TabView;
      ImAction.imInit();
    }
    return (
      <View style={{ width: Device.width, height: Device.height }}>
        <StatusBar
          backgroundColor="#1151B1"
          barStyle="light-content"
          hidden={false}
        />

        <Navigator
          ref="navigator"
          renderScene={this._renderScene}
          configureScene={(route) => ({
            ...route.sceneConfig || Navigator.SceneConfigs.HorizontalSwipeJump,
            gestures: route.gestures
          })}
          initialRoute={{
            //comp: Login
            comp: initComp
          }}
        />

        <ProgressHUD
          isVisible={this.state.is_hud_visible}
          isDismissible={false}
          overlayColor="rgba(0, 0, 0, 0)"
        />
      </View>
    );
  }
});

module.exports = Main;
