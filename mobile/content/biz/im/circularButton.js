/**
 * Created by baoyinghai on 16/4/6.
 */
let React  = require('react-native');
const {View, Text, TouchableOpacity} = React;

let CircularButton = React.createClass({

  onPress:function(){
    this.props.onPress();
  },

  render: function() {
    return (
      <TouchableOpacity style={{alignItems:'center',padding:5}} onPress={this.onPress}>
        <View>
          <View
            style={{marginTop:5,borderWidth:1,borderColor: '#F3AD2C', height: 54,width: 54,borderRadius: 27,justifyContent:'center',alignItems:'center'}}>
            <View
              style={{borderWidth:1,borderColor: '#F3AD2C', height: 50,width: 50,borderRadius: 25,justifyContent:'center',alignItems:'center'}}>
              {this.props.children}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

});

module.exports = CircularButton;
