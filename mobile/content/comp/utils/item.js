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
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');

let Item = React.createClass({
  getDefaultProps(){
    return {
      img: true,
      top: false,
      icon: true
    };
  },

  returnImg(){
    if (this.props.img) {
      return (
        <Image style={styles.circle} source={this.props.imgPath}/>
      );
    }
  },

  renderArrow: function (hiddenArrow) {
    if (!hiddenArrow) {
      return (
        <Icon style={{marginRight: 20}} name="ios-arrow-right" size={30} color={PlainStyle.colorSet.arrowColor}/>
      );
    }
    return (
      <View>

      </View>);
  },

  render(){
    let {hiddenArrow = false, wrap=false, itemStyle={}, top=false} = this.props;
    return (
      <TouchableHighlight activeOpacity={0.8} underlayColor= {PlainStyle.colorSet.content} onPress={this.props.func}>
        <View>
          <View style={[styles.listLayout, top && DictStyle.userInfoBorderTop,this.props.bottom && DictStyle.userInfoBorderBottom]}>
            <View style={{flexDirection: 'row', backgroundColor: 'transparent', flex: 2}}>
              {this.returnImg()}
              <Text style={styles.title}>{this.props.desc}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 3, backgroundColor:'transparent' , justifyContent: 'flex-end'}}>
              <Text style={[DictStyle.userInfoValueItem,{width: 150, marginRight: 20},wrap && {flexWrap:'wrap'}]}
                    numberOfLines={ wrap ? 3 : 1 }
              >
                {this.props.value}
              </Text>
              {this.renderArrow(hiddenArrow)}
            </View>
          </View>
          <View style={styles.bottomStyle}/>
        </View>
      </TouchableHighlight>
    );
  }
});
let styles = StyleSheet.create({

  listLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 51,
    paddingLeft: 16,
    backgroundColor: PlainStyle.colorSet.personalItemColor
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
    color: PlainStyle.colorSet.commonTextColor,
    width: Dimensions.get('window').width - 20
  },
  bottomStyle: {
    height: 1,
    backgroundColor: PlainStyle.colorSet.userInfoBorderColor,
  }
});
module.exports = Item;
