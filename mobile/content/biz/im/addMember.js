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
let DictIcon = require('../../constants/dictIcon');
let HeadPic = require('./headerPic');
let ChooseList = require('./chooseList');
let ContactAction = require('../../framework/action/contactAction');

let AddMember = React.createClass({

  getInitialState:function() {
    let groupId = this.props.param.groupId;
    return {
      data:ContactStore.getUsersExpress(groupId),
      memberList:{}
    }
  },

  textChange: function() {
  },

  addUser: function( groupId, members) {
    this.props.exec(
      ()=>{
        //step1: 添加成员
       return  ContactAction.addGroupMembers(this.props.param.groupId, members).then(
         (response)=>{
           //step2: 回退
           this.props.navigator.pop();
         }
       );
      }
    );
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
      <TouchableOpacity onPress={() => this.addUser(this.props.param.groupId, members)}>
        <Text style={{ marginLeft:-20,color:count==0?'#6B849C':'white'}}>{'完成(' + count + ')'}</Text>
      </TouchableOpacity>
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
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='添加群成员'
                  showBar={true}
                  actionButton={this.renderState}>
        <ChooseList  memberList={this.state.memberList}/>

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

module.exports = AddMember;
