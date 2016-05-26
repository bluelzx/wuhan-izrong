/**
 * Created by baoyinghai on 16/4/6.
 */

let  React = require('react-native');
const {View, Text, StyleSheet} = React;
let NavBarView = require('../../framework/system/navBarView');
let { ExtenList } = require('mx-artifacts');
let SearchBar = require('./searchBar');
let ContactStore = require('../../framework/store/contactStore');
//let NameCircular = require('./nameCircular').NameCircular;
let {groupFilter, userFilter} = require('./searchBarHelper');
let DictStyle = require('../../constants/dictStyle');
let HeaderPic = require('./headerPic');
let ConvertChineseKey = require('../../comp/utils/convertChineseKey');
let AlphabetListView = require('react-native-alphabetlistview');


let SectionHeader = React.createClass({
  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>{this.props.title}</Text>
      </View>
    );
  }
});

let SectionItem = React.createClass({
  render() {
    return null;
  }
});

let Cell = React.createClass({
  render() {
    let data = this.props.item;
    return (
      <View key={data.userId}
            style={{backgroundColor:'#FEFEFE',borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: DictStyle.colorSet.demarcationColor,alignItems:'center'}}>
        <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
          <View style={{flex:1}}>
            <Text numberOfLines={1}
                  style={{fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName }</Text>
            <Text numberOfLines={1}
                  style={{flex:1,fontSize:15,color:'#B7C0C7', marginLeft: 2,flexWrap:'wrap'}}>{data.orgValue }</Text>
          </View>
        </View>
      </View>
    );
  },

});


let GroupMembers = React.createClass({

  getInitialState: function() {
    let groupId = this.props.param.groupId;
    let originalData = ContactStore.getGroupDetailById(groupId).members;
    return {
      originalData:originalData,
      data:ConvertChineseKey.buildGroupMemberList(originalData),
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
          {fontSize:15,color:  DictStyle.colorSet.imTitleTextColor}}>
        {data.orgValue}
      </Text>
    );
  },


  //渲染组成员
  itemRender: function(data) {
    return (
      <View key={data.userId}
            style={{borderTopWidth:0.5, flexDirection:'row', paddingHorizontal:10, paddingVertical:5, borderTopColor: DictStyle.colorSet.demarcationColor,alignItems:'center'}}>
        <HeaderPic  photoFileUrl={data.photoFileUrl}  certified={data.certified} name={data.realName}/>
        <Text style={{fontSize:15,color:DictStyle.colorSet.imTitleTextColor, marginLeft: 10}}>{data.realName}</Text>
      </View>

    );
  },
  //*********************


  render: function() {
    return (
      <NavBarView navigator={this.props.navigator} title='全部成员'>

        <SearchBar textChange={this.textChange}/>

        {(()=>{

         // let dataSource = groupFilter(this.state.data,'orgValue','orgMembers','realName',this.state.keyWord);
          let originalData = this.state.originalData;
          let dataSource = userFilter(originalData,'orgValue','realName',this.state.keyWord);
          if(dataSource && dataSource.length > 0) {
            //return (
            //  <ExtenList itemHeight={57}
            //             groundColor={DictStyle.colorSet.extenListGroundCol}
            //             groupBorderColor={DictStyle.colorSet.demarcationColor}
            //             arrowColor={DictStyle.colorSet.extenListArrowColor}
            //             groupTitleColor={DictStyle.colorSet.extenListGroupTitleColor}
            //             titleBorderColor={DictStyle.colorSet.demarcationColor}
            //             dataSource={dataSource}
            //             groupDataName={'orgMembers'}
            //             groupItemRender={this.itemRender}
            //             groupTitleRender={this.titleRender} />
            //
            //);
            return (
              <AlphabetListView
                data={ConvertChineseKey.buildGroupMemberList(dataSource)}
                cell={Cell}
                cellHeight={30}
                sectionListItem={SectionItem}
                sectionHeader={SectionHeader}
                sectionHeaderHeight={22.5}
                updateScrollState={true}
              />
            );
          }else{
            return (
              <View style={{backgroundColor:'transparent', marginTop:20, alignItems:'center', color:DictStyle.searchFriend.nullUnitColor}}>
                <Text>{'无符合条件的用户'}</Text>
              </View>
            );
          }
        })()}


      </NavBarView>
    );
  }
});

let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  textStyle: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#3b4549',
    fontWeight: '700',
    fontSize: 16
  },
  viewStyle: {
    backgroundColor: '#F4F4F4',
    marginTop: -1,
    height: 30,
    justifyContent: 'center',
    borderTopColor: '#DFE1ED',
    borderTopWidth: 0.5

  }
});

module.exports = GroupMembers;
