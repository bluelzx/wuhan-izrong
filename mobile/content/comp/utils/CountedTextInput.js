var React = require('react-native');
var {
    View,
    Text,
    TextInput,
    } = React;


var CountedTextInput = React.createClass({

    propTypes: {
        placeholder: React.PropTypes.string,
        maxLength: React.PropTypes.number,
        value: React.PropTypes.string,
        callback: React.PropTypes.func.isRequired,
        stateCallback: React.PropTypes.func.isRequired,
        editable: React.PropTypes.bool,
    },

    getDefaultProps: function () {
        return {
            placeholder: '请输入...',
            maxLength: 200,
            value: '',
            editable: true
        };
    },

    _getInitTips: function () {
        return '还可以输入 ' + (this.props.maxLength - this.props.value.length) + ' 字';
    },

    getInitialState: function () {
        return {
            //placeholder: '请输入...',
            //maxLength: 200,
            tips: '',
            bOut: false,
        };
    },

    componentDidMount: function () {
        this._limitLength(this.props.value);
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.value != this.props.value) {
            this._limitLength(nextProps.value);
        }
    },

    _limitLength: function (_text) {
        let textLength = _text.length;
        if (textLength > this.props.maxLength) {
            this.setState({
                tips: '已超出 ' + (textLength - this.props.maxLength) + ' 字',
                bOut: true,
            });
            this.props.stateCallback(true);
        } else {
            this.setState({
                tips: '还可以输入 ' + (this.props.maxLength - textLength) + ' 字',
                bOut: false,
            });
            this.props.stateCallback(false);
        }
        this.props.callback(_text);
    },

    _renderTips: function () {
        return (
            <Text
                style={{
            color: this.state.bOut?'red':'grey',
            fontSize: 13,
            paddingRight: 10,
            marginVertical: 5,
            //borderWidth: 2,
            textAlign: 'right',
          }}
            >{this.state.tips}</Text>
        );
    },

    render: function () {
        return (
            <View>
                <TextInput
                    style={{
              borderColor: '#D3D3D3',
              backgroundColor: 'white',
              alignSelf: 'stretch',
              flex: 1,
              //margin: 1,
              fontSize: 15,
              paddingLeft: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              height: 80
          }}
                    autoCorrect={false}
                    autoFocus={true}
                    placeholder={this.props.placeholder}
                    placeholderTextColor="grey"
                    multiline={true}
                    maxLength={200}
                    editable={this.props.editable?true:false}
                    value={this.props.value}
                    onChangeText={this._limitLength}
                />
                {this.props.editable ? this._renderTips() : null}
            </View>
        );
    },
});

module.exports = CountedTextInput;
