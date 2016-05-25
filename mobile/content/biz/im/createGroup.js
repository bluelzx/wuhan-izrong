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
//let NameCircular = require('./nameCircular').NameCircular;
let HeaderPic = require('./headerPic');
let Setting = require('../../constants/setting');
let {groupFilter} = require('./searchBarHelper');
let DEFAULT_GROUP_NAME='创建的群+';
let DictStyle = require('../../constants/dictStyle');

let CreateGroup = React.createClass({

  textChange: function(text) {
    this.setState({keyWord:text});
  },

  //******************** 扩展列表
  //渲染组标题
  titleRender: function(data) {
    return (
      <Text
        numberOfLines={1}
        style={
          {flex:1,fontSize:15,color: DictStyle.colorSet.imTitleTextColor}}>
        {data.orgValue}
      </Text>
    );
  },

  getMemberList: function(item) {
    let r = 0;
    Object.keys(item).forEach((k)=>{
      if (!!item[k])
        r++;
    })
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
          init={this.state.memberList[data.userId]}
          item={data}
          key={data.userId}
          choice={this.checkBoxChoice}
          unChoice={this.unCheckBoxChoice}
          style={{width:Device.width,borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
            <Text style={{fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName}</Text>
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
    if(this.state.groupName.trim() == ''){
      this.state.groupName = this.state.userInfo.realName + DEFAULT_GROUP_NAME + this.getMemberList(members);
    }
    if(this.getMemberList(members) > Setting.groupMemberUpperLimit){
      Alert('群组成员人数不能超过' + Setting.groupMemberUpperLimit);
      return;
    }
    if(0 == Object.keys(members).length)
      return;
    else{
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
        <Text style={{ marginLeft:Platform.OS==='ios'?-40:0,color:(this.getMemberList(memberList) > Setting.groupMemberUpperLimit||this.state.groupName.length > Setting.groupNameLengt || count==0)?'#9FB3F3':'white'}}>{'创建(' + count + '/' + Setting.groupMemberUpperLimit + ')'}</Text>
      </TouchableOpacity>
    );
  },

  getInitialState: function() {
    return {
      searchBarWidth:Device.width - 15,
      memberList:{},
      userData: ContactStore.getUsers(),
      groupName:'',
      userInfo:ContactStore.getUserInfo(), // 用户信息
      keyWord:'',
    };
  },

  setGroupName: function(text) {
    this.setState({groupName: text});
  },

  getDataSource: function() {
    let ret =  groupFilter(this.state.userData,'orgValue','orgMembers','realName',this.state.keyWord, this.state.userInfo.userId);

    return ret;
  },
  render: function() {

    return (
      <NavBarView navigator={this.props.navigator} title='创建群组' actionButton={this.renderLabel}>
        <View style={{backgroundColor:DictStyle.colorSet.content, paddingTop:10}}>
          <TextInput
            placeholder="创建群名称"
            placeholderTextColor="#44B5E6"
            onChangeText={(text) => this.setGroupName(text)}
            style={{color: '#44B5E6',height:50, width: Device.width,backgroundColor:DictStyle.colorSet.textEditBackground, paddingHorizontal:20}}></TextInput>
        </View>

        <ChooseList  memberList={this.state.memberList}/>

        <SearchBar textChange={this.textChange}/>

        {(()=>{

          let dataSource = this.getDataSource();
          if(dataSource && dataSource.length > 0) {
            return (
              <ExtenList itemHeight={57}
                         groundColor={DictStyle.colorSet.extenListGroupTitleColor}
                         groupBorderColor={DictStyle.colorSet.demarcationColor}
                         arrowColor={DictStyle.colorSet.extenListArrowColor}
                         groupTitleColor={DictStyle.colorSet.extenListGroupTitleColor}
                         titleBorderColor={DictStyle.colorSet.demarcationColor}
                         dataSource={dataSource}
                         groupDataName={'orgMembers'}
                         groupItemRender={this.itemRender}
                         groupTitleRender={this.titleRender}/>

            );
          }else{
            return (
              <View style={{backgroundColor:'transparent', alignItems:'center', marginTop:20}}>
                <Text style={{color:DictStyle.searchFriend.nullUnitColor}}>{'无符合条件的用户'}</Text>
              </View>
            );
          }
        })()}

      </NavBarView>
    );
  }
});

module.exports = CreateGroup;
