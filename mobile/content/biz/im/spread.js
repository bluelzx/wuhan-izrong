/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Text, TouchableHighlight, TouchableOpacity,View} = React;
let NavBarView = require('../../framework/system/navBarView');
let EditGroup = require('./editGroup');
let Icon = require('react-native-vector-icons/Ionicons');

let Spread = React.createClass({

  render: function () {
    return (
      <NavBarView
        navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
        contentBackgroundColor='#15263A' title='环渤海银银合作平台'
        showBar={true}
      >
        <View style={{flexDirection:'column',backgroundColor:'#FEFEFE',paddingHorizontal:10,margin:10,paddingVertical:10,borderRadius:10}}>
          <Text numberOfLines={1} style={{color:'#8694A0',fontWeight:'bold',fontSize:16}}>标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</Text>
          <Text numberOfLines={3} style={{color:'#8694A0', marginTop:15}}>一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九一二三四五六七八九</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between',marginTop:10,borderTopWidth:0.5,borderTopColor:'#8694A0',paddingTop:10}}>
            <Text style={{color:'#8694A0'}}>查看详情</Text>
            <View style={{flexDirection:'row', justifyContent:'flex-end',alignItems:'center'}}>
              <Text style={{color:'#8694A0'}}>2015-09-18</Text>
              <Icon name={'ios-arrow-right'} size={18} color={'#8694A0'}/>
            </View>
          </View>
        </View>
      </NavBarView>
    );
  }
});
module.exports = Spread;
