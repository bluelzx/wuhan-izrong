/**
 * Created by baoyinghai on 16/4/5.
 */
let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image, Switch} = React;
var Icon  = require('react-native-vector-icons/Ionicons');
let { Device,Alert, Button } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let GroupMembers = require('./groupMembers');
let ModifyGroupName = require('./modifyGroupName');
let AddMember = require('./addMember');
let DeleteMember = require('./deleteMember');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');
let DictIcon = require('../../constants/dictIcon');
let AppStore = require('../../framework/store/appStore');
let MembersBar = require('./membersBar');
let { IM_GROUP } = require('../../constants/dictEvent');
let DictStyle = require('../../constants/dictStyle');

let EditGroup = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, IM_GROUP);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, IM_GROUP);
  },
  _onChange: function () {
      this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    let groupInfo = null;
    try {
      groupInfo = ContactStore.getGroupDetailById(this.props.param.groupId);
      //Alert(groupInfo.groupMasterUid)
      groupInfo.masterName = ContactStore.getUserInfoByUserId(groupInfo.groupMasterUid).realName;
    } catch (err) {
      this.props.navigator.popToTop();
      return {}
    };
    if (!groupInfo) {
      this.props.navigator.popToTop();
      return {}
    }
    return {
      falseSwitchIsOn:groupInfo.mute,
      groupInfo:groupInfo
    };
  },

  getInitialState: function(){
    return this.getStateFromStores();
  },

  renderMember: function() {

      let initData = {
        navigator: this.props.navigator,
        members: this.state.groupInfo.members,
        showDelete: false,
        imgSource: DictIcon.imSpread,
        groupMasterUid:this.state.groupInfo.groupMasterUid,
        addMember: ()=>this.props.navigator.push({comp: AddMember, param:{groupId:this.props.param.groupId,existMembers:this.state.groupInfo.memberNum}}),
      };

      return (
        <MembersBar {...initData}/>
      );

  },

  setMute: function(value){
    this.setState({falseSwitchIsOn: value});
    this.props.exec(()=>{
      return ContactAction.muteGroup(this.props.param.groupId, value);
    });
  },

  deleteGroup:function(){
    this.props.exec(
      ()=>{
        return  ContactAction.deleteGroup(this.props.param.groupId).then(
          (groupId)=>{
            this.props.navigator.popToTop();
            return groupId;
          }
        ).then((groupId)=>{
          ContactAction.storeLeaveGroup(groupId);
        }).catch((errData)=>{
          Alert(errData.toLocaleString());
        });
      }
    );
  },

  render: function() {
    //if(!this.props.groupInfo){
    //  //return <View></View>;
    //}
    return (
      <NavBarView navigator={this.props.navigator} title='群设置'>
        <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'column'}}>
            {this.renderMember()}
            <TouchableOpacity onPress={() => this.props.navigator.push({comp:GroupMembers,param:{groupId:this.props.param.groupId}})}
              style={{backgroundColor: DictStyle.groupManage.memberListBackgroundColor, paddingHorizontal:10}}>
              <View
                style={{paddingVertical:10,borderTopColor:DictStyle.groupManage.buttonArrowColor,borderTopWidth:0.5,flexDirection:'row', justifyContent:'space-between', marginTop:5,alignItems:'center'}}>
                <Text style={{color:DictStyle.groupManage.memberNameColor}}>{'全部群成员(' + this.state.groupInfo.memberNum + ')'}</Text>
                <Icon name="ios-arrow-right" size={20} color={DictStyle.groupManage.buttonArrowColor}/>
              </View>
            </TouchableOpacity>

            <View
              style={{height:50,marginTop: 10,backgroundColor: DictStyle.groupManage.memberListBackgroundColor}}>
              <View
                style={{height:50,flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center'}}>
                <Text style={{color:DictStyle.groupManage.memberNameColor}}>群名称</Text>
                <View style={{flexDirection:'row', alignItems:'center', flex:1,justifyContent:'flex-end'}}>
                  <Text style={{textAlign:'right', color:'#6B849C', flex:25, marginRight:5, flexWrap:'wrap'}}>{ this.state.groupInfo.groupName }</Text>
                </View>
              </View>
            </View>

            <View
              style={{height:50,backgroundColor: DictStyle.groupManage.memberListBackgroundColor,flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center',}}>
              <Text style={{color:DictStyle.groupManage.memberNameColor}}>群主</Text>
              <Text style={{color:'#6B849C',marginRight:5}}>{this.state.groupInfo.masterName}</Text>
            </View>

            <View
              style={{height:50,backgroundColor: DictStyle.groupManage.memberListBackgroundColor,flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center',}}>
              <Text style={{color:DictStyle.groupManage.memberNameColor}}>屏蔽群消息提醒</Text>
              <Switch
                onValueChange={(value) => this.setMute(value)}
                style={{height:30}}
                value={this.state.falseSwitchIsOn}/>
            </View>

          </View>
          <View >
            <Button onPress={this.deleteGroup} containerStyle={{padding:10, height:45,borderRadius:0, overflow:'hidden', backgroundColor: '#E8004D'}}
                    style={{fontSize: 18, color: '#ffffff'}}
            >
              删除并退出该群
            </Button>

          </View>
        </View>
      </NavBarView>
      );
  }
});

module.exports = EditGroup;
