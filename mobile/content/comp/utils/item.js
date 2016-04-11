'use strict';

let React = require('react-native');
let {
  Image,
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  Dimensions
  } = React;
let Icon = require('react-native-vector-icons/Ionicons');
let { Device } = require('mx-artifacts');

let Item = React.createClass({
  getDefaultProps(){
    return {
      img: true,
      top: false,
      icon: true
    }
  },

  returnImg(){
    if (this.props.img) {
      return (
        <Image style={styles.circle} source={this.props.imgPath}/>
      )
    }
  },

  render(){
    return (
      <TouchableHighlight activeOpacity={0.8} underlayColor='#18304D' onPress={this.props.func}>
        <View>
          <View style={[styles.listLayout,this.props.top && styles.borderTop]}>
            <View style={{flex:1,flexDirection:'row'}}>
              {this.returnImg()}
              <Text style={styles.title} numberOfLines={1}>{this.props.desc}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={[{fontSize: 15,color: '#162a40'}]}>{this.props.value}</Text>
              <Icon style={{marginRight:20}} name="ios-arrow-right" size={30} color={'#ffffff'}/>
            </View>
          </View>
          <View style={styles.bottomStyle}/>
        </View>
      </TouchableHighlight>
    )
  }
})
let styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1,
  },
  listLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 51,
    paddingLeft: 16,
    backgroundColor: '#162a40'
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 1,
    marginRight: 16
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
    width: Dimensions.get('window').width - 20
  },
  bottomStyle: {
    height: 0.5,
    backgroundColor: '#0a1926',
    marginLeft:20
  }

})
module.exports = Item;
