'use strict';

var React = require('react-native');
var {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} = React;
var { Icon } = require('react-native-vector-icons/Ionicons');
var AppStore = require('../store/appStore');
var RequestState = require('../../constants/requestState');
// var VIcon = require('../../comp/icon/vIcon')

let ProgressHUD = require('react-native-progress-hud');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var { Alert } = require('mx-artifacts');
var NavBarView = React.createClass({
  _curRoute: null,
  mixins: [ProgressHUD.Mixin],

  PropTypes: {
    showBar: React.PropTypes.bool,
    showBack: React.PropTypes.bool,
    title: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    fontColor: React.PropTypes.string,
    contentBackgroundColor: React.PropTypes.string,
    actionButton: React.PropTypes.func,
    navBarBottomWidth: React.PropTypes.string
  },
  getDefaultProps: function () {
    return {
      showBar: true,
      showBack: true,
      title: '',
      backgroundColor: '#f7f7f7',
      fontColor: '#333333',
      contentBackgroundColor: '#f0f0f0',
      actionButton: null,
      // customLoading: false,
      navBarBottomWidth: 1
    };
  },
  componentDidMount: function () {
    AppStore.addChangeListener(this._onChange, 'rpc');
    this._curRoute = this.props.navigator.getCurrentRoutes().slice().pop();
  },
  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, 'rpc');
    this._curRoute = this.props.navigator.getCurrentRoutes().slice().pop();
  },
  _onChange: function () {
    var route = this.props.navigator.getCurrentRoutes().slice().pop();
    var cur = this.props.navigator.cur;
    if (cur === this._curRoute.comp || route.comp === 'login') {
      // if (!this.props.customLoading) {
        switch (AppStore.requestLoadingState()) {
          case RequestState.START:
            this.showProgressHUD();
            break;
          case RequestState.END:
            this.dismissProgressHUD();
            Promise.resolve().then(() => {
              AppStore.requestHandle()();
            }).catch((e) => {
              Alert('系统异常');
            });
            break;
          default:
        }
      // }
    }
  },
  _renderLeft: function () {
    if (this.props.showBack) {
      return (
        <TouchableOpacity
          // style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}
          onPress={() => this.props.navigator.pop()}
        >
          <Icon name="ios-arrow-left" size={30} color={this.props.fontColor} />
        </TouchableOpacity>
      );
    }
  },
  _renderRight: function () {
    if (this.props.actionButton) {
      return this.props.actionButton();
    }
  },
  _renderBar: function () {
    if (this.props.showBar) {
      return (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: this.props.backgroundColor,
            borderBottomWidth: this.props.navBarBottomWidth,
            borderColor: '#c8c7cc',
            justifyContent: 'space-between',
            alignItems: 'center',
            // paddingHorizontal: 6
            height: (Platform.OS === 'ios') ? 64 : 44,
            paddingTop: (Platform.OS === 'ios') ? 20 : 0
          }}
        >
          <View style={{width: 44}}>
            {this._renderLeft()}
          </View>

          <View>
            <Text style={{ fontSize: 18, color: this.props.fontColor }}>
              {this.props.title}
            </Text>
          </View>

          <View style={{width: 44}}>
            {this._renderRight()}
          </View>
        </View>
      );
    }
  },

  render: function () {
    return (
      <View style={{ flex: 1 }} onStartShouldSetResponder={() => dismissKeyboard()}>
        {this._renderBar()}

        <View style={{ flex: 1, backgroundColor: this.props.contentBackgroundColor }} >
            {this.props.children}
        </View>

        <View style={{ height: Platform.OS === 'ios' ? 49 : 0 }}/>

        <ProgressHUD
          isVisible={this.state.is_hud_visible}
          isDismissible={false}
          overlayColor="rgba(0, 0, 0, 0)"
        />
      </View>
    );
  }
});

module.exports = NavBarView;
