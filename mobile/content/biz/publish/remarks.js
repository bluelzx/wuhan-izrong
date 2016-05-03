/**
 * Created by cui on 16/4/6.
 */
let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  TextInput,
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
let {Alert} = require('mx-artifacts');

let Remarks = React.createClass({
  getInitialState(){
    return {
      remarkText:this.props.param.remarkText
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='备注' showBack={true} showBar={true}
                  actionButton={this.renderFinish}>
        <View style={{backgroundColor:'#1e3754',marginTop:10}}>
          <TextInput
            value={this.state.remarkText}
            placeholder={'20字以内'}
            placeholderTextColor='#325779'
            returnKeyType="search"
            maxLength={20}
            onChangeText={(value) => this.onChangeText(value)}
            underlineColorAndroid={'transparent'}
            style={{width:screenWidth,height:40,marginLeft:10,color:'white',}}/>
        </View>
      </NavBarView>
    )
  },
  renderFinish: function () {
    return (
      <TouchableOpacity style={{width:75}}
                        onPress={()=>this.finish()}>
        <Text style={{color:'#ffffff'}}>{'完成'}</Text>
      </TouchableOpacity>
    );
  },
  onChangeText(value){
    this.setState({remarkText: value});
  },
  finish: function () {
    if(this.state.remarkText.length >20){
      Alert('字数超过限制(20字以内)')
    }else {
      this.props.param.callBackRemarks(this.state.remarkText);
      this.props.navigator.pop();
    }
  }
});

let styles = StyleSheet.create({});

module.exports = Remarks;
