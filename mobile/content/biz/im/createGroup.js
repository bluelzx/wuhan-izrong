/**
 * Created by baoyinghai on 16/4/5.
 */

let React = require('react-native');
let {Text, View, TextInput, Platform, TouchableOpacity, Image} = React;
let { Device } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let CheckBox = require('./checkBox');

const MockData = [
  {groupName: '我的群组A', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: '我的群组B', groupData: [ {imgId:'../../pic/man.jpg', desc: 'B吴'}, {imgId:'../../pic/man.jpg', desc: 'B张'},
    {imgId:'../../pic/man.jpg', desc: 'B李'}]},
  {groupName: '我的群组A', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: '我的群组A', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: '我的群组A', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},


];


let CreateGroup = React.createClass({

  textChange: function() {

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
        {data.groupName}
      </Text>
    );
  },


  //渲染组成员
  itemRender: function(data) {
    return (
      <CheckBox key={data.desc}
                style={{width:Device.width,borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: '#132232'}}>
        <View style={{flexDirection:'row'}}>
          {this.renderImg(data)}
          <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.desc}</Text>
        </View>
      </CheckBox>
    );
  },
  //*********************


  renderLabel: function() {
    return (
      <Text style={{ marginLeft:-20,color:'#6B849C'}}>{'创建(' + 29+ ')'}</Text>
    );
  },

  render: function() {

    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='创建群组'
                  showBar={true}
                  actionButton={this.renderLabel}>
        <View style={{backgroundColor:'#18304D', paddingTop:10}}>
          <TextInput
            placeholder="创建群名称"
            placeholderTextColor="white"
            style={{color: '#ffffff',height:(Platform.OS === 'ios')?50:100, width: Device.width,backgroundColor:'#15263A', paddingHorizontal:20}}></TextInput>
        </View>

        <SearchBar textChange={this.textChange}/>

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

module.exports = CreateGroup;
