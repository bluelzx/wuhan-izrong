'use strict';

/**
 * Rewrite function console.log
 * @type {(function(this:(Console|*)))|*|Server}
 * @private
 */
const __log = window.console.log.bind(console);
const {Dev} = require('../../../config');
window.console.log = function () {
  if (Dev) {
    __log(...arguments);
  }
};

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
//var ImAction = require('../action/imAction');
let ImSocket = require('../network/imSocket');
AppAction.appInit();
var TabView = require('./tabView');
var Login = require('../../biz/login/login');
var AppStore = require('../store/appStore');
let { Alert, Device, Loading } = require('mx-artifacts');
let _ = require('lodash');
let co = require('co');
let NotificationManager = require('./notificationManager');

var Main = React.createClass({
  _navigator: null,
  _getStateFromStores: function() {
    return {
      initLoading: AppStore.getInitLoadingState(),
      token: AppStore.getToken()
    };
  },
  getInitialState: function() {
    return _.assign(this._getStateFromStores(), {
      isLoadingVisible: false
    });
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

    AppStore.saveNavigator(this.refs['navigator']);

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
      this.setState({
        isLoadingVisible: true
      });
    }

    co(function* () {
      yield func()
        .then((response) => {
          console.log(response || '');
        })
        .catch((errorData) => {
          if (showLoading) {
            self.setState({
              isLoadingVisible: false
            });
          }
          console.log(errorData);
          Alert(errorData.msgContent || errorData.message);
        });

      if (showLoading) {
        self.setState({
          isLoadingVisible: false
        });
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  _renderScene: function (route, navigator) {
    this._navigator = navigator;
    var Comp = route.comp;
    let tabName = null;
    if (Comp == 'tabView') {
      if(route.tabName) tabName = route.tabName;
      Comp = TabView;
    }
    navigator.cur = Comp;
    return (
      <Comp param={route.param} navigator={navigator} callback={route.callBack} exec={this._exec} tabName={tabName}/>
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
      ImSocket.init(this.state.token,()=>{
        let sTime = AppStore.getLoginUserInfo();
        return sTime && sTime.lastSyncTime;
      });
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
            comp: initComp
          }}
        />

        <Loading
          panelColor="rgba(255, 255, 255, 0.3)"
          isVisible={this.state.isLoadingVisible}
        />
      </View>
    );
  }
});

module.exports = Main;
