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
let DictStyle = require('../../constants/dictStyle');

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
          {color:  DictStyle.colorSet.imTitleTextColor}}>
        {data.orgValue}
      </Text>
    );
  },


  //渲染组成员
  itemRender: function(data) {
    return (
      <View key={data.userId}
            style={{borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: DictStyle.colorSet.demarcationColor}}>
        <NameCircular name={data.realName}/>
        <Text style={{color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10, marginTop:15}}>{data.realName}</Text>
      </View>

    );
  },
  //*********************


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='全部成员'>

        <SearchBar textChange={this.textChange}/>

        {(()=>{

          let dataSource = groupFilter(this.state.data,'orgValue','orgMembers','realName',this.state.keyWord);
          if(dataSource && dataSource.length > 0) {
            return (
              <ExtenList itemHeight={51}
                         groundColor={DictStyle.colorSet.extenListGroundCol}
                         groupBorderColor={DictStyle.colorSet.demarcationColor}
                         arrowColor={DictStyle.colorSet.extenListArrowColor}
                         groupTitleColor={DictStyle.colorSet.extenListGroupTitleColor}
                         titleBorderColor={DictStyle.colorSet.demarcationColor}
                         dataSource={dataSource}
                         groupDataName={'orgMembers'}
                         groupItemRender={this.itemRender}
                         groupTitleRender={this.titleRender} />

            );
          }else{
            return (
              <View style={{backgroundColor:'transparent', alignItems:'center'}}>
                <Text>{'无符合条件的用户'}</Text>
              </View>
            );
          }
        })()}


      </NavBarView>
    );
  }
});

module.exports = GroupMembers;
