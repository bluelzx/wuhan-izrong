/**
 * Created by baoyinghai on 16/4/6.
 */

let  React = require('react-native');
const {View, TextInput, Platform, Text} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');

const MockData = [
  {groupName: 'A', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: 'B', groupData: [ {imgId:'../../pic/man.jpg', desc: 'B吴'}, {imgId:'../../pic/man.jpg', desc: 'B张'},
    {imgId:'../../pic/man.jpg', desc: 'B李'}]}
];

let GroupMembers = React.createClass({

  textChange: function(){

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
      <View key={data.desc}
            style={{borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: '#132232'}}>
        {this.renderImg(data)}
        <Text style={{color:'#ffffff', marginLeft: 10, marginTop:15}}>{data.desc}</Text>
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
                   dataSource={MockData}
                   groupDataName={'groupData'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />
      </NavBarView>
    );
  }
});

module.exports = GroupMembers;
