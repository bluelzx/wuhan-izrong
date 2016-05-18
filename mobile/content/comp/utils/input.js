'use strict';

let React = require('react-native');
let {
  TextInput,
  View,
  Image,
  Dimensions
  } = React;
let DictIcon = require('../../constants/dictIcon');
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');
let Input = React.createClass({

  propTypes: {
    containerStyle: View.propTypes.style,
    iconStyle: View.propTypes.style,
    inputStyle: TextInput.propTypes.style,
    inputType: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    placeholderTextColor: React.PropTypes.string,
    maxLength: React.PropTypes.number,
    value: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    onFocus: React.PropTypes.func,
    onLayout: React.PropTypes.func
  },

  getDefaultProps(){
    return {
      containerStyle: {
        height: 47,
        borderColor: PlainStyle.colorSet.inputBorderColor,
        borderWidth: 1,
        marginTop: 12,
        backgroundColor: PlainStyle.colorSet.inputBackgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6
      },
      iconStyle: {
        width: 16,
        height: 16,
        marginLeft: 9
      },
      inputStyle: DictStyle.textInput,
      placeholder: '',
      placeholderTextColor: PlainStyle.colorSet.inputPlaceholderTextColor,
      focusColor: '#ff0000',
      //value: ''
      inputType: 'default'
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
            keyboardType={this.props.inputType}
            onFocus={this.props.onFocus}
            onLayout={this.props.onLayout}
        />
      </View>
    );
  }
});

module.exports = Input;
