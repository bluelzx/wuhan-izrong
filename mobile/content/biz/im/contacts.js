/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Platform
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let CreateGroup = require('./createGroup');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let Chat = require('./chat');
let Icon = require('react-native-vector-icons/Ionicons');


const MockData = [
  {groupName: '我的群组A', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: '我的群组B', groupData: [ {imgId:'../../pic/man.jpg', desc: 'B吴'}, {imgId:'../../pic/man.jpg', desc: 'B张'}, {imgId:'../../pic/man.jpg', desc: 'B李'}]}
];

let Contacts = React.createClass({

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
        {data.groupName}
      </Text>
    );
  },

  //渲染组成员
  itemRender: function(data) {
    return (
      <TouchableHighlight key={data.desc}
                          onPress={() => this.props.navigator.push({comp:Chat, param:{title:data.desc}})}
                          style={{borderTopWidth:0.5,  borderTopColor: '#132232'}}>
        <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
          {this.renderImg(data)}
          <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.desc}</Text>
        </View>
      </TouchableHighlight>

    );
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
        <Icon name="plus" size={25} color='#ffffff' />
      </TouchableOpacity>
    );
  },

  renderGlobal: function() {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigator.push({comp:Chat, param:{title:'环渤海银银合作平台'}})}
            style={{borderTopWidth:0.5, borderTopColor: '#132232'}}>
        <View style={{flexDirection:'row',paddingHorizontal:10, paddingVertical:5}}>
          {this.renderImg(" ")}
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
                   dataSource={MockData}
                   groupDataName={'groupData'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />
      </NavBarView>
    );
  }
});

module.exports = Contacts;
