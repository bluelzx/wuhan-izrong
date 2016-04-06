/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {TouchableHighlight, Text, View, TextInput, Platform} = React;
let NavBarView = require('../../framework/system/navBarView');
let { Device } = require('mx-artifacts');
let ModifyGroupName = React.createClass({

  renderRight: function(){
    return (
      <TouchableHighlight onPress={()=>{
      this.props.navigator.pop();
      }}>
        <Text style={{color:'#ffffff'}}>完成</Text>
      </TouchableHighlight>

    );
  },

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#18304D' title='群名称'
                  showBar={true}
                  actionButton={this.renderRight}>
        <View style={{backgroundColor:'#18304D', paddingTop:10}}>
          <TextInput
            placeholder="创建群名称"
            placeholderTextColor="white"
            style={{color: '#ffffff',height:(Platform.OS === 'ios')?50:100, width: Device.width,backgroundColor:'#15263A', paddingHorizontal:20}}></TextInput>
        </View>
      </NavBarView>
    );
  }
});
module.exports = ModifyGroupName;
