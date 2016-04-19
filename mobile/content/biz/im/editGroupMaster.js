/**
 * Created by baoyinghai on 16/4/5.
 */
let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image, Switch} = React;
var Icon  = require('react-native-vector-icons/Ionicons');
let { Device, Button } = require('mx-artifacts');
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

let EditGroup = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    let groupInfo = ContactStore.getGroupDetailById(this.props.param.groupId);
    return {
      falseSwitchIsOn:groupInfo.mute,
      groupInfo:groupInfo
    };
  },

  getInitialState: function(){
    return this.getStateFromStores();
  },


  renderCircularButton: function () {

    let btns = new Array();
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
      members: this.state.groupInfo.members,
      showDelete: true,
      imgSource: DictIcon.imSpread,
      addMember: ()=>this.props.navigator.push({comp: AddMember, param:{groupId:this.props.param.groupId}}),
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
        (response)=>{
          this.props.navigator.popToTop();
        }
      );
    });

  },

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='群设置'
                  showBar={true}
      >
        <View style={{flexDirection:'column'}}>
          <View style={{flexDirection:'column'}}>
            {this.renderMember()}
            <TouchableOpacity onPress={() => this.props.navigator.push({comp:GroupMembers,param:{groupId:this.props.param.groupId}})}
              style={{backgroundColor: '#15263A', paddingVertical:10,borderTopColor:'#132132',borderTopWidth:0.5}}>
              <View
                style={{flexDirection:'row', justifyContent:'space-between', marginTop:5,alignItems:'center',paddingHorizontal:10}}>
                <Text style={{color:'#ffffff'}}>{'全部群成员(' + this.state.groupInfo.memberNum + ')'}</Text>
                <Icon name="ios-arrow-right" size={20} color='#ffffff'/>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.props.navigator.push({comp:ModifyGroupName,param:{groupId:this.props.param.groupId,groupName:this.state.groupInfo.groupName}})}
              style={{borderTopColor:'#132132',borderTopWidth:0.5,height:50,marginTop: 10,backgroundColor: '#15263A'}}>
              <View
                style={{height:50,flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center'}}>
                <Text style={{color:'#ffffff'}}>群名称</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={{color:'#6B849C',marginRight:5}}>{this.state.groupInfo.groupName}</Text>
                  <Icon name="ios-arrow-right" size={20} color='#ffffff'/>
                </View>
              </View>
            </TouchableOpacity>

            <View
              style={{borderTopColor:'#132132',borderTopWidth:0.5,height:50,backgroundColor: '#15263A',flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center',}}>
              <Text style={{color:'#ffffff'}}>群主</Text>
              <Text style={{color:'#6B849C',marginRight:5}}>吴缪缪</Text>
            </View>

            <View
              style={{borderTopColor:'#132132',borderTopWidth:0.5,height:50,backgroundColor: '#15263A',flexDirection:'row', justifyContent:'space-between',paddingHorizontal:10, alignItems:'center',}}>
              <Text style={{color:'#ffffff'}}>屏蔽群消息提醒</Text>
              <Switch
                onValueChange={(value) => this.setMute(value)}
                style={{height:30}}
                value={this.state.falseSwitchIsOn}/>
            </View>

          </View>
          <View >
            <Button onPress={this.dismissGroup}  containerStyle={{padding:10, height:45,borderRadius:0, overflow:'hidden', backgroundColor: '#E8004D'}}
                    style={{fontSize: 18, color: '#ffffff'}}
            >
              解散该群
            </Button>

          </View>
        </View>
      </NavBarView>
      );
  }
});

module.exports = EditGroup;
