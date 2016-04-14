/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let CreateGroup = require('./createGroup');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let Chat = require('./chat');
let Icon = require('react-native-vector-icons/Ionicons');
let ContactStore = require('../../framework/store/contactStore');
let AppStore = require('../../framework/store/appStore');
let CONSTANT = require('./itemType');
let DictIcon = require('../../constants/dictIcon');
let Spread = require('./spread');



let Contacts = React.createClass({

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getStateFromStores: function() {
    return {dataSource:ContactStore.getContact()};
  },

  getInitialState: function(){
    return this.getStateFromStores();
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
        {data.orgName}
      </Text>
    );
  },

  //渲染组成员
  itemRender: function(data) {
    if(data.type==CONSTANT.GROUP){
      return (
        <TouchableHighlight key={data.groupId}
                            onPress={() => this.props.navigator.push({comp:Chat, param:{title:data.groupName}})}
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
                            onPress={() => this.props.navigator.push({comp:Chat, param:{title:data.userName}})}
                            style={{borderTopWidth:0.5,  borderTopColor: '#132232'}}>
          <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
            {this.renderImg(data)}
            <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.userName}</Text>
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
        <ExtenList itemHeight={56}
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
