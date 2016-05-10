/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Text, ScrollView, View, TouchableOpacity} = React;
let NavBarView = require('../../framework/system/navBarView');
let DateHelper = require('../../comp/utils/dateHelper');

let Spread = React.createClass({

  getInitialState: function(){
    return {};
  },

  renderItem: function(item){
    return (
        <View
          style={{flexDirection:'column',backgroundColor:'#FEFEFE',paddingHorizontal:10,margin:10,paddingTop:10,borderRadius:10}}>
          <Text  style={{color:'#8694A0',fontWeight:'bold',fontSize:16}}>{item.title}</Text>
          <Text  style={{color:'#8694A0', marginTop:15}}>{item.content}</Text>
          <Text  style={{color:'#8694A0', marginTop:15, marginBottom:15, textAlign:'right'}}>{DateHelper.descDate(item.createDate)}</Text>
        </View>
    );
  },


  render: function () {
    return (
      <NavBarView
        navigator={this.props.navigator} title='详细内容'>
        <ScrollView style={{flexDirection: 'column'}}>
          {this.renderItem(this.props.param.item)}
        </ScrollView>
      </NavBarView>
    );
  }
});
module.exports = Spread;
