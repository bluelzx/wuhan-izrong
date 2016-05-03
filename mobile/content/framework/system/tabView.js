'use strict';

var React = require('react-native');
var {
  PushNotificationIOS,
  AppStateIOS,
  Platform,
  ScrollView,
  View,
  TabBarIOS,
    Navigator
  } = React;
var Home = require('../../biz/home/home');
var Market = require ('../../biz/market/market');
var Publish = require('../../biz/publish/publish');
var IM = require('../../biz/im/im');
var Personal = require('../../biz/personal/personal');
//var Message = require("../../biz/message/messageList")
//var PersonCenter = require("../../biz/personalCenter/personalCenter")
var AppAction = require('../action/appAction');
var AppStore = require('../store/appStore');
//var MessageStore = require('../../framework/store/messageStore');
//var TabBarIOS = require('./tabBarIOS.ios.fas')
//var Alert = require('../../comp/utils/alert');
//var Login = require('../../biz/login/login')
let {Alert} = require('mx-artifacts');

let MarketAction = require('../action/marketAction');

var ScrollableTabView = require('../../comp/tabBar/scrollableTabView');
var AndroidTabBar = require('../../comp/tabBar/tabBar');
const PageDic = {
  home:0,
  market:1,
  publish:2,
  IM: 3,
  personalCenter:4

};
var TabView = React.createClass({
  getStateFromStores() {
    var token = AppStore.getToken();
    //var mainMsgBean = MessageStore.getMainMsgBean();
    //if (token != null) {
    //  var sum = 0;
    //  var billSum = 0;
    //  mainMsgBean.messageBeans.forEach(function (object) {
    //    billSum += ((object.isRead) ? 0 : 1)
    //  });
    //  sum = billSum;
    //  var show = sum >= 99 ? "99+" : sum;
     if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(AppStore.getBadge());
     }
    //  return {
    //    billSum: show,
    //    token: token
    //  }
    //} else {
      return {
        token: token,
        initialPage: 0,
        badge: AppStore.getBadge()
      }
    //}
  },

  // componentWillMount() {
  //   MarketAction.bizOrderMarketSearchDefaultSearch()
  //     .catch((errorData) => {
  //       Alert(errorData.msgContent || errorData.message);
  //     });
  // },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
    //if (Platform.OS === 'ios') {
    //  if (!AppStore.getAPNSToken()) {
    //    PushNotificationIOS.requestPermissions();
    //  }
    //
    //  PushNotificationIOS.removeEventListener('register', AppAction.notificationRegister);
    //  PushNotificationIOS.removeEventListener('notification', AppAction.onNotification);
    //  AppStateIOS.removeEventListener('change', this._handleAppStateChange);
    //
    //
    //  PushNotificationIOS.addEventListener('register', AppAction.notificationRegister);
    //  PushNotificationIOS.addEventListener('notification', AppAction.onNotification);
    //
    //  AppStateIOS.addEventListener('change', this._handleAppStateChange);
    //}
    AppStore.addChangeListener(this._onChange,'IM_SESSION_LIST');
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
    if (Platform.OS === 'ios') {
    //  AppStore.removeChangeListener(this._onChange);
    //  PushNotificationIOS.removeEventListener('register', AppAction.notificationRegister);
    //  PushNotificationIOS.removeEventListener('notification', AppAction.onNotification);
    //  AppStateIOS.removeEventListener('change', this._handleAppStateChange);
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
    AppStore.removeChangeListener(this._onChange,'IM_SESSION_LIST')
  },

  _handleAppStateChange: function (currentAppState) {
    switch (currentAppState) {
      case "active":
        AppAction.freshNotification();
        break;
    }
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getInitialState: function () {
    let tabName = this.props.tabName;
    if(!tabName){
      tabName = 'home';
    }
    let initialPage = PageDic[tabName];
    return _.assign(
      this.getStateFromStores(),
      {selectedTab: tabName, initialPage: initialPage}
    );
  },

  render: function () {
    var navigator = this.props.navigator;
    if (Platform.OS === 'ios') {
      return (
        <TabBarIOS selectedTab={this.state.selectedTab}
                   translucent={true}
                   tintColor={'#ffffff'} barTintColor={'#1156C0'}>
          <TabBarIOS.Item
            title="首页"
            icon={require('../../image/tab/home.png')}
            selected={this.state.selectedTab === 'home'}
            onPress={() => {this.setState({selectedTab: 'home'});}}>
            <Home navigator={this.props.navigator} exec={this.props.exec}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="市场"
            icon={require('../../image/tab/market.png')}
            selected={this.state.selectedTab === 'market'}
            onPress={() => {this.setState({selectedTab: 'market'})}}>
            <Market navigator={this.props.navigator} exec={this.props.exec}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="发布"
            icon={require('../../image/tab/publish.png')}
            //selected={this.state.selectedTab === 'publish'}
            onPress={() => {
            this.props.navigator.push({
                comp: Publish,
                sceneConfig: Navigator.SceneConfigs.FloatFromBottomAndroid
            });
            }}>
            <Publish  navigator={this.props.navigator} exec={this.props.exec}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="IM"
            badge={this.state.badge || null}
            icon={require('../../image/tab/IM.png')}
            selected={this.state.selectedTab === 'IM'}
            onPress={() => {this.setState({selectedTab: 'IM'})}}>
            <IM navigator={this.props.navigator} exec={this.props.exec}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="个人"
            icon={require('../../image/tab/personalcenter.png')}
            selected={this.state.selectedTab === 'personalCenter'}
            onPress={() => {this.setState({selectedTab: 'personalCenter'})}}>
            <Personal navigator={this.props.navigator} exec={this.props.exec}/>
          </TabBarIOS.Item>

        </TabBarIOS>
      );
    } else {
      return (
        <ScrollableTabView initialPage={this.state.initialPage} locked={true}
                           renderTabBar={() => <AndroidTabBar />}
        >
          <Home navigator={this.props.navigator}
                tabDesc="首页"
                icon={require('../../image/tab/home.png')}
                selectedIcon={require('../../image/tab/home-selected.png')}
                exec={this.props.exec}
          >
          </Home>

          <Market navigator={this.props.navigator}
                  tabDesc="市场"
                  icon={require('../../image/tab/market.png')}
                  selectedIcon={require('../../image/tab/market-selected.png')}
                  exec={this.props.exec}
          >
          </Market>

          <View
            navigator={this.props.navigator}
            tabDesc="发布"
            icon={require('../../image/tab/publish.png')}
            selectedIcon={require('../../image/tab/publish-selected.png')}
            exec={this.props.exec}
            onPress={() => {navigator.push({
            comp: Publish,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottomAndroid
            })}}
          >
          </View>


          <IM navigator={this.props.navigator}
              tabDesc="IM"
              icon={require('../../image/tab/IM.png')}
              selectedIcon={require('../../image/tab/IM-selected.png')}
              exec={this.props.exec}
          >
          </IM>

          <Personal navigator={this.props.navigator}
                    tabDesc="个人"
                    icon={require('../../image/tab/personalcenter.png')}
                    selectedIcon={require('../../image/tab/personalcenter-selected.png')}
                    exec={this.props.exec}
                    delay={true}
                    page={4}
          >
          </Personal>

        </ScrollableTabView>
      );
    }
  },
});

module.exports = TabView;
