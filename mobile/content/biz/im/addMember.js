/**
 * Created by baoyinghai on 16/4/6.
 */
let React = require('react-native');
const {View, TouchableHighlight, Text} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');

const MockData = [
  {groupName: '天津银行', groupData: [ {imgId:'../../pic/man.jpg', desc: 'A吴'}, {imgId:'../../pic/man.jpg', desc: 'A张'}]},
  {groupName: '工商银行', groupData: [ {imgId:'../../pic/man.jpg', desc: 'B吴'}, {imgId:'../../pic/man.jpg', desc: 'B张'}, {imgId:'../../pic/man.jpg', desc: 'B李'}]}
];

let AddMember = React.createClass({

  textChange: function() {

  },

  renderState: function () {
    return (
      <Text style={{color:'#ffffff',marginLeft:-20}}>{'完成(1)'}</Text>
    );
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


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1' contentBackgroundColor='#15263A' title='添加群成员'
                  showBar={true}
                  actionButton={this.renderState}>
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

module.exports = AddMember;
