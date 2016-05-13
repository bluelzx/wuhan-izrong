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
let ContactAction = require('../../framework/action/contactAction');
let DictIcon = require('../../constants/dictIcon');
let dismissKeyboard = require('react-native-dismiss-keyboard');
//let NameCircular = require('./nameCircular').NameCircular;
let {groupFilter} = require('./searchBarHelper');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');

let DeleteMember = React.createClass({

  getInitialState:function() {
    let groupId = this.props.param.groupId;
    return {
      data:ContactStore.getUsersByGroupId(groupId),
      memberList:{},
      userInfo:ContactStore.getUserInfo()
    }
  },

  delUser: function( groupId, members) {
    dismissKeyboard();
    this.props.exec(() => {
      return ContactAction.deleteGroupMembers(this.props.param.groupId, members).then(()=>{
        this.props.navigator.pop();
      }).catch((errorData) => {
        Alert(errorData);
      });;
    });
  },

  textChange: function(text) {
    this.setState({keyWord:text});
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
      <TouchableOpacity onPress={() => this.delUser(this.props.param.groupId, memberList)}>
        <Text style={{ marginLeft:Platform.OS==='ios'?-20:0,color:count==0?'#6B849C':'white'}}>{'删除(' + count + ')'}</Text>
      </TouchableOpacity>
    );
  },

  //******************** 扩展列表
  //渲染组标题
  titleRender: function(data) {
    return (
      <Text
        style={
          {color: DictStyle.colorSet.imTitleTextColor}}>
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
          init={this.state.memberList[data.userId]}
          key={data.userId}
                  item={data}
                  choice={this.checkBoxChoice}
                  unChoice={this.unCheckBoxChoice}
                  style={{width:Device.width,borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flexDirection:'row'}}>
            <View style={{height: 40,width: 40}}>
              <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
            </View>
            <Text style={{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10, marginTop:15}}>{data.realName}</Text>
          </View>
        </CheckBox>
      );
  },


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='删除群成员' actionButton={this.renderState}>
        <SearchBar textChange={this.textChange}/>

        {(()=>{

          let dataSource = groupFilter(this.state.data,'orgValue','orgMembers','realName',this.state.keyWord, this.state.userInfo.userId);
          if(dataSource && dataSource.length > 0) {
            return (
              <ExtenList itemHeight={51}
                         groundColor={DictStyle.colorSet.extenListGroundCol}
                         groupBorderColor={DictStyle.colorSet.demarcationColor}
                         arrowColor={DictStyle.colorSet.extenListArrowColor}
                         groupTitleColor={DictStyle.colorSet.extenListGroupTitleColor}
                         titleBorderColor={DictStyle.colorSet.demarcationColor}
                         dataSource={dataSource}
                         groupDataName={'orgMembers'}
                         groupItemRender={this.itemRender}
                         groupTitleRender={this.titleRender} />
            );
          }else{
            return (
              <View style={{backgroundColor:'transparent', alignItems:'center'}}>
                <Text>{'无符合条件的用户'}</Text>
              </View>
            );
          }
        })()}

      </NavBarView>
    );
  }
});

module.exports = DeleteMember;
