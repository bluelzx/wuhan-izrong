/**
 * Created by cui on 16/4/6.
 */
let React = require('react-native');
let {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  } = React;

let DictStyle = require('../../constants/dictStyle');
let NavBarView = require('../../framework/system/navBarView');
let {Alert} = require('mx-artifacts');

let Remarks = React.createClass({
  getInitialState(){
    return {
      remarkText:this.props.param.remarkText
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='备注' actionButton={this.renderFinish}>
        <View style={{backgroundColor:'white',marginTop:10}}>
          <TextInput
            value={this.state.remarkText}
            placeholder={'50字以内'}
            placeholderTextColor='#d3d5df'
            returnKeyType="search"
            maxLength={50}
            onChangeText={(value) => this.onChangeText(value)}
            underlineColorAndroid={'transparent'}
            clearButtonMode="while-editing"
            style={{width:DictStyle.fullScreen.width - 20,height:40,marginLeft:10,marginRight:10,color:'#495154'}}/>
        </View>
      </NavBarView>
    )
  },
  renderFinish: function () {
    return (
      <TouchableOpacity onPress={()=>this.finish()}>
        <Text style={{color:'white'}}>{'完成'}</Text>
      </TouchableOpacity>
    );
  },
  onChangeText(value){
    this.setState({remarkText: value});
  },
  finish: function () {
    if(this.state.remarkText.length >50){
      Alert('字数超过限制(50字以内)')
    }else {
      this.props.param.callBackRemarks(this.state.remarkText);
      this.props.navigator.pop();
    }
  }
});

let styles = StyleSheet.create({});

module.exports = Remarks;
