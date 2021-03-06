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
  AppStateIOS,
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
let Publish = require('../../biz/publish/publish');
let Chat = require('../../biz/im/chat');
ImSocket = require('../../framework/network/imSocket');
let QiniuTest = require('../../test/qiniuTest');
let Upload = require('../../biz/login/uploadNameCard');
let Account = require('../../biz/login/accountInfo');
let UserGuide = require('../../biz/personal/userGuide');

const { NETINFO_CONNECTED, NETINFO_DISCONNECTED } = require('../../constants/dictEvent');
const { KPI_TYPE } = require('../../constants/dictIm');
const DictStyle = require('../../constants/dictStyle');

var Main = React.createClass({
  _navigator: null,
  _getStateFromStores: function () {
    return {
      initLoading: AppStore.getInitLoadingState(),
      token: AppStore.getToken()
    };
  },
  getInitialState: function () {
    return _.assign(this._getStateFromStores(), {
      isLoadingVisible: false
    });
  },

  componentWillMount: function () {
    DeviceEventEmitter.addListener('saveRegId', function (e: Event) {
      //AppStore.saveAndroidPushRegId()
      Alert('saveRegId');
    })
  },

  componentDidMount: function () {
    AppStore.addChangeListener(this._onChange);
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this._onAndroidBackPressed);

      DeviceEventEmitter.addListener('onPause', function (e:Event) {
        ImSocket.disconnect();
       // AppStore.startJavaServer();
      });

      DeviceEventEmitter.addListener('onResume', function (e:Event) {
        //AppStore.stopJavaServer();
        AppAction.emitActiveApp();
      });

    } else {
      AppStateIOS.removeEventListener('change', this._handleAppStateChange);
      AppStateIOS.addEventListener('change', this._handleAppStateChange);
    }
    NotificationManager.openNotification();
    AppStore.saveNavigator(this.refs['navigator']);

    AppStore.addChangeListener(this._activeApp, 'active_app');
    AppStore.addChangeListener(this._activeApp, NETINFO_CONNECTED);
    AppStore.addChangeListener(this._activeApp, NETINFO_DISCONNECTED);
  },

  _activeApp: function () {
    if (AppStore.getNetWorkState()) {
      ImSocket.reconnect();
    } else {
      ImSocket.disconnect();
    }
  },

  _handleAppStateChange: (currentAppState) => {
    //let that = this;
    switch (currentAppState) {
      case "active":
        AppAction.emitActiveApp();
        break;
      default:
        ImSocket.disconnect();
    }
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this._onAndroidBackPressed);
    } else {
      AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    }
    NotificationManager.closeNotification();
  },

  _onAndroidBackPressed: function () {
    if (this._navigator) {
      let self = this;
      //if (this._navigator.getCurrentRoutes().length > 1) {
      //  this._navigator.pop();
      //  return true;
      //}
      const nav = self._navigator;
      const routers = nav.getCurrentRoutes();
      if (routers.length > 1) {
        const top = routers[routers.length - 1];
        if (top.ignoreBack || top.comp.ignoreBack || self.state.isLoadingVisible) {
          // 路由或组件上决定这个界面忽略back键
          return true;
        }
        const handleBack = top.handleBack || top.comp.handleBack;
        if (handleBack) {
          // 路由或组件上决定这个界面自行处理back键
          return handleBack();
        }
        // 默认行为： 退出当前界面。
        nav.pop();
        return true;
      }

      //Alert('确认退出该应用?', () => BackAndroid.exitApp(), () => {
      //});
      BackAndroid.exitApp()
      return true;
    }
    return false;
  },

  _onChange: function () {
    this.setState(this._getStateFromStores());
    if (AppStore.isLogout()) {
      ImSocket.disconnect();
      if (AppStore.isFreezing()) {
        Promise.resolve().then((resolve) => {
          this.refs.navigator.resetTo({comp: Login});
          Alert('   您的帐户已被冻结,请联系管理员')
        }).catch((e) => {
          Alert('系统异常');
        });
      } else if (AppStore.isForceLogout()) {
       // ImSocket.disconnect();
        Alert(
          '    您的账号已经在其他设备上登录了，您将被强制登出，请确认您的账号密码没有泄露',
          {text: '确定', onPress: () => this.refs.navigator.resetTo({comp: Login})}
        );
      } else if (AppStore.isDelete()) {
        Alert(
          '    您的帐户已被停用,请联系管理员',
          {text: '确定', onPress: () => this.refs.navigator.resetTo({comp: Login})}
        );
      }  else if (AppStore.isForceUpdate()) {
        Alert(
          '    当前版本不支持，请更新最新版本',
          {text: '确定', onPress: () => {
            if(Platform.OS == 'ios'){
              Linking.openURL('itms-apps://itunes.apple.com/app/id1113856020');
            }else{
              Linking.openURL('http://file.izirong.com/android/izirong.apk');
            }
          }}
        );
      } else {
        Promise.resolve().then((resolve) => {
          this.refs.navigator.resetTo({comp: Login});
        }).catch((e) => {
          Alert('系统异常');
        });
      }
    }
  },
  _exec: function (func, showLoading = true) {
    let self = this;
    if (showLoading) {
      self.setState({
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
          if(errorData.errMsg){
            Alert(errorData.errMsg);
          }else if (errorData.message) {
            if (errorData.message.includes('Network request failed')) {
              Alert('网络请求失败');
            } else {
              Alert(errorData.message);
            }
          }else if(errorData.msgCode){
            if (errorData.msgCode == 'APP_SYS_TOKEN_INVALID') {
              AppStore.forceLogout();
            }else if (errorData.msgCode == 'USER_HAS_BEEN_FROZEN') {
              AppStore.freezAccount();
            }else if (errorData.msgCode == 'USER_HAS_BEEN_DELETED') {
              AppStore.deleteLoginUser()
            } else if (errorData.msgCode == 'APP_VERSION_NOT_SUPPORT') {
              AppStore.deleteLoginUser()
            }  else {
              Alert(errorData.msgContent);
            }
          }
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
      if (route.tabName) tabName = route.tabName;
      Comp = TabView;
    }
    if (Comp == 'publish') {
      Comp = Publish;
    }
    if(Comp == 'chat') {
      Comp = Chat;
    }

    navigator.cur = Comp;
    return (
      <Comp param={route.param} navigator={navigator} callback={route.callBack} exec={this._exec} tabName={tabName}/>
    );
  },

  initSocket: function (token) {
    if (token) {
      ImSocket.init(token)
    }
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
      this.initSocket(this.state.token);
    } else {
      ImSocket.disconnect();
    }


    var modalBackgroundStyle = {
      backgroundColor: '#000000'
    };
    var innerContainerTransparentStyle = null;
    var activeButtonStyle = {
      backgroundColor: '#ddd'
    };
    var colorStyle = {
      color: '#000'
    };


    return (
      <View style={{ width: Device.width, height: Device.height }}>

        <StatusBar
          backgroundColor={DictStyle.colorSet.navBar}
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
          onDidFocus={(route) => {
            // console.log('### onDidFocus ### ' + route.comp.displayName || route.comp);
            // ImSocket.trace(KPI_TYPE.PAGE, route);
            if (AppStore.getNetWorkState()) {
              ImSocket.trace(KPI_TYPE.PAGE, route.comp.displayName || route.comp);
            }
          }}
        />
        <Loading
          // panelColor="rgba(255, 255, 255, 0.3)"
          // color="white"
          isVisible={this.state.isLoadingVisible}
        />
      </View>
    );
  }
});

module.exports = Main;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 5,
    flex: 1,
    height: 44,
    alignSelf: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 10,
  },
});

