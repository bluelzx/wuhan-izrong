/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {TouchableOpacity, View} = React;
let Icon = require('react-native-vector-icons/Ionicons');
let CheckBox = React.createClass({
  getInitialState: function() {
    return {
      agree: !!this.props.init
    };
  },

  changeAgree: function(){
    var key = this.props.item;
    var agree = this.state.agree;
    this.setState({agree: !agree});
    if(this.props.choice&&this.props.unChoice){
      !agree?this.props.choice(key):this.props.unChoice(key);
    }

  },

  isRead: function(){
    if (this.state.agree) {
      return (
        <Icon name="person-stalker" size={25} color='#ffffff' />
      );
    } else {
      return (require('../../image/utils/radioUncheck.png'))
    }
  },

  render: function() {
    let {style} = this.props;
    return (
      <TouchableOpacity style={style} onPress={this.changeAgree}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Icon name={this.state.agree?'ios-checkmark':'ios-circle-outline'} size={24} color='#44ABFD' />

          {/*
          *<Image style={{width:12,height:12}} source={this.isRead()}/>
           */}

          <View style={{padding:5}}></View>
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
});

module.exports = CheckBox;
