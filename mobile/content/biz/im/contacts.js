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
  StyleSheet,
  Platform,
  InteractionManager
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let CreateGroup = require('./createGroup');
let SearchFriend = require('./searchFriend');
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
let {contactFilter,groupFilter} = require('./searchBarHelper');
let { IM_CONTACT } = require('../../constants/dictEvent');
let DictStyle = require('../../constants/dictStyle');
import  Angle  from '../../comp/messenger/angle';
const {ExtenList, Device,Alert } = require('mx-artifacts');

const PLATFORMNAME = '爱资融同业平台';

let Contacts = React.createClass({


  componentDidMount() {
    let self = this;
    let handle =  new Promise((resolve, reject) => {
      resolve(self.getStateFromStores());
    }).catch((err)=>{
      reject(err);
    }).then((resp)=>{
      self.setState(resp);
    }).catch((err)=>{
      throw err;
    });
    AppStore.addChangeListener(this._onChange,IM_CONTACT);

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
    return Object.assign({ isOpen:false,showView:false,keyWord:'',userInfo:ContactStore.getUserInfo()},this.getStateFromStores());
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
    let title = data.orgValue;
    return (
      <Text
        numberOfLines={1}
        style={
          {flex:1,fontSize:15,color: DictStyle.colorSet.imTitleTextColor}}>
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

      return (
        <TouchableOpacity key={data.type=='group'?data.groupId:data.userId}
                            onPress={() => data.type=='group'?this.toGroup(data):this.toUser(data)}
                          activeOpacity={0.8}
                            style={{backgroundColor:DictStyle.colorSet.extenListGroundCol,paddingHorizontal:10,borderTopWidth:0.5,  borderTopColor: DictStyle.colorSet.demarcationColor}}>
          <View style={{flexDirection:'row', paddingVertical:5,alignItems:'center'}}>
            {(()=>{
              if(data.type=='group'){
                return (
                  <Image style={{height: 46,width: 46,borderRadius: 23}} source={DictIcon.imMyGroup} />
                );
              }else{
                return (
                  <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
                );
              }
            })()}
            <Text  numberOfLines={1} style={[{flex:1,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10},FontSize.realName]}>{data.realName}</Text>
          </View>
        </TouchableOpacity>

      );
    //}
  },
  //*********************

  textChange: function(text) {
    //this.setState({keyWord:text});
    if(text == ''){
      this.setState({keyWord:text});
    }else{
      this.setState({keyWord:text,isOpen:true});
    }
  },

  textOnBlur:function(){
    if(this.state.keyWord=='')
    this.setState({isOpen:false});
  },

  addMore: function() {
   this.setState({showView:!this.state.showView});
  },

  //创建组群
  renderAdd: function() {
    return (
      <TouchableOpacity
        style={{padding:50,marginRight:-50}}
        onPress={()=>{
      this.addMore();
      }}>
        {<Image style={{width:25,height:25}} source={DictIcon.imCreateGroupBtn}/>}
      </TouchableOpacity>
    );
  },

  renderGlobal: function() {
    if(!!~PLATFORMNAME.indexOf(this.state.keyWord) || this.state.keyWord==''){
    return (
      <TouchableOpacity
        onPress={() => this.props.navigator.push({comp:Spread})}
            style={{
            backgroundColor:DictStyle.colorSet.extenListGroundCol,
            borderTopWidth:0.5,
            borderTopColor: DictStyle.colorSet.demarcationColor}}
      >
        <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
          <HeaderPic source={DictIcon.imSpread} />
          <Text style={[{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10, marginTop:15},FontSize.realName]}>{PLATFORMNAME}</Text>
        </View>
      </TouchableOpacity>
    );
    }else{
      return null;
    }
  },

  renderMenu: function(){
    return (
      <View style={{position:'absolute',top:Platform.OS === 'ios'?Device.navBarHeight:0,right:5,width:150}}>
        <View>
          <View style={{ alignItems: 'flex-end',paddingRight:10}}>
            <Angle direction="up" color='#4074E6'/>
          </View>
          <View style={{backgroundColor:'#4074E6', borderRadius:5,paddingHorizontal:5,paddingVertical:10, marginTop:Platform.OS==='ios'?0:-12}}>
            <TouchableOpacity
              onPress={
                () => {
                  this.setState({showView:false});

                  this.props.navigator.push({
                            comp: SearchFriend
                            });
                      }
                }>
              <View style={{alignItems:'center', justifyContent:'center',flexDirection:'row', paddingBottom:10,borderBottomWidth:1,borderBottomColor:'#273CDF'}}>
                <Icon name="ios-search-strong" size={20} color='#fff' />
                <Text style={{marginLeft:5, color:'#fff',fontSize:18}}>添加好友</Text>
              </View>
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
              <View style={{alignItems:'center',justifyContent:'center',paddingTop:5,flexDirection:'row', marginTop:5}}>
                <Icon name="android-add" size={20} color='#fff' />
                <Text style={{marginLeft:5, color:'#fff',fontSize:18}}>创建群组</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },

  render: function() {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title='通讯录' actionButton={this.renderAdd} >
        {
          /*<SearchBar textChange={this.textChange} textOnBlur={this.textOnBlur}/>*/
        }

        {this.renderGlobal()}

        {(()=>{


            //let dataSource =  groupFilter(this.state.dataSource,'orgValue','orgMembers','realName',this.state.keyWord, this.state.userInfo.userId);
            let dataSource = contactFilter(this.state.dataSource, 'orgMembers', 'groupName', 'orgValue', 'orgMembers', 'realName', this.state.keyWord, this.state.userInfo.userId);
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
            }
          else{
              return (
                <View style={{backgroundColor:'transparent', alignItems:'center', marginTop:20}}>
                  <Text style={{color:DictStyle.searchFriend.nullUnitColor}}>{'无符合条件的用户/机构'}</Text>
                </View>
              );
          }

        })()}

        {(()=>{

          if(Platform.OS === 'ios'){
            return (
              <Modal
                animationType={'fade'}
                transparent={true}
                visible={this.state.showView}
              >
                <View pointerEvents="auto"
                      onStartShouldSetResponder={(evt) => true}
                      onResponderRelease={()=>this.setState({showView:false})}
                      style={{flex:1,justifyContent:'center',backgroundColor:'transparent'}}>
                  {this.renderMenu()}
                </View>
              </Modal>
            );
          }else{
            if (this.state.showView){
            return (
              <View
                pointerEvents="auto"
                onStartShouldSetResponder={(evt) => true}
                onResponderRelease={()=>this.setState({showView:false})}
                style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'transparent'}}>
                {this.renderMenu()}
              </View>
            );
            }
            else
              return null;
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

let FontSize = StyleSheet.create({
  realName:{
    fontSize:15
  },
  rightTime:{
    fontSize:11
  },
  bottomDesc:{
    fontSize:15
  }
});
