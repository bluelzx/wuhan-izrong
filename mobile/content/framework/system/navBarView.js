'use strict';

let React = require('react-native');
let {
  View,
  TouchableOpacity,
  Text
} = React;
let Icon = require('react-native-vector-icons/Ionicons');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Device } = require('mx-artifacts');

let NavBarView = React.createClass({
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
      navBarBottomWidth: 1
    };
  },
  _renderLeft: function () {
    if (this.props.showBack) {
      return (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
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
            borderColor: '#A47441',
            justifyContent: 'space-between',
            alignItems: 'center',
            // paddingHorizontal: 6
            height: Device.navBarHeight,
            paddingTop: Device.statusBarHeight
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

      </View>
    );
  }
});

module.exports = NavBarView;
