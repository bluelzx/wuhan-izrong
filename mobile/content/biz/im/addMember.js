/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {View, TouchableOpacity,Platform, Text} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList, Device, Alert } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let CheckBox = require('./checkBox');
let ContactStore = require('../../framework/store/contactStore');
let DictIcon = require('../../constants/dictIcon');
let ChooseList = require('./chooseList');
let ContactAction = require('../../framework/action/contactAction');
//let NameCircular = require('./nameCircular').NameCircular;
let Setting = require('../../constants/setting');
let {groupFilter} = require('./searchBarHelper');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');


let AddMember = React.createClass({


  getInitialState:function() {
    let groupId = this.props.param.groupId;
    return {
      data:ContactStore.getUsersExpress(groupId),
      memberList:{},
      existMembers:this.props.param.existMembers,
      keyWord:'',
      isOpen:false
    }
  },

  textChange: function(text) {
    if(text == ''){
      isOpen = false;
      this.setState({keyWord:text,isOpen:false});
    }else{
      isOpen = true;
      this.setState({keyWord:text,isOpen:true});
    }
  },

  textOnBlur:function(){
    if(this.state.keyWord==='')
      this.setState({isOpen:false});
  },

  addUser: function( groupId, members) {

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
    }

    if(Object.keys(members).length + this.state.existMembers > Setting.groupMemberUpperLimit){
      Alert('群组成员人数不能超过' + Setting.groupMemberUpperLimit);
      return;
    }
    this.props.exec(
      ()=>{
        //step1: 添加成员
       return  ContactAction.addGroupMembers(this.props.param.groupId, members).then(
         (response)=>{
           //step2: 回退
           this.props.navigator.pop();
         }
       ).catch((err)=>{
         throw err;
       });
      }
    );
  },

  renderState: function () {
    let memberList = this.state.memberList;
    let count = 0;
    for(let userId in memberList){
      if(!!memberList[userId]){
        count ++ ;
      }
    }
    return (
      <TouchableOpacity onPress={() => this.addUser(this.props.param.groupId, memberList)}>
        <Text style={{ marginLeft:Platform.OS==='ios'?-40:0,color:'white'}}>{'完成(' + count + '/'+ (Setting.groupMemberUpperLimit - this.state.existMembers)+')'}</Text>
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
        numberOfLines={1}
        style={
          {flex:1,fontSize:15,color: DictStyle.colorSet.imTitleTextColor}}>
        {data.orgValue}
      </Text>
    );
  },

  //渲染组成员
  itemRender: function(data) {
    return (
    <CheckBox
      init={this.state.memberList[data.userId]}
      key={data.userId}
              item={data}
              choice={this.checkBoxChoice}
              unChoice={this.unCheckBoxChoice}
              style={{backgroundColor:DictStyle.colorSet.extenListGroundCol,paddingHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
      <View style={{flexDirection:'row', paddingVertical:5,alignItems:'center'}}>
        <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
        <Text numberOfLines={1} style={{flex:1,fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName}</Text>
      </View>
    </CheckBox>
    );
  },


  render: function() {
    return (

      <NavBarView navigator={this.props.navigator} title='添加群成员' actionButton={this.renderState}>
        <ChooseList  memberList={this.state.memberList}/>


        {(()=>{

          let dataSource = groupFilter(this.state.data,'orgValue','orgMembers','realName',this.state.keyWord);
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
                         groupTitleRender={this.titleRender}
              />
            );
          }else{
            return (
              <View style={{backgroundColor:'transparent', alignItems:'center',marginTop:40}}>
                <Text style={{color:DictStyle.searchFriend.nullUnitColor}}>{'无符合条件的用户'}</Text>
              </View>
            );
          }
        })()}

      </NavBarView>
    );
  }
});

module.exports = AddMember;
