/**
 * Created by vison on 16/4/15.
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  } = React;
let lodash = require('lodash');
let AppStore = require('../../framework/store/appStore');
let NavBarView = require('../../framework/system/navBarView');


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
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='注册协议' showBack={true} showBar={true}>

      </NavBarView>
    )
  }
});

let styles = StyleSheet.create({


});

module.exports = RegisterPotocol;
