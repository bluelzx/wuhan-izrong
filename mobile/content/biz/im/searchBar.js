/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
let Icon = require('react-native-vector-icons/Ionicons');
const {View, TextInput, Platform,TouchableOpacity, Text} = React;

let SearchBar = React.createClass({

  getInitialState: function() {
    return {
      editAble:false
    }
  },

  propTypes:{
    textChange:React.PropTypes.func.isRequired
  },

  textChange: function(text){
    this.props.textChange(text);
  },

  renderBar: function() {
    if(this.state.editAble) {
      return (
        <TextInput
          autoFocus={this.state.editAble}
          onBlur={() => this.setState({editAble:false})}
          onChangeText={(text) => this.textChange(text)}
          returnKeyType={'search'}
          multiline={true}
          style={{color: '#ffffff',height:(Platform.OS === 'ios')?30:60,backgroundColor:'#15263A',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}></TextInput>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => {this.setState({editAble:true})}}
          style={{height:(Platform.OS === 'ios')?30:60,justifyContent:'center', alignItems:'center',backgroundColor:'#15263A',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}
        >
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
            <Icon name="ios-search-strong" size={20} color='#ffffff' />
            <Text style={{color:'#ffffff', marginLeft:5, fontSize:18}}>搜索</Text>
          </View>
        </TouchableOpacity>
      );
    }
  },

  render: function() {
    return (
      <View style={{backgroundColor:'#18304D',paddingBottom:5}}>
        <View
          style={{height:30,backgroundColor:'#15263A',marginTop:5,marginLeft:10,marginRight:10,borderRadius:4}}>
          {this.renderBar()}
        </View>
      </View>
    );
  }
});

module.exports = SearchBar;
