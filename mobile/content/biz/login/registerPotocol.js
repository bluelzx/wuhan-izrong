/**
 * Created by vison on 16/4/15.
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  WebView
  } = React;
let lodash = require('lodash');
let AppStore = require('../../framework/store/appStore');
let NavBarView = require('../../framework/system/navBarView');
let AppLinks = require('../../constants/appLinks');

let RegisterPotocol = React.createClass({

  getInitialState: function () {
    return {

    }
  },
  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='用户协议'>
        <WebView
          style={styles.webView}
          source={{uri: AppLinks.registerProtocol}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          startInLoadingState={true}
        />
      </NavBarView>
    )
  }
});

let styles = StyleSheet.create({
  webView:{
    flex:1
  }

});

module.exports = RegisterPotocol;
