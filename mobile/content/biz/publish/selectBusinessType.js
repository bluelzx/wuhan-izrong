/**
 * Created by cui on 16/4/5.
 */
let React = require('react-native');
let {
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

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let NavBarView = require('../../framework/system/navBarView');

let SelectBusinessType = React.createClass({
  render: function () {
    return (
      <TouchableOpacity  activeOpacity={0.8} underlayColor="#f0f0f0">
        <View
          style={{width: screenWidth-20,margin:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
          <Text style={{fontSize:16,marginLeft:10,color:'white'}}>{'选择发布机构'}</Text>
          <Image style={{margin:10,width:16,height:16}}
                 source={require('../../image/market/next.png')}
          />
        </View>
      </TouchableOpacity>
    )
  },


});

let styles = StyleSheet.create({});

module.exports = SelectBusinessType;
