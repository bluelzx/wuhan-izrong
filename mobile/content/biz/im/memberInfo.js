/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Text, TouchableHighlight} = React;
let NavBarView = require('../../framework/system/navBarView');

let MemberInfo = React.createClass({

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='详细资料'
                  showBar={true}>
      </NavBarView>
    );
  }
});

module.exports = MemberInfo;
