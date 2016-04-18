/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {TouchableOpacity, Text, View, TextInput, Platform} = React;
let NavBarView = require('../../framework/system/navBarView');
let { Device } = require('mx-artifacts');
let ContactAction = require('../../framework/action/contactAction');

let ModifyGroupName = React.createClass({

  getInitialState: function(){
    return {
      groupName:this.props.param.groupName
    };
  },

  modifyGroupName: function(){

    this.props.exec(()=>{
      return ContactAction.modifyGroupName(this.props.param.groupId, this.state.groupName).then((response)=>{
        this.props.navigator.pop();
      });
    });

  },

  renderRight: function(){
    return (
      <TouchableOpacity onPress={()=>{
      this.modifyGroupName();
      }}>
        <Text style={{color:'#ffffff'}}>完成</Text>
      </TouchableOpacity>

    );
  },

  changeTextValue: function(text){
    this.setState({groupName:text});
  },

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#18304D' title='群名称'
                  showBar={true}
                  actionButton={this.renderRight}>
        <View style={{backgroundColor:'#18304D', paddingTop:10}}>
          <TextInput
            clearButtonMode="always"
            placeholder="创建群名称"
            placeholderTextColor="white"
            value={this.state.groupName}
            onChangeText={(text) => this.changeTextValue(text)}
            style={{color: '#ffffff',height:50, width: Device.width,backgroundColor:'#15263A', paddingHorizontal:20}}></TextInput>
        </View>
      </NavBarView>
    );
  }
});
module.exports = ModifyGroupName;
