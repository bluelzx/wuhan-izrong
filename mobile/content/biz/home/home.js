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
    this.toArray();
  },
  componentDidMount() {
    //setInterval(this.set, 20)
  },

  render() {
    return (
      <NavBarView navigator={this.props.navigator} title="首页" showBack={false} showBar={true}>

        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>

        </ScrollView>
      </NavBarView>
    );
  }
});

module.exports = Home;
