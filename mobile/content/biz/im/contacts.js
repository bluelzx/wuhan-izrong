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
  InteractionManager
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let CreateGroup = require('./createGroup');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let Chat = require('./chat');
let Icon = require('react-native-vector-icons/Ionicons');
let ContactStore = require('../../framework/store/contactStore');
let AppStore = require('../../framework/store/appStore');
let DictIcon = require('../../constants/dictIcon');
let { SESSION_TYPE } = require('../../constants/dictIm');
let Spread = require('./spread');
let NameCircular = require('./nameCircular');

let Contacts = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
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
    return this.getStateFromStores();
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
          {color: '#ffffff'}}>
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
        <TouchableHighlight key={data.groupId}
                            onPress={() => this.toGroup(data)}
                            style={{borderTopWidth:0.5,  borderTopColor: '#132232'}}>
          <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
            <Image style={{height: 40,width: 40,borderRadius: 20}} source={DictIcon.imMyGroup} />
            <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.groupName}</Text>
          </View>
        </TouchableHighlight>

      );
    }else {
      return (
        <TouchableHighlight key={data.userId}
                            onPress={() => this.toUser(data)}
                            style={{borderTopWidth:0.5,  borderTopColor: '#132232'}}>
          <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
            <NameCircular name={data.realName}/>
            <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.realName}</Text>
          </View>
        </TouchableHighlight>

      );
    }
  },
  //*********************

  textChange: function() {

  },

  //创建组群
  renderAdd: function() {
    return (
      <TouchableOpacity onPress={()=>{
      this.props.navigator.push({
            comp: CreateGroup
      });
      }}>
        <Image  style={{width:20,height:20}} source={DictIcon.imCreateGroupBtn}/>
      </TouchableOpacity>
    );
  },

  renderGlobal: function() {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigator.push({comp:Spread})}
            style={{borderTopWidth:0.5, borderTopColor: '#132232'}}>
        <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
          <Image style={{height: 40,width: 40,borderRadius: 20}} source={DictIcon.imSpread} />
          <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{'环渤海银银合作平台'}</Text>
        </View>
      </TouchableHighlight>
    );
  },


  render: function() {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='通讯录'
                  showBar={true}
                  actionButton={this.renderAdd}>
        <SearchBar textChange={this.textChange}/>
        {this.renderGlobal()}
        <ExtenList itemHeight={51}
                   groundColor={'#15263A'}
                   groupBorderColor={"#132232"}
                   arrowColor={'#ffffff'}
                   groupTitleColor={'#1B385E'}
                   titleBorderColor={'#162E50'}
                   dataSource={this.state.dataSource}
                   groupDataName={'orgMembers'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />
      </NavBarView>
    );
  }
});

module.exports = Contacts;
