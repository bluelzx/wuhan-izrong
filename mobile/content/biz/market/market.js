/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
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

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');
let RadioControl = require('./radioControl');
let FilterSelectBtn = require('./filterSelectBtn');
let MarketList = require('./marketList');
let SelectOrg = require('./selectOrg');
let Icon = require('react-native-vector-icons/Ionicons');

let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let AppStore = require('../../framework/store/appStore');

var marketData = {contentList:[]};

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let WhitePage = React.createClass({

  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let orderItems = AppStore.getFilters().orderItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let item = MarketStore.getCategoryAndItem(filterItems);
    let bizOrientation = MarketStore.getFilterOptions(filterItems, 'bizOrientation').options;
    let term = MarketStore.getFilterOptions(filterItems, 'term').options;
    let amount = MarketStore.getFilterOptions(filterItems, 'amount').options;

    return {
      item: item,
      filterItems: filterItems,
      bizOrientation: bizOrientation,
      term: term,
      amount: amount,
      dataSource: category.options,
      dataSource2: item[0].itemArr,
      dataSource3: orderItems,
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
      //network
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      bizCategoryID: 243,
      bizItemID: 251,
      bizOrientationID: '',
      termID: '',
      amountID: '',
      marketData: marketData,
    }
  },

  componentWillMount: function () {
    {this.bizOrderMarketSearchsearch();}
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
        <MarketList ref="MARKETLIST" navigator={this.props.navigator} exec={this.props.exec}
                    orderField={this.state.orderField} orderType={this.state.orderType}
                    pageIndex={this.state.pageIndex} marketData={this.state.marketData}/>
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
    this.setState({
      pickTypeRow1: rowId,
      pickTypeRow2: 0,
      levelOneText: this.state.dataSource[rowId].displayName,
      dataSource2: this.state.item[rowId].itemArr,
      levelTwoText: this.state.item[rowId].itemArr[0].displayName,
      bizCategoryID: this.state.dataSource[rowId].id
    })
  },
  pressTypeRow2(rowId){
    this.setState({
      clickFilterType: 0,
      pickTypeRow2: rowId,
      levelTwoText: this.state.dataSource2[rowId].displayName,
      bizItemID: this.state.dataSource2[rowId].id
    });
    {
      this.bizOrderMarketSearchsearch();
    }
  },
  pressTimeRow(rowId){
    this.setState({
      clickFilterTime: 0,
      pickTimeRow: rowId,
      optionTwoText: this.state.dataSource3[rowId].fieldDisplayName,
      orderField: this.state.dataSource3[rowId].fieldName,
      orderType: this.state.dataSource3[rowId].asc ? 'asc' : 'desc',
    })
    {
      this.bizOrderMarketSearchsearch();
    }
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
          <View>
            <FilterSelectBtn typeTitle={'方向'} dataList={this.state.bizOrientation} section={3}
                             callBack={this.callBack}/>
            <FilterSelectBtn typeTitle={'期限'} dataList={this.state.term} section={3} callBack={this.callBack}/>
            <FilterSelectBtn typeTitle={'金额'} dataList={this.state.amount} section={2} callBack={this.callBack}/>
          </View>
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
          <Text style={{marginLeft:10,color:'white'}}>{rowData.displayName}</Text>
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
          <Text style={{marginLeft:10,color:'white'}}>{rowData.fieldDisplayName}</Text>
        </View>
      </TouchableOpacity>
    )
  },
  callBack: function (item, title) {
    if (title == '方向') {
      this.setState({
        bizOrientationID: (item.id == 'ALL') ? '' : item.id
      })
    } else if (title == '期限') {
      this.setState({
        termID: (item.id == 'ALL') ? '' : item.id
      })
    } else if (title == '金额') {
      this.setState({
        amountID: (item.id == 'ALL') ? '' : item.id
      })
    } else {

    }
  },
  confirmBtn: function () {
    {
      this.pressFilterOther();
    }
    {
      this.bizOrderMarketSearchsearch();
    }
  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  bizOrderMarketSearchDefaultSearch: function () {
    this.props.exec(
      ()=> {
        return MarketAction.bizOrderMarketSearchDefaultSearch(
        ).then((response)=> {
          let arr = new Array();
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
            orderField: this.state.orderField,
            orderType: this.state.orderType,
            pageIndex: this.state.pageIndex,
            filterList: [
              this.state.bizCategoryID,
              this.state.bizItemID,
              this.state.bizOrientationID,
              this.state.termID,
              this.state.amountID
            ]
          }
        ).then((response)=> {
          this.setState({
            marketData: response
          })
          this.refs["MARKETLIST"]._changeData();
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
