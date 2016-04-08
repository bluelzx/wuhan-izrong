/**
 * Created by cui on 16/4/6.
 */
var React = require('react-native');
var {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
  } = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
var NavBarView = require('../../framework/system/navBarView');
var Input = require('./input');

var Remarks = React.createClass({
  getInitialState(){
    return {}
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='备注' showBack={true} showBar={true}>
        <View style={{height:10,backgroundColor:'#102a42'}}></View>
        <View>
          <Input type='default' prompt="20字以内" max={20} field="userName" isPwd={false}/>
        </View>
      </NavBarView>
    )
  },
});

var styles = StyleSheet.create({});

module.exports = Remarks;
