/**
 * Created by baoyinghai on 16/4/6.
 */

let  React = require('react-native');
const {View, TextInput, Platform, Text} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let ContactStore = require('../../framework/store/contactStore');
let NameCircular = require('./nameCircular');

let GroupMembers = React.createClass({

  getInitialState: function() {
    let groupId = this.props.param.groupId;
    return {
      data:ContactStore.getUsersByGroupId(groupId)
    };
  },

  textChange: function(){

  },

  //******************** 扩展列表
  //渲染组标题
  titleRender: function(data) {
    return (
      <Text
        style={
          {color: '#ffffff'}}>
        {data.orgValue}
      </Text>
    );
  },


  //渲染组成员
  itemRender: function(data) {
    return (
      <View key={data.userId}
            style={{borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: '#132232'}}>
        <NameCircular name={data.realName}/>
        <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.realName}</Text>
      </View>

    );
  },
  //*********************


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='全部成员'
                  showBar={true}>

        <SearchBar textChange={this.textChange}/>

        <ExtenList itemHeight={56}
                   groundColor={'#15263A'}
                   groupBorderColor={"#132232"}
                   arrowColor={'#ffffff'}
                   groupTitleColor={'#1B385E'}
                   titleBorderColor={'#162E50'}
                   dataSource={this.state.data}
                   groupDataName={'orgMembers'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />
      </NavBarView>
    );
  }
});

module.exports = GroupMembers;
