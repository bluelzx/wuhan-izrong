/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {TouchableHighlight, Image, View} = React;
let CheckBox = React.createClass({
  getInitialState: function() {
    return {
      agree: false
    };
  },

  changeAgree: function(){
    var agree = this.state.agree;
    this.setState({agree: !agree})
  },

  isRead: function(){
    if (this.state.agree) {
      return (require('../../image/utils/radioChecked.png'))
    } else {
      return (require('../../image/utils/radioUncheck.png'))
    }
  },

  render: function() {
    let {style} = this.props;
    return (
      <TouchableHighlight style={style} onPress={this.changeAgree}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Image style={{width:12,height:12}} source={this.isRead()}/>
          <View style={{padding:5}}></View>
          {this.props.children}
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = CheckBox;
