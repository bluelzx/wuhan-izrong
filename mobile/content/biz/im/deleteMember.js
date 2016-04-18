/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {View, TouchableOpacity, Text} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList, Device } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let CheckBox = require('./checkBox');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');
let DictIcon = require('../../constants/dictIcon');
let HeadPic = require('./headerPic');

let DeleteMember = React.createClass({

  getInitialState:function() {
    let groupId = this.props.param.groupId;
    return {
      data:ContactStore.getUsersByGroupId(groupId),
      memberList:{}
    }
  },

  delUser: function( groupId, members) {
    //step1: 删除成员
    ContactAction.deleteGroupMembers(this.props.param.groupId, members);
    //step2: 回退
    this.props.navigator.pop();
  },

  textChange: function() {

  },

  renderState: function () {
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
      <TouchableOpacity onPress={() => this.delUser(this.props.param.groupId, members)}>
        <Text style={{ marginLeft:-20,color:count==0?'#6B849C':'white'}}>{'删除(' + count + ')'}</Text>
      </TouchableOpacity>
    );
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
      <CheckBox key={data.userId}
                item={data}
                choice={this.checkBoxChoice}
                unChoice={this.unCheckBoxChoice}
                style={{width:Device.width,borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: '#132232'}}>
        <View style={{flexDirection:'row'}}>
          <HeadPic showBadge={false} style={{height: 40,width: 40, marginTop:5}} source={DictIcon.imSpread} />
          <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.realName}</Text>
        </View>
      </CheckBox>

    );
  },


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='删除群成员'
                  showBar={true}
                  actionButton={this.renderState}>
        <SearchBar textChange={this.textChange}/>
        <ExtenList itemHeight={56}
                   groundColor={'#15263A'}
                   groupBorderColor={"#132232"}
                   arrowColor={'#ffffff'}
                   groupTitleColor={'#1B385E'}
                   titleBorderColor={'#162E50'}
                   dataSource={this.state.data}
                   groupDataName={'orgMembers'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />
      </NavBarView>
    );
  }
});

module.exports = DeleteMember;
