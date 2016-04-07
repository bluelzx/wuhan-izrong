'use strict';

var React = require('react-native');
var {
  TextInput,
  View,
  Image,
  Dimensions
  } = React;
var DictIcon = require('../../constants/dictIcon');
var Input = React.createClass({

  propTypes: {
    containerStyle: View.propTypes.style,
    iconStyle: View.propTypes.style,
    inputStyle: TextInput.propTypes.style,
    inputType: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    placeholderTextColor: React.PropTypes.string,
    maxLength: React.PropTypes.number,
    value: React.PropTypes.string,
    field: React.PropTypes.string.isRequired
  },

  getDefaultProps(){
    return {
      containerStyle: {
        height: 47,
        borderColor: '#0a1926',
        borderWidth: 0.5,
        marginTop: 12,
        backgroundColor: '#0a1926',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6
      },
      iconStyle: {
        width: 16,
        height: 16,
        marginLeft: 9
      },
      inputStyle: {
        fontSize: 18,
        color: '#7f7f7f',
        marginLeft: 9,
        width: Dimensions.get('window').width * (375 - 80) / 375
      },
      placeholder: '',
      placeholderTextColor: '#7f7f7f'
      //value: ''
    };
  },

  render(){
    return (
      <View style={this.props.containerStyle}>
        <Image style={this.props.iconStyle} source={DictIcon[this.props.icon]}/>
        <TextInput
          style={this.props.inputStyle}
          underlineColorAndroid="transparent"
          onChangeText={(text) => this.props.onChangeText(this.props.field, text)}
          maxLength={this.props.maxLength}
          defaultValue={this.props.defaultValue}
          secureTextEntry={this.props.inputType === 'password'}
          autoCorrect={false}
          autoCapitalize="none"
          value={this.props.value}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          clearButtonMode="while-editing"
          keyboardType={this.props.inputType === 'number' ? 'numeric' : 'ascii-capable'}
        />
      </View>
    );
  }
});

module.exports = Input;
