/**
 * Created by vison on 16/4/5.
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Platform
  } = React;
var AppStore = require('../../framework/store/appStore');
//var UserStore = require('../../framework/store/userStore');
var LoginAction = require('../../framework/action/loginAction');
//var Register_checkPhone = require('./register_checkPhone');
//var Forget_checkPhone = require('./forget_checkPhone');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Input = require('../../comp/utils/input');
var { Alert, Button } = require('mx-artifacts');


var Register_uploadNameCard = React.createClass({
  getStateFromStores() {
    return {};
  },
  getInitialState: function () {
    return this.getStateFromStores();
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

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },
  selectPhoto: function () {

  },
  returnImage: function(){
    return(
      <TouchableHighlight style={styles.nameCard} activeOpacity={0.8} underlayColor='#18304b'
                          onPress={()=>this.selectPhoto()}>
        <View style={{flexDirection:'column',alignItems:'center'}}>

             <Text style={{color:'#ffffff'}}>点击上传名片</Text>
        </View>
      </TouchableHighlight>
      );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='上传名片' showBack={true} showBar={true}>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          {this.returnImage()}
        </View>
      </NavBarView>
    )
  }
});
var styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  nameCard: {
    backgroundColor: '#0a1926',
    borderWidth: 1,
    borderColor: '#1151B1',
    height:200,
    marginTop:20,
    borderRadius:6
  }
});

module.exports = Register_uploadNameCard;
