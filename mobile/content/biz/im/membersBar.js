/**
 * Created by baoyinghai on 16/4/13.
 */

let React = require('react-native');
const {Text, View, TouchableOpacity} = React;
let CircularButton = require('./circularButton');
let ImUserInfo = require('./imUserInfo');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');
let ContactStore = require('../../framework/store/contactStore');
let {Device} = require('mx-artifacts');

//let NameCircular = require('./nameCircular').NameCircular;

let MembersBar = React.createClass({

  renderCircularButton: function () {
    let btns = [];
    btns.push(<CircularButton key="cir1" onPress={this.props.addMember}>
      <Text style={{fontSize:25, color:'#F3AD2C',fontWeight:'bold'}}>+</Text>
    </CircularButton>);
    if (this.props.showDelete) {
      btns.push(<CircularButton key="cir2" onPress={this.props.deleteMember}>
        <Text style={{fontSize:25, color:'#F3AD2C',fontWeight:'bold'}}>-</Text>
      </CircularButton>);
    }
    return btns;
  },

  renderMember: function (member) {
    return (
      <TouchableOpacity onPress={()=>this.props.navigator.push({
        comp:ImUserInfo,
        param:Object.assign(member,{isStranger:ContactStore.isStranger(member.userId)})
        })} key={member.userId} style={{alignItems:'center',padding:5,alignSelf:'flex-start'}}>
        <View style={{marginTop:5,height: 51,width: 51}}>
          <HeaderPic photoFileUrl={member.photoFileUrl} certified={member.certified} name={member.realName}/>
        </View>
        <Text numberOfLines={1}
              style={{color:DictStyle.groupManage.memberNameColor,marginTop:4, width:40}}>{member.realName}</Text>
      </TouchableOpacity>
    );
  },

  render: function () {
    let {members, imgSource, groupMasterUid} = this.props;
    //let currUser = ContactStore.getUserInfo();
    let Master = null;
    let m = [];
    for (let i = 0; !!members && i < members.length; i++) {
      let member = members[i];
      if (member.userId == groupMasterUid) {
        //if (currUser.userId != groupMasterUid) {
        Master = this.renderMember(member);
          m.unshift(Master);
        //}
      }else {
        m.push(
          this.renderMember(member)
        );

      }
    }

    m = m.concat(this.renderCircularButton());
    let index = Device.width / 61;

    if(m.length/index > 2){
      let start = m.length - index*2;
      m = m.slice(start + 3,m.length);
      m.unshift(Master);
    }
    return (
      <View
        style={{backgroundColor:DictStyle.groupManage.memberListBackgroundColor, flex:1,justifyContent:'center',alignSelf:'stretch',alignItems:'center'}}>
        <View
          style={{width:parseInt(index) * 61,flexDirection:'row', flexWrap:'wrap'}}>
          {m}
        </View>
      </View>
    );
  }
});

module.exports = MembersBar;
