/**
 * Created by baoyinghai on 16/4/5.
 */
let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image, Switch, ScrollView} = React;
var Icon  = require('react-native-vector-icons/Ionicons');
let { Device,Alert, Button } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let GroupMembers = require('./groupMembers');
let ModifyGroupName = require('./modifyGroupName');
let AddMember = require('./addMember');
let DeleteMember = require('./deleteMember');
let CircularButton = require('./circularButton');
let ContactStore = require('../../framework/store/contactStore');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let DictIcon = require('../../constants/dictIcon');
let MembersBar = require('./membersBar');
let ContactAction = require('../../framework/action/contactAction');
let AppStore = require('../../framework/store/appStore');
let { IM_GROUP } = require('../../constants/dictEvent');
let DictStyle = require('../../constants/dictStyle');

let EditGroupMaster = React.createClass({

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
      let masterInfo = null;
      let userInfo = ContactStore.getUserInfo();
      if (groupInfo.groupMasterUid == userInfo.userId)
        masterInfo = userInfo;
      else
        masterInfo = ContactStore.getUserInfoByUserId(groupInfo.groupMasterUid);
      groupInfo.masterName = masterInfo.realName;
      groupInfo.orgValue = ContactStore.getOrgValueByOrgId(masterInfo.orgId);

    } catch (err) {
      return {}
    };
    if (!groupInfo) {
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


  renderCircularButton: function () {

    let btns = [];
    btns.push(<CircularButton key="cir1" onPress={()=>this.props.navigator.push({comp:AddMember})}>
      <Text style={{fontSize:20, color:'#F3AD2C',fontWeight:'bold'}}>+</Text>
    </CircularButton>);
    btns.push(<CircularButton key="cir2" onPress={()=>this.props.navigator.push({comp:DeleteMember})}>
      <Text style={{fontSize:20, color:'#F3AD2C',fontWeight:'bold'}}>-</Text>
    </CircularButton>);
    return btns;
  },

  renderMember: function() {
    let initData = {
      navigator: this.props.navigator,
      members: this.state.groupInfo.members,
      showDelete: true,
      imgSource: DictIcon.imSpread,
      groupMasterUid:this.state.groupInfo.groupMasterUid,
      addMember: ()=>this.props.navigator.push({comp: AddMember, param:{groupId:this.props.param.groupId,existMembers:this.state.groupInfo.memberNum}}),
      deleteMember: ()=>this.props.navigator.push({comp: DeleteMember, param:{groupId:this.props.param.groupId}})
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

  dismissGroup: function(){
    dismissKeyboard();
    this.props.exec(()=>{
      return  ContactAction.dismissGroup(this.props.param.groupId).then(
        (groupId)=>{
          this.props.navigator.popToTop();
          return groupId
        }
      ).then((groupId)=>{
        ContactAction.storeDeleteGroup(groupId);
      }).catch((errData)=>{
        Alert(errData.toLocaleString());
      });;
    });

  },

  renderBody: function () {
    return (
      <ScrollView style={{flexDirection:'column'}}>
        <View style={{flexDirection:'column'}}>
          {this.renderMember()}
          <TouchableOpacity
            onPress={() => this.props.navigator.push({comp:GroupMembers,param:{groupId:this.props.param.groupId}})}
            style={{backgroundColor: DictStyle.groupManage.memberListBackgroundColor, paddingHorizontal:10}}>
            <View
              style={{
                borderTopColor:DictStyle.colorSet.demarcationColor,
                paddingVertical:10,
                borderTopWidth:0.5,flexDirection:'row',
                justifyContent:'space-between',
                marginTop:5,alignItems:'center'}}>
              <Text
                style={{color:DictStyle.groupManage.memberNameColor}}>{'全部群成员(' + this.state.groupInfo.memberNum + ')'}</Text>
              <Icon name="ios-arrow-right" size={20} color={DictStyle.groupManage.buttonArrowColor}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigator.push({comp:ModifyGroupName,param:{groupId:this.props.param.groupId,groupName:this.state.groupInfo.groupName}})}
            style={{height:50,marginTop: 10,backgroundColor: DictStyle.groupManage.memberListBackgroundColor}}>
            <View
              style={{height:50,flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center'}}>
              <Text style={{color:DictStyle.groupManage.memberNameColor}}>群名称</Text>
              <View style={{flexDirection:'row', alignItems:'center', flex:1,justifyContent:'flex-end'}}>
                <Text
                  style={{textAlign:'right', color:'#6B849C', flex:25, marginRight:5, flexWrap:'wrap'}}>{ this.state.groupInfo.groupName }</Text>
                <Icon style={{flex:1}} name="ios-arrow-right" size={20} color={DictStyle.groupManage.buttonArrowColor}/>
              </View>
            </View>
          </TouchableOpacity>

          <View
            style={{height:50,backgroundColor: DictStyle.groupManage.memberListBackgroundColor,flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center',}}>
            <Text style={{color:DictStyle.groupManage.memberNameColor}}>群主</Text>
            <View style={{flex:1,marginRight:5}}>
            <Text
              numberOfLines={2}
              style={{flex:1,color:'#6B849C', textAlign:'right'}}>{this.state.groupInfo.masterName + '-' + this.state.groupInfo.orgValue}</Text>
              </View>
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
          <Button onPress={this.dismissGroup}
                  containerStyle={{padding:10, height:45,borderRadius:0, overflow:'hidden', backgroundColor: '#E8004D'}}
                  style={{fontSize: 18, color: '#ffffff'}}
          >
            解散该群
          </Button>

        </View>
      </ScrollView>
    );
  },

  render: function() {


    return (
      <NavBarView navigator={this.props.navigator} title='群设置'>
        {(()=>{
          if(this.state.groupInfo==undefined){

            return <Text style={{flex:1, textAlign:'center', color:DictStyle.searchFriend.nullUnitColor}}>{'数据异常,请联系管理员,groupId:' + this.props.param.groupId}</Text>
          }else{
            return this.renderBody();
          }
        })()}
      </NavBarView>
      );
  }
});

module.exports = EditGroupMaster;
