/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {View, TextInput, Platform} = React;

let SearchBar = React.createClass({

  propTypes:{
    textChange:React.PropTypes.func.isRequired
  },

  textChange: function(text){
    this.props.textChange(text);
  },

  render: function() {
    return (
      <View style={{backgroundColor:'#18304D',paddingBottom:5}}>
        <View
          style={{height:30,backgroundColor:'#15263A',marginTop:5,marginLeft:10,marginRight:10,borderRadius:4}}>
          <TextInput
            placeholderTextColor="white"
            placeholder={'搜索'}
            onChangeText={(text) => this.textChange(text)}
            returnKeyType={'search'}
            style={{color: '#ffffff',height:(Platform.OS === 'ios')?30:60,backgroundColor:'#15263A',marginTop:(Platform.OS === 'ios')?0:-15,marginLeft:10,marginRight:10}}></TextInput>
        </View>
      </View>
    );
  }
});

module.exports = SearchBar;
