/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {View, TouchableOpacity,Platform, Text, ListView} = React;
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
    //return {
    //  data:ContactStore.getUsersByGroupId(groupId),
    //  memberList:{},
    //  userInfo:ContactStore.getUserInfo()
    //}
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let groupDetail = ContactStore.getGroupDetailById(groupId);
    let orgData = groupDetail&&groupDetail.members;
    let nIndex = -1;
    orgData.forEach((item, index)=>{
      if(item.userId == groupDetail.groupMasterUid){
        nIndex = index;
      }
    });
    if(nIndex != -1){
      orgData.splice(nIndex, 1);
    }
    return {
      orgData:orgData,
      dataSource: ds.cloneWithRows(orgData),
      memberList:{},
      userInfo:ContactStore.getUserInfo()
    };

  },

  delUser: function( groupId, members) {
    dismissKeyboard();
    this.props.exec(() => {
      return ContactAction.deleteGroupMembers(this.props.param.groupId, members).then(()=>{
        this.props.navigator.pop();
      }).catch((errorData) => {
        throw errorData;
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
          {fontSize:15,color: DictStyle.colorSet.imTitleTextColor}}>
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
        <View style={{ backgroundColor:'#FEFEFE'}}>
        <CheckBox
          init={this.state.memberList[data.userId]}
          key={data.userId}
                  item={data}
                  choice={this.checkBoxChoice}
                  unChoice={this.unCheckBoxChoice}
                  style={{marginHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flex:1,flexDirection:'row', paddingVertical:5, alignItems:'center'}}>
              <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                <Text
                  style={{fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName}</Text>
                <Text
                  style={{flex:1,fontSize:15,color:'#B7C0C7', marginLeft: 2,flexWrap:'wrap'}}>{'-'+ data.orgValue }</Text>
              </View>
            </View>
          </View>
        </CheckBox>
          </View>
      );
  },


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='删除群成员' actionButton={this.renderState}>
        {/*<SearchBar textChange={this.textChange}/>*/}

        {(()=>{

          //let dataSource = groupFilter(this.state.data,'orgValue','orgMembers','realName',this.state.keyWord, this.state.userInfo.userId);
          let dataSource = this.state.orgData;
          if(dataSource && dataSource.length > 0) {

            //return (
            //  <ExtenList itemHeight={57}
            //             groundColor={DictStyle.colorSet.extenListGroundCol}
            //             groupBorderColor={DictStyle.colorSet.demarcationColor}
            //             arrowColor={DictStyle.colorSet.extenListArrowColor}
            //             groupTitleColor={DictStyle.colorSet.extenListGroupTitleColor}
            //             titleBorderColor={DictStyle.colorSet.demarcationColor}
            //             dataSource={dataSource}
            //             groupDataName={'orgMembers'}
            //             groupItemRender={this.itemRender}
            //             groupTitleRender={this.titleRender} />
            //);
            return (
                <ListView
                  style={{marginTop:10}}
                  dataSource={this.state.dataSource}
                  renderRow={this.itemRender}
                />
            );
          }else{
            return (
              <View style={{backgroundColor:'transparent', alignItems:'center', marginTop:10}}>
                <Text style={{color:DictStyle.searchFriend.nullUnitColor}}>{'无符合条件的用户'}</Text>
              </View>
            );
          }
        })()}

      </NavBarView>
    );
  }
});

module.exports = DeleteMember;
