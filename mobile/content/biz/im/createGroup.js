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
  {groupName: '我的群组A', groupData: [
    {imgId:'../../pic/man.jpg', desc: 'A吴'},
    {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: '我的群组B', groupData: [
    {imgId:'../../pic/man.jpg', desc: 'B吴'},
    {imgId:'../../pic/man.jpg', desc: 'B张'},
    {imgId:'../../pic/man.jpg', desc: 'B李'}]},
  {groupName: '我的群组A', groupData: [
    {imgId:'../../pic/man.jpg', desc: 'C吴'},
    {imgId:'../../pic/man.jpg', desc: 'C张'}]},
  {groupName: '我的群组A', groupData: [
    {imgId:'../../pic/man.jpg', desc: 'D吴'},
    {imgId:'../../pic/man.jpg', desc: 'D张'}]},
  {groupName: '我的群组A', groupData: [
    {imgId:'../../pic/man.jpg', desc: 'E吴'},
    {imgId:'../../pic/man.jpg', desc: 'E张'}]},


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

  checkBoxChoice: function(item) {
    let memberList = this.state.memberList;
    memberList[item.desc] = item;
    this.setState(memberList);
  },

  unCheckBoxChoice: function(item) {
    let memberList = this.state.memberList;
    memberList[item.desc] = null;
    this.setState(memberList);
  },

  //渲染组成员
  itemRender: function(data) {
    return (
      <CheckBox
                item={data}
                key={data.desc}
                choice={this.checkBoxChoice}
                unChoice={this.unCheckBoxChoice}
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

  renderMemberView: function(data) {
    return data.map((item, index)=>{
      return (
        <View  key={item.desc} style={{alignItems:'center',padding:5}}>
          <View style={{marginTop:5,backgroundColor: '#F3AD2C', height: 30,width: 30,borderRadius: 15}}>
          </View>
        </View>
      );
    });
  },

  renderSelectMem: function(){
    let memberView = new Array();
    let memberList = this.state.memberList;
    for(let des in memberList){
      if(!!memberList[des]){
        memberView.push(memberList[des]);
      }
    }
    if(!!memberList.length)
    this.setState({searchBarWidth:Device.width - 15 - memberList.length * 40});
    return (
      <View style={{backgroundColor:'#1B385E',padding:5, borderBottomWidth:5, borderBottomColor:'#15263A'}}>
        <View style={{flexDirection:'row', backgroundColor:'#15263A'}}>
          {this.renderMemberView(memberView)}
        </View>
      </View>
    );
  },

  getInitialState: function() {
    return {
      searchBarWidth:Device.width - 15,
      memberList:{}
    };
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
            style={{color: '#ffffff',height:50, width: Device.width,backgroundColor:'#15263A', paddingHorizontal:20}}></TextInput>
        </View>


        {this.renderSelectMem()}


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
