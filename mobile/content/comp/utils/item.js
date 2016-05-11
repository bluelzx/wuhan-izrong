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
    let {hiddenArrow = false, wrap=false} = this.props;
    return (
      <TouchableHighlight activeOpacity={0.8}  onPress={this.props.func}>
        <View>
          <View style={[styles.listLayout, this.props.top && styles.borderTop]}>
            <View style={{flexDirection: 'row', backgroundColor: PlainStyle.colorSet.personalItemColor, flex: 2}}>
              {this.returnImg()}
              <Text style={styles.title}>{this.props.desc}</Text>
            </View>
            <View
              style={{flexDirection: 'row', alignItems: 'center', flex: 3, backgroundColor:PlainStyle.colorSet.personalItemColor , justifyContent: 'flex-end'}}
            >
              <Text style={[DictStyle.userInfoValueItem,{width: 150, marginRight: 20},wrap && {flexWrap:'wrap'}]}
                    numberOfLines={ wrap ? 0 : 1 }
              >
                {this.props.value}
              </Text>
              {this.renderArrow(this.props.hiddenArrow)}
            </View>
          </View>
          <View style={styles.bottomStyle}/>
        </View>
      </TouchableHighlight>
    );
  }
});
let styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1
  },
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
    marginLeft: 20
  }
});
module.exports = Item;
