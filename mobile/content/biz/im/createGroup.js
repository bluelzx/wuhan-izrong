/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image, InteractionManager} = React;
let { Device, Alert } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation');
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
let DEFAULT_GROUP_NAME = '创建的群+';
let DictStyle = require('../../constants/dictStyle');

let CreateGroup = React.createClass({

  textChange: function (text) {
    if (text == '') {
      this.setState({keyWord: text, isOpen: false});
    } else {
      this.setState({keyWord: text, isOpen: true});
    }
  },

  textOnBlur: function () {
    if (this.state.keyWord === '')
      this.setState({isOpen: false});
  },

  //******************** 扩展列表
  //渲染组标题
  titleRender: function (data) {
    return (
      <Text
        numberOfLines={1}
        style={
          {flex:1,fontSize:15,color: DictStyle.colorSet.imTitleTextColor}}>
        {data.orgValue}
      </Text>
    );
  },

  getMemberList: function (item) {
    let r = 0;
    Object.keys(item).forEach((k)=> {
      if (!!item[k])
        r++;
    })
    return r;
  },

  checkBoxChoice: function (item) {
    let memberList = this.state.memberList;
    memberList[item.userId] = item;
    this.setState({memberList: memberList});

  },

  unCheckBoxChoice: function (item) {
    let memberList = this.state.memberList;
    memberList[item.userId] = null;
    this.setState({memberList: memberList});
  },

  //渲染组成员
  itemRender: function (data) {
    return (
      <CheckBox
        init={this.state.memberList[data.userId]}
        item={data}
        key={data.userId}
        choice={this.checkBoxChoice}
        unChoice={this.unCheckBoxChoice}
        style={{backgroundColor:DictStyle.colorSet.extenListGroundCol,width:Device.width,borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: DictStyle.colorSet.demarcationColor}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <HeaderPic photoFileUrl={data.photoFileUrl} certified={data.certified} name={data.realName}/>
          <Text numberOfLines={1}
                style={{flex:1,fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName}</Text>
        </View>
      </CheckBox>
    );
  },
  //*********************

  createGroup: function (members) {

    var reg =new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5]+$");
    if (!Validation.isEnableEmoji(this.state.groupName)) {
      Alert('输入的群名称不合法，请重新输入');
      return;
    }
    if (this.state.groupName.length > Setting.groupNameLengt) {
      Alert('群名称不能超过20个字符');
      return;
    }
    if (this.state.groupName.trim() == '') {
      this.state.groupName = this.state.userInfo.realName + DEFAULT_GROUP_NAME + this.getMemberList(members);
    }
    if (this.getMemberList(members) > Setting.groupMemberUpperLimit) {
      Alert('群组成员人数不能超过' + Setting.groupMemberUpperLimit);
      return;
    }
    let tmp = false;
    for (let i in members) {
      if (members[i]) {
        tmp = true;
        break;
      }
    }
    if (!tmp) {
      Alert('您没有选择成员!');
      return;
    }else {
      dismissKeyboard();
      this.props.exec(() => {
          return ContactAction.createGroup(members, this.state.groupName, this.state.userInfo.userId)
            .then((response)=> {
              return response.gid
            }).then((gid)=> {
              //step2: 跳转到群聊页面
              this.props.navigator.replacePreviousAndPop(
                {
                  comp: Chat,
                  param: {
                    groupId: gid,
                    title: this.state.groupName,
                    chatType: SESSION_TYPE.GROUP,
                    groupMasterUid: this.state.userInfo.userId
                  }
                }
              );
            }).catch((errorData) => {
              throw errorData;
            });
        }
      );
    }
  },

  renderLabel: function () {
    let memberList = this.state.memberList;
    let count = 0;
    for (let userId in memberList) {
      if (!!memberList[userId]) {
        count++;
      }
    }
    return (
      <TouchableOpacity onPress={() => this.createGroup(memberList)}>
        <Text
          style={{ marginLeft:Platform.OS==='ios'?-40:0,color:'white'}}>{'创建(' + count + '/' + Setting.groupMemberUpperLimit + ')'}</Text>
      </TouchableOpacity>
    );
  },


  componentDidMount:function() {

    var handle= new Promise((resolve, reject) => {
      resolve({
        userData: ContactStore.getUsers(),
        userInfo: ContactStore.getUserInfo(), // 用户信息
      });
    }).catch((err)=> {
      reject(err);
    }).then((resp)=> {
      self.setState(resp);
    }).catch((err)=> {
      throw err;
    });
    let self = this;
    if(Platform.OS !== 'ios') {
      this.props.exec(()=> {
        return handle
      });
    }else{
      InteractionManager.runAfterInteractions(() => {
        this.props.exec(()=> {
          return handle
        });
      });
    }

  },

  getInitialState: function () {

      return {
        searchBarWidth: Device.width - 15,
        memberList: {},
        userData: null,
        groupName: '',
        userInfo: null, // 用户信息
        keyWord: '',
        isOpen: false
      };

  },

  setGroupName: function (text) {
    this.setState({groupName: text});
  },

  getDataSource: function () {
    if(!this.state.userInfo)
    return [];
    let ret = groupFilter(this.state.userData, 'orgValue', 'orgMembers', 'realName', this.state.keyWord, this.state.userInfo.userId);

    return ret;
  },
  render: function () {

    return (
      <NavBarView navigator={this.props.navigator} title='创建群组' actionButton={this.renderLabel}>
        <View style={{backgroundColor:DictStyle.colorSet.content, paddingTop:10}}>
          <TextInput
            placeholder={(this.state.userInfo&&this.state.userInfo.realName || '我') + "创建的群"}
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => this.setGroupName(text)}
            style={{color: '#44B5E6',height:50, width: Device.width,backgroundColor:DictStyle.colorSet.textEditBackground, paddingHorizontal:20}}></TextInput>
        </View>

        <ChooseList memberList={this.state.memberList}/>


        {(()=> {

          let dataSource = this.getDataSource();
          if (dataSource && dataSource.length > 0) {
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
                         groupTitleRender={this.titleRender}
              />

            );
          } else {
            return (
              <View style={{backgroundColor:'transparent', alignItems:'center', marginTop:40}}>
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
