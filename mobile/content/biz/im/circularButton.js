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
            style={{marginTop:5,borderWidth:1,borderColor: '#F3AD2C', height: 40,width: 40,borderRadius: 20,justifyContent:'center',alignItems:'center'}}>
            <View
              style={{borderWidth:1,borderColor: '#F3AD2C', height: 36,width: 36,borderRadius: 18,justifyContent:'center',alignItems:'center'}}>
              {this.props.children}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

});

module.exports = CircularButton;
