/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {TouchableOpacity, Text, View, TextInput, Platform} = React;
let NavBarView = require('../../framework/system/navBarView');
let { Device, Alert } = require('mx-artifacts');
let ContactAction = require('../../framework/action/contactAction');
let Setting = require('../../constants/setting');
let DictStyle = require('../../constants/dictStyle');

let ModifyGroupName = React.createClass({

  getInitialState: function(){
    return {
      groupName:this.props.param.groupName
    };
  },

  modifyGroupName: function(){
    if(this.state.groupName.length > Setting.groupNameLengt){
      Alert('群名称不能超过20个字符');
      return ;
    }else if(this.state.groupName.trim().length == 0){
      Alert('群名称不能为空');
      return;
    }

    this.props.exec(()=>{
      return ContactAction.modifyGroupName(this.props.param.groupId, this.state.groupName).then((response)=>{
        Alert('修改成功', () => {
          this.props.navigator.pop();
        })

      });
    });

  },

  renderRight: function(){
    return (
      <TouchableOpacity onPress={()=>{
      this.modifyGroupName();
      }}>
        <Text style={{color:(this.state.groupName.length == 0 || this.state.groupName.length > Setting.groupNameLengt) ?'#9FB3F3':'white'}}>完成</Text>
      </TouchableOpacity>

    );
  },

  changeTextValue: function(text){
    this.setState({groupName:text});
  },

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='群名称' actionButton={this.renderRight}>
        <View style={{backgroundColor:DictStyle.colorSet.content, paddingTop:10}}>
          <TextInput
            maxLength={20}
            placeholder="创建群名称"
            placeholderTextColor="44B5E6"
            value={this.state.groupName}
            onChangeText={(text) => this.changeTextValue(text)}
            style={{color: '#44B5E6',height:50, width: Device.width,backgroundColor:DictStyle.colorSet.textEditBackground, paddingHorizontal:20}}></TextInput>
        </View>
      </NavBarView>
    );
  }
});
module.exports = ModifyGroupName;
