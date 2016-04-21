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


let Remarks = React.createClass({
  getInitialState(){
    return {
      remarksText:''
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='备注' showBack={true} showBar={true}
                  actionButton={this.renderFinish}>
        <View style={{backgroundColor:'#1e3754',marginTop:10}}>
          <TextInput
            placeholder={'20字以内'}
            placeholderTextColor='#325779'
            returnKeyType="search"
            maxLength={20}
            onChangeText={(value) => this.onChangeText(value)}
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
    this.setState({remarksText: value});
  },
  finish: function () {
    this.props.param.callBackRemarks(this.state.remarksText);
    this.props.navigator.pop();
  },
});

let styles = StyleSheet.create({});

module.exports = Remarks;
