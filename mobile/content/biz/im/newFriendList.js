/**
 * Created by baoyinghai on 5/16/16.
 */

let React = require('react-native');
let {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let ContactAction = require('../../framework/action/contactAction');
let ContactSotre = require('../../framework/store/contactStore');
let NewFriendStore = require('../../framework/store/newFriendStore');
let { NEW_FRIEND } = require('../../constants/dictEvent');
let AppStore = require('../../framework/store/appStore');
let { Device,Alert } = require('mx-artifacts');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');
let ImUserInfo = require('./imUserInfo');

let NewFriendList = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, NEW_FRIEND);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, NEW_FRIEND);
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    let userInfo = ContactSotre.getUserInfo();
    return {dataSource:NewFriendStore.queryAllNewNotic(userInfo.userId),
      userInfo:userInfo};
  },

  getInitialState:function(){
    return this.getStateFromStores();
  },

  deleteSession: function(item){
   NewFriendStore.deleteFriendInvite(item.noticId, this.state.userInfo.userId)
  },


  acceptInvite: function(item) {

    let userInfo = this.state.userInfo;

    this.props.exec(()=>{

      return ContactAction.acceptFriend(item.userId).then((response) => {
       // Alert(response);
        NewFriendStore.modifyInviteState(item.noticId, userInfo.userId);
      }).catch((err)=>{
        throw err;
      });
    });

  },

  toOther: function(item) {
    let self = this;
    this.props.exec(()=>{
      return new Promise((resolve,reject)=>{
        let data = {};
        try {
          data = ContactSotre.getUserInfoByUserId(item.userId);
          resolve(data);
        }catch(err){
          //下载信息
          resolve(ContactAction.getUserInfoFromServer(item.userId));
        }
      }).then((data)=>{
        let opt = {};
        if(item.isAccept){
          opt = {isStringer:false};
        }else{
          opt={isStranger:true,callBack:()=>self.acceptInvite(item)};
        }
        this.props.navigator.push({
          comp:ImUserInfo,
          param:Object.assign(data,opt)
        });
      });
    });

  },

  renderItem: function(item) {
    let {width} = Device;

    return (
      <TouchableOpacity
        key={item.userId}
        style={{backgroundColor:'#FEFEFE'}}
        onLongPress={
        ()=>
          {
            Alert('确定删除该条记录?', () => {this.deleteSession(item)},()=>{})
          }
        }
        onPress={()=>{
        this.toOther(item);
        }}>
        <View
          style={{
          borderBottomColor: DictStyle.colorSet.demarcationColor,
           borderBottomWidth:0.5,
            flexDirection:'row',
            paddingVertical:7,
            marginHorizontal:10,
            alignItems:'center',flex:1}}
        >
          <HeaderPic badge={0} name={item.realName} photoFileUrl={item.photoFileUrl} certified={item.certified}/>
          <View
             style={{
             flex:1,paddingHorizontal:10
             }}
          >
          <View
            style={{
            flexDirection:'row', justifyContent:'space-between',flex:1}}
          >
            <View style={{flex:2}}>
              <Text numberOfLines={1} style={{color:DictStyle.colorSet.imTitleTextColor}}>{item.realName + '-' + item.orgName+'hhhhh'}</Text>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{'已加你为好友'}</Text>
            </View>

            {(()=>{
              if(item.isAccept){
                return (
                  <Text
                    style={{textAlign:'right',flex:1,justifyContent:'flex-end',borderRadius:5,color:'#687886', paddingHorizontal:20,paddingVertical:5}}>{'已接受'}</Text>

                );
              }else{
                return (
                  <TouchableOpacity style={{flex:1,marginRight:10}} onPress={()=>this.acceptInvite(item)}>
                    <View style={{justifyContent:'flex-end',borderRadius: 5, backgroundColor: '#23ABF3',paddingHorizontal:10,paddingVertical:5}}>
                      <Text
                        style={{color: '#EAF7FD', textAlign:'center'}}>{'加好友'}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            })()}

            </View>
            </View>
        </View>
      </TouchableOpacity>
    );
  },

  renderMessage: function() {
    let ret = [];

    this.state.dataSource.forEach((item) => {
      ret.push(this.renderItem(item));
    });
    return ret;
  },

  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='新好友' >
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={{flexDirection: 'column',marginTop:0,backgroundColor:'#F4F4F4'}}>
          {this.renderMessage()}
        </ScrollView>
      </NavBarView>
    );
  }
});

module.exports = NewFriendList ;
