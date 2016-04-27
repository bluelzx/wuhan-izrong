/**
 * Created by baoyinghai on 16/4/13.
 */

let React = require('react-native');
const {Text, View} = React;
let CircularButton = require('./circularButton');

let NameCircular = require('./nameCircular').NameCircular;

let MembersBar = React.createClass({

  renderCircularButton: function () {
    let btns = new Array();
    btns.push(<CircularButton key="cir1" onPress={this.props.addMember}>
      <Text style={{fontSize:20, color:'#F3AD2C',fontWeight:'bold'}}>+</Text>
    </CircularButton>);
    if(this.props.showDelete){
      btns.push(<CircularButton key="cir2" onPress={this.props.deleteMember}>
        <Text style={{fontSize:20, color:'#F3AD2C',fontWeight:'bold'}}>-</Text>
      </CircularButton>);
    }
    return btns;
  },

  render: function() {
    let {members, imgSource} = this.props;
    let m = [];
    for(let i = 0 ; !!members && i < members.length; i++){
      m.push(
        <View key={members[i].userId} style={{alignItems:'center',padding:5}}>
          <View style={{marginTop:5,height: 40,width: 40}}>
            <NameCircular name={members[i].realName}/>
          </View>
          <Text numberOfLines={1} style={{color:'#ffffff',marginTop:4, width:40}}>{members[i].realName}</Text>
        </View>
      );
    }
    return (
      <View style={{flexDirection:'row', flexWrap:'wrap', backgroundColor:'#15263A'}}>
        {m}
        {this.renderCircularButton()}
      </View>
    );
  }
});

module.exports = MembersBar;
