'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  Platform,
  Animated
  }=React
//var Swiper = require('../../comp/utils/swiper')
//var Calculator = require('../personalCenter/calculator');
var NavBarView = require('../../framework/system/navBarView');
var {height, width} = Dimensions.get('window');
var Home = React.createClass({
  getInitialState(){
    return ({
      num: 423324,
    });
  },
  componentWillMount(){
    //this.toArray();
  },
  componentDidMount() {
    //setInterval(this.set, 20)
  },

  render() {
    return (
      <NavBarView navigator={this.props.navigator} title='首页' fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#18304D' showBack={false} showBar={true}>

      </NavBarView>
    );
  }
});

module.exports = Home;
