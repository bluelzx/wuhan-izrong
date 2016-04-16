'use strict';

let React = require('react-native');
let {
    StyleSheet,
    TextInput,
    View,
    Image,
    Dimensions
    } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let Input = React.createClass({
    getDefaultProps(){

    },
    textOnchange: function (text, type) {
        this.props.onChanged(type, text)
    },
    render(){
        let {height, width} = Dimensions.get('window');
        if (this.props.type == 'default') {
            return (
                <View style={[styles.view]}>
                    <TextInput style={[styles.input,{width:screenWidth - 10/375*screenWidth}]} underlineColorAndroid="transparent"
                               maxLength={this.props.max} defaultValue={this.props.defaultValue}
                               placeholder={this.props.prompt} secureTextEntry={this.props.isPwd} autoCorrect={false}
                               autoCapitalize="none" placeholderTextColor="#7f7f7f" clearButtonMode="while-editing"
                               keyboardType={'default'}/>
                </View>
            )
        }
    }
})
let styles = StyleSheet.create({
    view: {
        height: 47,
        borderColor: '#cccccc',
        backgroundColor: '#1e3754',
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        fontSize: 18, color: '#7f7f7f', marginLeft: 9,
    },
    radius: {
        borderRadius: 6
    },
})
module.exports = Input;
