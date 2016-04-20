'use strict';

var React = require('react-native');
var {
  PushNotificationIOS,
  AppStateIOS,
  Platform,
  ScrollView,
  View,
  TabBarIOS
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

var ScrollableTabView = require('../../comp/tabBar/scrollableTabView');
var AndroidTabBar = require('../../comp/tabBar/tabBar');

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
    //  if (Platform.OS == 'ios') {
    //    PushNotificationIOS.setApplicationIconBadgeNumber(sum);
    //  }
    //  return {
    //    billSum: show,
    //    token: token
    //  }
    //} else {
      return {
        token: token
      }
    //}
  },

  //componentDidMount() {
  //  AppStore.addChangeListener(this._onChange);
  //  if (Platform.OS === 'ios') {
  //    if (!AppStore.getAPNSToken()) {
  //      PushNotificationIOS.requestPermissions();
  //    }
  //
  //    PushNotificationIOS.removeEventListener('register', AppAction.notificationRegister);
  //    PushNotificationIOS.removeEventListener('notification', AppAction.onNotification);
  //    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  //
  //
  //    PushNotificationIOS.addEventListener('register', AppAction.notificationRegister);
  //    PushNotificationIOS.addEventListener('notification', AppAction.onNotification);
  //
  //    AppStateIOS.addEventListener('change', this._handleAppStateChange);
  //  }
  //},
  //
  //componentWillUnmount: function () {
  //  if (Platform.OS === 'ios') {
  //    AppStore.removeChangeListener(this._onChange);
  //    PushNotificationIOS.removeEventListener('register', AppAction.notificationRegister);
  //    PushNotificationIOS.removeEventListener('notification', AppAction.onNotification);
  //    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  //    PushNotificationIOS.setApplicationIconBadgeNumber(0);
  //  }
  //},

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
    return _.assign(
      this.getStateFromStores(),
      {selectedTab: 'home'}
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
            <Home navigator={this.props.navigator} />
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
            selected={this.state.selectedTab === 'publish'}
            onPress={() => {this.setState({selectedTab: 'publish'});}}>
            <Publish  navigator={this.props.navigator} exec={this.props.exec}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="IM"
            badge={0}
            icon={require('../../image/tab/IM.png')}
            selected={this.state.selectedTab === 'IM'}
            onPress={() => {this.setState({selectedTab: 'IM'})}}>
            <IM navigator={this.props.navigator} />
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="个人"
            icon={require('../../image/tab/personalcenter.png')}
            selected={this.state.selectedTab === 'personalCenter'}
            onPress={() => {this.setState({selectedTab: 'personalCenter'})}}>
            <Personal navigator={this.props.navigator} />
          </TabBarIOS.Item>

        </TabBarIOS>
      );
    } else {
      return (
        <ScrollableTabView initialPage={0} locked={true}
                           renderTabBar={() => <AndroidTabBar />}
        >
          <Home navigator={this.props.navigator}
                tabDesc="首页"
                icon={require('../../image/tab/home.png')}
                selectedIcon={require('../../image/tab/home-selected.png')}>
          </Home>

          <Market navigator={this.props.navigator}
                  tabDesc="市场"
                  icon={require('../../image/tab/market.png')}
                  selectedIcon={require('../../image/tab/market-selected.png')}>
          </Market>

          <Publish navigator={this.props.navigator}
                   tabDesc="发布"
                   icon={require('../../image/tab/publish.png')}
                   selectedIcon={require('../../image/tab/publish-selected.png')}>
          </Publish>


          <IM navigator={this.props.navigator}
              tabDesc="IM"
              icon={require('../../image/tab/IM.png')}
              selectedIcon={require('../../image/tab/IM-selected.png')}>
          </IM>

          <Personal navigator={this.props.navigator}
                    tabDesc="个人"
                    icon={require('../../image/tab/personalcenter.png')}
                    selectedIcon={require('../../image/tab/personalcenter-selected.png')}>
          </Personal>

        </ScrollableTabView>
      );
    }
  },
});

module.exports = TabView;
