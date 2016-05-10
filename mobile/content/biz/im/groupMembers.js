/**
 * Created by baoyinghai on 16/4/6.
 */

let  React = require('react-native');
const {View, Text} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let ContactStore = require('../../framework/store/contactStore');
let NameCircular = require('./nameCircular').NameCircular;
let {groupFilter} = require('./searchBarHelper');

let GroupMembers = React.createClass({

  getInitialState: function() {
    let groupId = this.props.param.groupId;
    return {
      data:ContactStore.getUsersByGroupId(groupId),
      keyWord:''
    };
  },

  textChange: function(text){
    this.setState({keyWord:text});
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
      <NavBarView navigator={this.props.navigator} title='全部成员'>

        <SearchBar textChange={this.textChange}/>

        <ExtenList itemHeight={51}
                   groundColor={'#15263A'}
                   groupBorderColor={"#132232"}
                   arrowColor={'#ffffff'}
                   groupTitleColor={'#1B385E'}
                   titleBorderColor={'#162E50'}
                   dataSource={groupFilter(this.state.data,'orgValue','orgMembers','realName',this.state.keyWord)}
                   groupDataName={'orgMembers'}
                   groupItemRender={this.itemRender}
                   groupTitleRender={this.titleRender} />
      </NavBarView>
    );
  }
});

module.exports = GroupMembers;
