/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image} = React;
let { Device } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let CheckBox = require('./checkBox');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');
let Chat = require('./chat');
let CONSTANT = require('./itemType');
let ChooseList = require('./chooseList');
let ItemType = require('./itemType');

let CreateGroup = React.createClass({

  textChange: function() {

  },

  renderImg: function(data) {
    return (
      <View style={{marginTop:5,backgroundColor: '#F3AD2C', height: 40,width: 40,borderRadius: 20}}>
      </View>
    );
  },

  //******************** 扩展列表
  //渲染组标题
  titleRender: function(data) {
    return (
      <Text
        style={
          {color: '#ffffff'}}>
        {data.orgValue}
      </Text>
    );
  },

  checkBoxChoice: function(item) {
    let memberList = this.state.memberList;
    memberList[item.userId] = item;
    this.setState({memberList:memberList});
  },

  unCheckBoxChoice: function(item) {
    let memberList = this.state.memberList;
    memberList[item.userId] = null;
    this.setState({memberList:memberList});
  },

  //渲染组成员
  itemRender: function(data) {
    return (
      <CheckBox
                item={data}
                key={data.userId}
                choice={this.checkBoxChoice}
                unChoice={this.unCheckBoxChoice}
                style={{width:Device.width,borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: '#132232'}}>
        <View style={{flexDirection:'row'}}>
          {this.renderImg(data)}
          <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.realName}</Text>
        </View>
      </CheckBox>
    );
  },
  //*********************

  createGroup: function(members) {
    console.log(members);
    if(!members || members.length == 0)
      return;
    else if(members.length == 1){
      let userId = members[0];
      //获取用户名
      let userInfo = ContactStore.getUserInfoByUserId()
      this.props.navigator.replacePreviousAndPop(
        {
          comp: Chat,
          param: {title: userInfo.userName, chatType: ItemType.USER, userId: userId}
        }
      );
    }else{
      //setp1: 发送建群的请求   返回groupId
      let groupId = ContactAction.createGroup(members, this.state.groupName, this.state.userInfo.userId);
      //setp2: 跳转到群聊页面
      this.props.navigator.replacePreviousAndPop(
        {
          comp: Chat,
          param: {title: this.state.groupName, chatType: ItemType.GROUP, groupMasterUid: 0}
        }
      );
    }
  },

  renderLabel: function() {
    let memberList = this.state.memberList;
    let count = 0;
    let members = [];
    for(let userId in memberList){
      if(!!memberList[userId]){
        count ++ ;
        members.push(userId);
      }
    }
    return (
      <TouchableOpacity onPress={() => this.createGroup(members)}>
        <Text style={{ marginLeft:-20,color:count==0?'#6B849C':'white'}}>{'创建(' + count + ')'}</Text>
      </TouchableOpacity>
    );
  },

  getInitialState: function() {
    return {
      searchBarWidth:Device.width - 15,
      memberList:{},
      userData: ContactStore.getUsers(),
      groupName:'我新建的群',
      userInfo:ContactStore.getUserInfo() // 用户信息
    };
  },

  setGroupName: function(text) {
    this.setState({groupName: text});
  },

  render: function() {

    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='创建群组'
                  showBar={true}
                  actionButton={this.renderLabel}>
        <View style={{backgroundColor:'#18304D', paddingTop:10}}>
          <TextInput
            placeholder="创建群名称"
            placeholderTextColor="white"
            onChangeText={(text) => this.setGroupName(text)}
            style={{color: '#ffffff',height:50, width: Device.width,backgroundColor:'#15263A', paddingHorizontal:20}}></TextInput>
        </View>

        <ChooseList  memberList={this.state.memberList}/>

        <SearchBar textChange={this.textChange}/>

        <ExtenList itemHeight={56}
                   groundColor={'#15263A'}
                   groupBorderColor={"#132232"}
                   arrowColor={'#ffffff'}
                   groupTitleColor={'#1B385E'}
                   titleBorderColor={'#162E50'}
                   dataSource={this.state.userData}
                   groupDataName={'orgMembers'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />

      </NavBarView>
    );
  }
});

module.exports = CreateGroup;
