/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

var React = require('react-native');
var {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  }=React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var NavBarView = require('../../framework/system/navBarView');
var RadioControl = require('./radioControl');
var MarketList = require('./marketList');
var SelectOrg = require('./selectOrg');
let Icon = require('react-native-vector-icons/Ionicons');

let MarketAction = require('../../framework/action/marketAction');
var MarketStore = require('../../framework/store/marketStore');

var data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var WhitePage = React.createClass({

  getInitialState(){
    var categoryAndItem = MarketStore.bizDefaultSearch().filterItems;
    return {
      categoryAndItem: categoryAndItem,
      dataSource: categoryAndItem[0].options,
      dataSource2: ['同业存款', '同业拆借', '债券回购', '存单', '其他'],
      dataSource3: ['最新发布', '金额最高', '利率最低'],
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: 0,
      levelOneText: '资金业务',
      levelTwoText: '同业存款',
      optionTwoText: '最新发布',
      pickTypeRow1: 0,
      pickTypeRow2: 0,
      pickTimeRow: 0,
      pickRowColor: '#244266',

    }
  },

  componentWillMount: function () {
    //{this.bizOrderMarketSearchDefaultSearch()};
    //{this.bizOrderMarketSearchsearch()}
    var obj = MarketStore.bizDefaultSearch().filterItems;
    let categroyAndItem = MarketStore.getCategoryAndItem(obj);
    console.log(categroyAndItem)
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='市场' showBack={false} showBar={true}>
        <View
          style={{width: screenWidth,alignItems: "center",justifyContent: "flex-start",flexDirection: "row"}}>
          {this.renderFilter(this.pressFilterType, this.pressFilterTime, this.pressFilterOther)}
        </View>
        <MarketList ref="MARKETLIST" navigator={this.props.navigator}/>
        {this.renderOptionType()}
        {this.renderOptionTime()}
        {this.renderOptionOther()}
      </NavBarView>
    );
  },
  pressFilterType(){
    this.setState({
      clickFilterTime: 0,
      clickFilterOther: 0,
      clickFilterType: (this.state.clickFilterType == 0) ? 1 : 0,
    })
  },
  pressFilterTime(){
    this.setState({
      clickFilterType: 0,
      clickFilterOther: 0,
      clickFilterTime: (this.state.clickFilterTime == 0) ? 1 : 0,
    })
  },
  pressFilterOther(){
    this.setState({
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: (this.state.clickFilterOther == 0) ? 1 : 0,
    })
  },
  pressTypeRow1(rowId){
    if (rowId == 0) {
      this.setState({dataSource2: ['同业存款', '同业拆借', '债券回购', '存单', '其他']})
    } else if (rowId == 1) {
      this.setState({dataSource2: ["同业理财", "福费廷", "资产支持证券", '其他']})
    } else if (rowId == 2) {
      this.setState({dataSource2: ["纸票交易", "电票交易", "纸票回购", "电票回购", '其他']})
    } else if (rowId == 3) {
      this.setState({dataSource2: ["代理开证/保函", "福费廷", '其他']})
    } else if (rowId == 4) {
      this.setState({dataSource2: ["债券承销", "北金所私募券", "资产证券化", "并购", "结构化融资", '其他']})
    } else {
    }
    this.setState({
      pickTypeRow1: rowId,
      pickTypeRow2: 0,
      levelOneText: this.state.dataSource[rowId].displayName,
      levelTwoText: this.state.dataSource2[0],
    })
  },
  pressTypeRow2(rowId){
    this.setState({
      clickFilterType: 0,
      pickTypeRow2: rowId,
      levelTwoText: this.state.dataSource2[rowId],
    })
    {
      this.refs['MARKETLIST']._changeData()
    }
  },
  pressTimeRow(rowId){
    this.setState({
      clickFilterTime: 0,
      pickTimeRow: rowId,
      optionTwoText: this.state.dataSource3[rowId],
    })
  }, renderFilter(pressFilterType, pressFilterTime, pressFilterOther){
    return (
      <View style={{flex:1,flexDirection:'row'}}>
        <TouchableOpacity onPress={pressFilterType} activeOpacity={1}
                          underlayColor="#f0f0f0">
          <View
            style={{width: screenWidth / 2,height:36,backgroundColor:(this.state.clickFilterType == 1)?this.state.pickRowColor:'#1e3754',alignItems: 'center',justifyContent: 'center',flexDirection: 'row',borderRightColor:'#000',borderRightWidth:1}}>
            <Text
              style={{width:screenWidth/2 - 40,color:(this.state.clickFilterType == 1)?'#419cd6':'white'}}
              numberOfLines={1}>{this.state.levelOneText + ' - ' + this.state.levelTwoText}</Text>
            <Icon name={(this.state.clickFilterType == 1)?"arrow-up-b":"arrow-down-b"} size={20}
                  color={(this.state.clickFilterType == 1)?'#419cd6':'white'}/>

          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressFilterTime} activeOpacity={1}
                          underlayColor="#f0f0f0">
          <View
            style={{width: screenWidth / 3,height:36,backgroundColor:(this.state.clickFilterTime == 1)?this.state.pickRowColor:'#1e3754',alignItems: 'center',justifyContent: 'center',flexDirection: 'row',borderRightColor:'#000',borderRightWidth:1}}>
            <Text
              style={{width:screenWidth/3 - 30,color:(this.state.clickFilterTime == 1)?'#419cd6':'white'}}
              numberOfLines={1}>{this.state.optionTwoText}</Text>
            <Icon name={(this.state.clickFilterTime == 1)?"arrow-up-b":"arrow-down-b"} size={20}
                  color={(this.state.clickFilterTime == 1)?'#419cd6':'white'}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressFilterOther} activeOpacity={1}
                          underlayColor="#f0f0f0">
          <View
            style={{width: screenWidth / 6,height:36,backgroundColor:(this.state.clickFilterOther == 1)?this.state.pickRowColor:'#1e3754',alignItems: 'center',justifyContent: 'center',flexDirection: 'row'}}>
            <Text
              style={{width:screenWidth/6 - 30,color:(this.state.clickFilterOther == 1)?'#419cd6':'white'}}
              numberOfLines={1}>{'筛选'}</Text>
            <Icon name={(this.state.clickFilterOther == 1)?"arrow-up-b":"arrow-down-b"} size={20}
                  color={(this.state.clickFilterOther == 1)?'#419cd6':'white'}/>
          </View>
        </TouchableOpacity>

      </View>
    )
  },

  renderOptionType(){
    if (this.state.clickFilterType == 0) {
      return (
        <View></View>
      )
    }
    else {
      return (
        <View style={{position:"absolute",left:0,top:36}}>
          <TouchableOpacity onPress={()=>this.pressFilterType()} activeOpacity={0.8} underlayColor="#f0f0f0">
            <View
              style={{flex: 1, backgroundColor: 'black',opacity:0.2,height:screenHeight,width:screenWidth}}>
            </View>
          </TouchableOpacity>
          <ListView
            style={{backgroundColor:'#162a40',height:180,position:"absolute",left:0,top:0,opacity:this.state.clickFilterType}}
            dataSource={data.cloneWithRows(this.state.dataSource)}
            renderRow={this.renderTypeRow1}/>
          <ListView
            style={{backgroundColor:'#244266',height:180,position:"absolute",left:screenWidth/3,top:0,opacity:this.state.clickFilterType}}
            dataSource={data.cloneWithRows(this.state.dataSource2)}
            renderRow={this.renderTypeRow2}/>
        </View>
      )
    }
  },
  renderOptionTime(){
    if (this.state.clickFilterTime == 0) {
      return (
        <View></View>
      )
    } else {
      return (
        <View style={{position:"absolute",left:0,top:36}}>
          <TouchableOpacity onPress={()=>this.pressFilterTime()} activeOpacity={0.8} underlayColor="#f0f0f0">
            <View
              style={{flex: 1, backgroundColor: 'black',opacity:0.2,position:"absolute",left:0,top:108,height:screenHeight - 108,width:screenWidth}}>
            </View>
          </TouchableOpacity>
          <ListView
            style={{backgroundColor:'#244266',height:108,position:"absolute",left:0,top:0,opacity:this.state.clickFilterTime}}
            dataSource={data.cloneWithRows(this.state.dataSource3)}
            renderRow={this.renderTimeRow}
          />
        </View>
      )
    }

  },
  renderOptionOther(){
    if (this.state.clickFilterOther == 0) {
      return (
        <View></View>
      )
    } else {
      return (
        <View
          style={{backgroundColor:'#244266',width:screenWidth,height:screenHeight - 36,position:"absolute",left:0,top:36}}>
          <TouchableOpacity onPress={()=>this.toPage(SelectOrg)} activeOpacity={0.8} underlayColor="#f0f0f0">
            <View
              style={{width: screenWidth-20,margin:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
              <Text style={{fontSize:16,marginLeft:10,color:'white'}}>{'选择发布机构'}</Text>
              <Image style={{margin:10,width:16,height:16}}
                     source={require('../../image/market/next.png')}
              />
            </View>
          </TouchableOpacity>
          <RadioControl/>
          <TouchableHighlight onPress={() => this.confirmBtn()} underlayColor='rgba(129,127,201,0)'>
            <View
              style={{margin:10,borderRadius:5,flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
              <Text style={{fontWeight: 'bold', color:'white',}}>
                {'确定'}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      )
    }

  },
  renderTypeRow1(rowData, sectionID, rowID){
    return (
      <TouchableOpacity
        style={{height:36,backgroundColor:(this.state.pickTypeRow1 == rowID)?this.state.pickRowColor:'#162a40',alignItems: "center",justifyContent: "center",}}
        onPress={()=>this.pressTypeRow1(rowID)} activeOpacity={1}
        underlayColor="#f0f0f0">
        <View style={{width:screenWidth/3}}>
          <Text style={{marginLeft:10,color:'white'}}>{rowData.displayName}</Text>
        </View>
      </TouchableOpacity>
    )
  },
  renderTypeRow2(rowData, sectionID, rowID){
    return (
      <TouchableOpacity
        style={{height:36,backgroundColor:(this.state.pickTypeRow2 == rowID)?'#2b4f79':'#244266',alignItems: "center",justifyContent: "center"}}
        onPress={()=>this.pressTypeRow2(rowID)} activeOpacity={1}
        underlayColor="#f0f0f0">
        <View style={{width:screenWidth/3*2}}>
          <Text style={{marginLeft:10,color:'white'}}>{rowData}</Text>
        </View>
      </TouchableOpacity>
    )
  },
  renderTimeRow(rowData, sectionID, rowID){
    return (
      <TouchableOpacity
        style={{height:36,backgroundColor:(this.state.pickTimeRow == rowID)?'#2b4f79':'#244266',alignItems: "center",justifyContent: "center",}}
        onPress={()=>this.pressTimeRow(rowID)} activeOpacity={1}
        underlayColor="#f0f0f0">
        <View style={{width:screenWidth}}>
          <Text style={{marginLeft:10,color:'white'}}>{rowData}</Text>
        </View>
      </TouchableOpacity>
    )
  },
  confirmBtn: function () {
  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  changeFilterConditions: function () {

  },
  bizOrderMarketSearchDefaultSearch: function () {
    this.props.exec(
      ()=> {
        return MarketAction.bizOrderMarketSearchDefaultSearch(
        ).then((response)=> {
          var arr = new Array();
          arr = (JSON.stringify(response));
          console.log(arr);
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },

  bizOrderMarketSearchsearch: function () {
    this.props.exec(
      ()=> {
        return MarketAction.bizOrderMarketSearchsearch({
            orderField: 'lastModifyDate',
            orderType: 'desc',
            //filterList: [243, 251],
            pageIndex: 1,

            custFilterList: {
              bizCategory: {
                values: ['MCA'],
                opt: 'Eq',
                filedName: 'bizCategory',
                valueType: 'String'
              },
              bizItem: {
                values: ['MCA_ABS'],
                opt: 'Eq',
                filedName: 'bizItem',
                valueType: 'String'
              }
            }

          }
        ).then((response)=> {
          console.log(JSON.stringify(response));
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },


});

module.exports = WhitePage;
