/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Text, TouchableHighlight} = React;
let NavBarView = require('../../framework/system/navBarView');

let MemberInfo = React.createClass({

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='详细资料'>
      </NavBarView>
    );
  }
});

module.exports = MemberInfo;
