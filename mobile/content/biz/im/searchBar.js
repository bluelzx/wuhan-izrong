/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
let Icon = require('react-native-vector-icons/Ionicons');
const {View, TextInput, Platform,TouchableOpacity, Text} = React;
let DictStyle = require('../../constants/dictStyle');

let SearchBar = React.createClass({

  getInitialState: function() {
    return {
      editAble:false,
      text:''
    }
  },

  propTypes:{
    textChange:React.PropTypes.func.isRequired,
    textOnBlur:React.PropTypes.func.isRequired,
  },

  textChange: function(text){
    this.props.textChange(text);
    this.setState({text:text});
  },

  renderBar: function() {
    if(this.state.text!='' || this.state.editAble) {
      return (
        <TextInput
          autoFocus={this.state.editAble}
          onBlur={() => {
          this.setState({editAble:false});
          this.props.textOnBlur && this.props.textOnBlur();
          }
          }
          onFocus={() => this.setState({editAble:true}) }
          onChangeText={(text) => this.textChange(text)}
          returnKeyType={'search'}
          selectionColor={DictStyle.colorSet.searchBarColor}
          style={{color: DictStyle.colorSet.searchBarColor, height:(Platform.OS === 'ios')?30:60,backgroundColor:'#ffffff',marginTop:0,marginLeft:10,marginRight:10}}>
        </TextInput>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => {this.setState({editAble:true})}}
          style={{height:(Platform.OS === 'ios')?30:60,justifyContent:'center', alignItems:'center',backgroundColor:'#ffffff',marginTop:0,marginLeft:10,marginRight:10,alignSelf:'stretch'}}
        >
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Icon name="ios-search-strong" size={22} color={DictStyle.colorSet.searchBarColor} />
            <Text style={{color:DictStyle.colorSet.searchBarColor, marginLeft:5, fontSize:16, fontWeight:'normal'}}>搜索</Text>
          </View>
        </TouchableOpacity>
      );
    }
  },

  render: function() {
    return (
      <View style={{backgroundColor:'#f0f0f0',paddingBottom:5,borderBottomColor:'#d3d5e0',borderBottomWidth:0.5}}>
        <View
          style={{height:40,backgroundColor:'#ffffff',marginTop:5,marginLeft:10,marginRight:10,borderRadius:6,
          justifyContent:'center', alignItems:'center'}}>
          {this.renderBar()}
        </View>
      </View>
    );
  }
});

module.exports = SearchBar;
