/**
 * Created by baoyinghai on 16/4/6.
 */

let React = require('react-native');
const {Text, TouchableHighlight, TouchableOpacity} = React;
let NavBarView = require('../../framework/system/navBarView');
let EditGroup = require('./editGroup');

let Chat = React.createClass({

  renderEdit: function(){
    return (
    <TouchableOpacity onPress={()=>{
      this.props.navigator.push({
            comp: EditGroup
      });
      }}>
      <Text style={{color:'#ffffff'}}>编辑群</Text>
    </TouchableOpacity>

    );
  },

  render: function() {
    let {title} = this.props.param;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title={title}
                  showBar={true}
                  actionButton={this.renderEdit}>
      </NavBarView>
    );
  }
});
module.exports = Chat;
