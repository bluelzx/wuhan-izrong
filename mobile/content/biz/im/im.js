/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  DeviceEventEmitter
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let Icon = require('react-native-vector-icons/Ionicons');
let DateHelper = require('../../comp/utils/dateHelper');
let { Device } = require('mx-artifacts');
let Swipeout= require('react-native-swipeout');
let Contacts = require('./contacts');
let Chat = require('./chat');
let SearchBar = require('./searchBar');

let MockData = [
  {id:1,badge:0,title:'环渤海银银合作平台',recTime:new Date(),content:'尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'},
  {id:2,badge:1,title:'张缪缪',recTime:new Date(),content:'尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'},
  {id:3,badge:2,title:'吴某某',recTime:new Date(),content:'尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'},
  {id:4,badge:99,title:'某群',recTime:new Date(),content:'尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'}
]

let WhitePage = React.createClass({

  textChange: function() {

  },

  renderContact: function() {
    return (
      <TouchableOpacity onPress={()=>{
      this.props.navigator.push({
            comp: Contacts
      });
      }}>
        <Icon name="ios-list-outline" size={25} color='#ffffff' />
      </TouchableOpacity>
    );
  },

  unReadIcon: function(item){
    if (item.badge > 0) {
      return (
        <View style={[{marginLeft:22,width:18,height:18,borderRadius:9,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},item.badge>=99&&{height:20,width:(Platform.OS === 'ios')?24:22,marginLeft:18}]}>
          <Text style={{color:'white',fontSize:11}}>{item.badge >= 99 ? "99+" : item.badge}</Text>
        </View>
      )
    }
  },

  renderImg: function(item, index) {
    return (
      <View style={{marginTop:5,backgroundColor: '#F3AD2C', height: 40,width: 40,borderRadius: 20, marginRight:15}}>
        {this.unReadIcon(item)}
      </View>
    );
  },

  toOther: function(item) {
    this.props.navigator.push({
      comp:Chat,
      param:{title:item.title}
    });
  },

  componentWillMount:function() {
    DeviceEventEmitter.addListener('keyboardWillShow', function(e: Event) {
      console.log('hello RC, I am Android Native');
    });
  },
  renderItem: function(item, index) {
    let {width} = Device;
    let swipeoutBtns = [
      {
        text: '删除',
        backgroundColor: 'red',
        onPress: function(){

        }
      }
    ]
    return (
      <Swipeout key={index} autoClose={true} backgroundColor='transparent' right={swipeoutBtns}>
        <TouchableHighlight onPress={()=>this.toOther(item)}>
          <View
            style={{borderBottomColor: '#111D2A',borderBottomWidth:0.5,flexDirection:'row', paddingVertical:10, paddingHorizontal:10}}>
            {this.renderImg(item, index)}
            <View
              style={{ height:40, width:width-70}}>
              <View
                style={{marginTop:5, flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'#ffffff'}}>{item.title}</Text>
                <Text style={{color:'#ffffff'}}>{DateHelper.descDate(item.recTime)}</Text>
              </View>
              <Text numberOfLines={1}
                    style={{marginTop:5,color:'#687886'}}>{item.content}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  },

  renderMessage: function() {
    let msg = new Array();
    MockData.map((item, index)=>{
      msg.push(this.renderItem(item, index));
    });
    return msg;
  },

  render: function() {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='IM' showBack={false}
                  showBar={true}
                  actionButton={this.renderContact}>
       <SearchBar textChange={this.textChange}/>
        <View>
          {this.renderMessage()}
        </View>
      </NavBarView>
    );
  }
});

module.exports = WhitePage;
