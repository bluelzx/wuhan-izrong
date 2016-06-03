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
let NavBarView = require('../../framework/system/navBarView');
let AppLinks = require('../../constants/appLinks');
let {Alert} = require('mx-artifacts');

let PrivacyPolicy = React.createClass({

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='隐私政策'>
        <WebView
          style={styles.webView}
          source={{uri: AppLinks.privacy}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          startInLoadingState={true}
          onError={this.loadError}
        />
      </NavBarView>
    )
  },

  loadError: function () {
    Alert("请检查网络连接")
  }
});

let styles = StyleSheet.create({
  webView: {
    flex: 1
  }

});

module.exports = PrivacyPolicy;
