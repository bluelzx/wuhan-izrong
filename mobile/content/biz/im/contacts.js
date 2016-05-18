/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let CreateGroup = require('./createGroup');
let SearchFriend = require('./searchFriend');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let Chat = require('./chat');
let Icon = require('react-native-vector-icons/Ionicons');
let ContactStore = require('../../framework/store/contactStore');
let AppStore = require('../../framework/store/appStore');
let DictIcon = require('../../constants/dictIcon');
let { SESSION_TYPE } = require('../../constants/dictIm');
let Spread = require('./spread');
//let NameCircular = require('./nameCircular').NameCircular;
let HeaderPic = require('./headerPic');
let {contactFilter} = require('./searchBarHelper');
let { IM_CONTACT } = require('../../constants/dictEvent');
let DictStyle = require('../../constants/dictStyle');
import  Angle  from '../../comp/messenger/angle';
const { Device,Alert } = require('mx-artifacts');

let Contacts = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange,IM_CONTACT);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange,IM_CONTACT);
  },
  _onChange: function () {
    //InteractionManager.runAfterInteractions(()=>{
      this.setState(this.getStateFromStores());
    //});
  },

  getStateFromStores: function() {
    return {dataSource:ContactStore.getContact()};
  },

  getInitialState: function(){
    return Object.assign({ showView:false,keyWord:'',userInfo:ContactStore.getUserInfo()},this.getStateFromStores());
  },

  renderImg: function(data) {
    return (
      <View style={{backgroundColor: '#F3AD2C', height: 40,width: 40,borderRadius: 20}}>
      </View>
    );
  },

  //******************** 扩展列表
  //渲染组标题
  titleRender: function(data, index) {
    let title = "";
    if (index == 0)
      title = '我的群组';
    else
      title = data.orgValue;
    return (
      <Text
        style={
          {color: DictStyle.colorSet.imTitleTextColor}}>
        {title}
      </Text>
    );
  },

  toGroup: function(item){
    let param = {};
    param.chatType = SESSION_TYPE.GROUP;
    param.title = item.groupName;
    param.groupId = item.groupId;
    param.groupMasterUid = item.groupMasterUid;
    this.props.navigator.push({comp:Chat, param:param});

  },

  toUser: function(item){
    let param = {};

    param.chatType = SESSION_TYPE.USER;
    param.title = item.realName;
    param.userId = item.userId;
    this.props.navigator.push({comp:Chat, param:param});
  },

  //渲染组成员
  itemRender: function(data, index) {
    if(index == 0){
      return (
        <TouchableOpacity key={data.groupId}
                            onPress={() => this.toGroup(data)}
                            style={{marginHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flexDirection:'row', paddingVertical:5}}>
            <Image style={{height: 40,width: 40,borderRadius: 20}} source={DictIcon.imMyGroup} />
            <Text style={{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10, marginTop:15}}>{data.groupName}</Text>
          </View>
        </TouchableOpacity>

      );
    }else {
      return (
        <TouchableOpacity key={data.userId}
                            onPress={() => this.toUser(data)}
                            style={{marginHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flexDirection:'row', paddingVertical:5}}>
            <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
            <Text style={{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10, marginTop:15}}>{data.realName}</Text>
          </View>
        </TouchableOpacity>

      );
    }
  },
  //*********************

  textChange: function(text) {
    this.setState({keyWord:text});
  },

  addMore: function() {

   this.setState({showView:true});
  },

  //创建组群
  renderAdd: function() {
    return (
      <TouchableOpacity onPress={()=>{
      this.addMore();
      }}>
        {<Image style={{width:20,height:20}} source={DictIcon.imCreateGroupBtn}/>}
      </TouchableOpacity>
    );
  },

  renderGlobal: function() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigator.push({comp:Spread})}
            style={{borderTopWidth:0.5, borderTopColor: DictStyle.colorSet.demarcationColor}}>
        <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
          <Image style={{height: 40,width: 40,borderRadius: 20}} source={DictIcon.imSpread} />
          <Text style={{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10, marginTop:15}}>{'爱资融同业平台'}</Text>
        </View>
      </TouchableOpacity>
    );
  },


  render: function() {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title='通讯录' actionButton={this.renderAdd}>
        <SearchBar textChange={this.textChange}/>

        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.showView}
        >
          <View pointerEvents="auto"
                onStartShouldSetResponder={(evt) => true}
                onResponderRelease={()=>this.setState({showView:false})}
                style={{flex:1,justifyContent:'center',backgroundColor:'transparent'}}>
            <View style={{position:'absolute',top:Device.navBarHeight,right:5,width:100}}>
            <View>
              <View style={{ alignItems: 'flex-end',paddingRight:10}}>
                <Angle direction="up" color='#375EE4'/>
              </View>
              <View style={{backgroundColor:'#375EE4', borderRadius:5,paddingHorizontal:5,paddingVertical:10}}>
                <TouchableOpacity
                  onPress={
                () => {
                  this.setState({showView:false});

                  this.props.navigator.push({
                            comp: SearchFriend
                            });
                      }
                }>
                <View style={{alignItems:'center', justifyContent:'center',flexDirection:'row', borderBottomWidth:1,borderBottomColor:'#273CDF',paddingBottom:5}}>
                  <Icon name="ios-search-strong" size={18} color='#fff' />
                  <Text style={{marginLeft:5, color:'#fff'}}>添加好友</Text></View>
                </TouchableOpacity>
                <TouchableOpacity
                   onPress={
                () => {
                  this.setState({showView:false});
                  this.props.navigator.push({
                            comp: CreateGroup
                            });
                      }
                }>
                  <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row', marginTop:5}}>
                    <Icon name="android-add" size={18} color='#fff' />
                    <Text style={{marginLeft:5, color:'#fff'}}>创建群组</Text></View>
                </TouchableOpacity>
              </View>
            </View>
              </View>
          </View>
        </Modal>


        {this.renderGlobal()}

        {(()=>{

          let  dataSource = contactFilter(this.state.dataSource,'orgMembers','groupName','orgValue','orgMembers','realName',this.state.keyWord, this.state.userInfo.userId);
          if(dataSource && dataSource.length > 0){
            if(dataSource.length == 1 && dataSource[0].length == 0){
              return (
                <View style={{backgroundColor:'transparent', alignItems:'center'}}>
                  <Text>{'无符合条件的用户'}</Text>
                </View>
              );
            }else
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

module.exports = Contacts;



var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  }
});
