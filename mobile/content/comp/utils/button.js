let React, {
  TouchableHighlight,
  Text,
  } = require('react-native');

let Button = React.createClass({
  PropTypes: {
    checked: React.PropTypes.bool,
    func: React.PropTypes.func,
    content: React.PropTypes.string
  },
  render(){
    return (
      <TouchableHighlight
        style={{
          borderRadius: 6,
          backgroundColor: this.props.checked ? '#9ad6d1' : '#44bcbc',
          paddingHorizontal: 12,
          height: 47,
          alignItems: 'center',
          justifyContent: 'center',
          underlayColor: this.props.checked ? '#3fada4' : '#9ad6d1'
        }}
        activeOpacity={1}
        onPress={this.props.func}
       >
        <Text style={{ color: 'white', fontSize: 18 }}>{this.props.content}</Text>
      </TouchableHighlight>
    );
  }
});

module.exports = Button;
