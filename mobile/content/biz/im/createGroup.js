/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image} = React;
let { Device, Alert } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let CheckBox = require('./checkBox');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Chat = require('./chat');
let ChooseList = require('./chooseList');
let { SESSION_TYPE } = require('../../constants/dictIm');
let NameCircular = require('./nameCircular');
let Setting = require('../../constants/setting');
let {groupFilter} = require('./searchBarHelper');

let CreateGroup = React.createClass({

  textChange: function(text) {
    this.setState({keyWord:text});
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

  getMemberList: function(item) {
    let r = 0;
    for(let k of Object.keys(item)) {
      if (!!item[k])
        r++;
    }
    return r;
  },

  checkBoxChoice: function(item) {
    let memberList = this.state.memberList;
    memberList[item.userId] = item;
    this.setState({memberList: memberList});

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
          <NameCircular name={data.realName}/>
          <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.realName}</Text>
        </View>
      </CheckBox>
    );
  },
  //*********************

  createGroup: function(members) {

    if(this.state.groupName.length > Setting.groupNameLengt){
      Alert('群名称不能超过20个字符');
      return ;
    }
    if(this.getMemberList(members) > Setting.groupMemberUpperLimit){
      Alert('群组成员人数不能超过' + Setting.groupMemberUpperLimit);
      return;
    }
    if(0 == Object.keys(members).length)
      return;
    else if(Object.keys(members).length == 1){
      let user = members[Object.keys(members)[0]];
      //获取用户名
      this.props.navigator.replacePreviousAndPop(
        {
          comp: Chat,
          param: {title: user.realName, chatType: SESSION_TYPE.USER, userId: user.userId}
        }
      );
    }else{
      dismissKeyboard();
      this.props.exec(() => {
          return ContactAction.createGroup(members, this.state.groupName, this.state.userInfo.userId)
            .then((response)=>{
               return response.gid
            }).then((gid)=>{
              //setp2: 跳转到群聊页面
              this.props.navigator.replacePreviousAndPop(
                {
                  comp: Chat,
                  param: {groupId:gid,title: this.state.groupName, chatType: SESSION_TYPE.GROUP, groupMasterUid: this.state.userInfo.userId}
                }
              );
            }).catch((errorData) => {
            Alert(errorData.toLocaleString());
          });
        }
      );
    }
  },

  renderLabel: function() {
    let memberList = this.state.memberList;
    let count = 0;
    for(let userId in memberList){
      if(!!memberList[userId]){
        count ++ ;
      }
    }
    return (
      <TouchableOpacity onPress={() => count > 0 && this.createGroup(memberList)}>
        <Text style={{ marginLeft:-40,color:(this.getMemberList(memberList) > Setting.groupMemberUpperLimit||this.state.groupName.length > Setting.groupNameLengt || count==0)?'#6B849C':'white'}}>{'创建(' + count + '/' + Setting.groupMemberUpperLimit + ')'}</Text>
      </TouchableOpacity>
    );
  },

  getInitialState: function() {
    return {
      searchBarWidth:Device.width - 15,
      memberList:{},
      userData: ContactStore.getUsers(),
      groupName:'我新建的群',
      userInfo:ContactStore.getUserInfo(), // 用户信息
      keyWord:'',
    };
  },

  setGroupName: function(text) {
    this.setState({groupName: text});
  },

  getDataSource: function() {
    let ret =  groupFilter(this.state.userData,'orgValue','orgMembers','realName',this.state.keyWord);

    return ret;
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

        <ExtenList itemHeight={51}
                   groundColor={'#15263A'}
                   groupBorderColor={"#132232"}
                   arrowColor={'#ffffff'}
                   groupTitleColor={'#1B385E'}
                   titleBorderColor={'#162E50'}
                   dataSource={this.getDataSource()}
                   groupDataName={'orgMembers'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />

      </NavBarView>
    );
  }
});

module.exports = CreateGroup;
