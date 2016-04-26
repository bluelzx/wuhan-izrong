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
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView
  } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');
let FilterSelectBtn = require('./filterSelectBtn');
let MarketList = require('./marketList');
let SelectOrg = require('../login/selectOrg');
let Icon = require('react-native-vector-icons/Ionicons');

let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let AppStore = require('../../framework/store/appStore');

var marketData = {contentList: []};

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let Market = React.createClass({

  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let item = MarketStore.getCategoryAndItem(filterItems);
    let bizOrientation = MarketStore.getFilterOptions(filterItems, 'bizOrientation').options;
    let term = MarketStore.getFilterOptions(filterItems, 'term').options;
    let amount = MarketStore.getFilterOptions(filterItems, 'amount').options;
    let orderItems = AppStore.getFilters().orderItems;

    return {
      item: item,
      filterItems: filterItems,
      bizOrientation: bizOrientation,
      term: term,
      amount: amount,
      categorySource: category.options,
      itemSource: item[0].itemArr,
      termSource: orderItems,
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
      orientionDefault: 10000,
      orientionIsAll: true,
      termDefault: 10000,
      termIsAll: true,
      amountDefault: 10000,
      amountIsAll: true,
      orgValue: '',
      orgId: '',
      //network
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      bizCategoryID: item[0].id,
      bizItemID: item[0].itemArr[0].id,
      bizOrientationID: '',
      termID: '',
      amountID: '',
      marketData: marketData
    };
  },

  componentWillMount: function () {
    {
      this.bizOrderMarketSearch();
      AppStore.saveCategoryAndItem({
        category: this.state.bizCategoryID,
        item: this.state.bizItemID
      });
    }
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='市场信息' showBack={false} showBar={true}>
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
    let a = AppStore.getCategoryAndItem();
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
      levelOneText: this.state.categorySource[rowId].displayName,
      itemSource: this.state.item[rowId].itemArr,
      levelTwoText: this.state.item[rowId].itemArr[0].displayName,
      bizCategoryID: this.state.categorySource[rowId].id
    })
  },
  pressTypeRow2(rowId){
    this.setState({
      clickFilterType: 0,
      pickTypeRow2: rowId,
      levelTwoText: this.state.itemSource[rowId].displayName,
      bizItemID: this.state.itemSource[rowId].id
    });
    {
      this.bizOrderMarketSearch();
    }
  },
  pressTimeRow(rowId){
    this.setState({
      clickFilterTime: 0,
      pickTimeRow: rowId,
      optionTwoText: this.state.termSource[rowId].fieldDisplayName,
      orderField: this.state.termSource[rowId].fieldName,
      orderType: this.state.termSource[rowId].asc ? 'asc' : 'desc',
    })
    {
      this.bizOrderMarketSearch();
    }
  },
  renderFilter(pressFilterType, pressFilterTime, pressFilterOther){
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
            dataSource={data.cloneWithRows(this.state.categorySource)}
            renderRow={this.renderTypeRow1}/>
          <ListView
            style={{backgroundColor:'#244266',height:180,position:"absolute",left:screenWidth/3,top:0,opacity:this.state.clickFilterType}}
            dataSource={data.cloneWithRows(this.state.itemSource)}
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
              style={{flex: 1, backgroundColor: 'black',opacity:0.2,height:screenHeight,width:screenWidth}}>
            </View>
          </TouchableOpacity>
          <ListView
            style={{backgroundColor:'#244266',height:108,position:"absolute",left:0,top:0,opacity:this.state.clickFilterTime}}
            dataSource={data.cloneWithRows(this.state.termSource)}
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
          style={{backgroundColor:'#244266',width:screenWidth,height:screenHeight - 149,position:"absolute",left:0,top:36}}>
          <ScrollView>
            <TouchableOpacity onPress={()=>this.toSelectOrg(SelectOrg)} activeOpacity={0.8} underlayColor="#f0f0f0">
              <View
                style={{width: screenWidth-20,margin:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
                <Text
                  style={{fontSize:16,marginLeft:10,width: screenWidth-66,color:'white'}}
                  numberOfLines={1}>{this.state.orgValue == '' ? '选择发布机构' : this.state.orgValue}</Text>
                <Image style={{margin:10,width:16,height:16}}
                       source={require('../../image/market/next.png')}
                />
              </View>
            </TouchableOpacity>
            <View>
              <FilterSelectBtn ref="ORIENTATION" typeTitle={'方向'} dataList={this.state.bizOrientation} section={3}
                               callBack={this.callBack} rowDefault={this.state.orientionDefault} isAll={this.state.orientionIsAll}/>
              <FilterSelectBtn ref="TERM" typeTitle={'期限'} dataList={this.state.term} section={3}
                               callBack={this.callBack} rowDefault={this.state.termDefault} isAll={this.state.termIsAll}/>
              <FilterSelectBtn ref="AMOUNT" typeTitle={'金额'} dataList={this.state.amount} section={2}
                               callBack={this.callBack} rowDefault={this.state.amountDefault} isAll={this.state.amountIsAll}/>
            </View>
            <TouchableHighlight onPress={() => this.clearOptions()} underlayColor='rgba(129,127,201,0)'>
              <View style={{alignItems: 'center',justifyContent:'center'}}>
                <View
                  style={{alignItems: 'center',justifyContent:'center',margin:10,borderRadius:5,width:100,height:30,borderColor:'#ed135a',borderWidth:1}}>
                  <Text style={{color:'#ed135a',}}>{'清空'}</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.confirmBtn()} underlayColor='rgba(129,127,201,0)'>
              <View
                style={{margin:10,borderRadius:5,justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
                <Text style={{fontWeight: 'bold', color:'white',}}>{'确定'}</Text>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
      )
    }
    {this.clearOptions();}
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
  callBack: function (item, title, rowDefault, isAll) {
    if (title == '方向') {
      this.setState({
        bizOrientationID: (item.id == 'ALL') ? '' : item.id,
        orientionDefault: rowDefault,
        orientionIsAll: isAll
      });
    } else if (title == '期限') {
      this.setState({
        termID: (item.id == 'ALL') ? '' : item.id,
        termDefault: rowDefault,
        termIsAll: isAll
      });
    } else if (title == '金额') {
      this.setState({
        amountID: (item.id == 'ALL') ? '' : item.id,
        amountDefault: rowDefault,
        amountIsAll: isAll
      });
    } else {

    }
  },

  callback: function (item) {
    this.setState({
      orgValue: item.orgValue,
      orgId: item.id
    });
  },

  toSelectOrg: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        callBack: this.callback
      })
    }
  },

  clearOptions: function () {
    this.refs["ORIENTATION"].setDefaultState();
    this.refs["TERM"].setDefaultState();
    this.refs["AMOUNT"].setDefaultState();
  },
  confirmBtn: function () {
    {
      this.pressFilterOther();
    }
    {
      this.bizOrderMarketSearch();
    }
  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  bizOrderMarketSearch: function () {
    this.props.exec(
      ()=> {
        return MarketAction.bizOrderMarketSearch({
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
          //custFilterList: {
          //  bizCategory: {
          //    values: [this.state.bizCategoryValues],
          //    opt: (this.state.bizCategoryValues == 'ALL')?'':'Eq',
          //    filedName: 'bizCategory',
          //    valueType: (this.state.bizCategoryValues == 'ALL')?'':'String'
          //  },
          //  bizItem: {
          //    values: [this.state.bizItemValues],
          //    opt: (this.state.bizItemValues == 'ALL')?'':'Eq',
          //    filedName: 'bizItem',
          //    valueType: (this.state.bizItemValues == 'ALL')?'':'String'
          //  },
          //  bizOrientation: {
          //    values: [this.state.bizOrientationValues],
          //    opt: (this.state.bizOrientationValues == 'ALL')?'':'Eq',
          //    filedName: 'bizOrientation',
          //    valueType: (this.state.bizOrientationValues == 'ALL')?'':'String'
          //  },
          //  term: {
          //    values: [this.state.termValues],
          //    opt: (this.state.termValues == 'ALL')?'':'Eq',
          //    filedName: 'term',
          //    valueType: (this.state.termValues == 'ALL')?'':'Double'
          //  },
          //  amount: {
          //    values: [this.state.amountValues],
          //    opt: (this.state.amountValues == 'ALL')?'':'Eq',
          //    filedName: 'amount',
          //    valueType: (this.state.amountValues == 'ALL')?'':'Double'
          //  },
          //  org: {
          //    values: [this.state.orgValues],
          //    opt: (this.state.orgValues == 'ALL')?'':'Eq',
          //    filedName: 'amount',
          //    valueType: (this.state.orgValues == 'ALL')?'':'Double'
          //  }
          //}
          }
        ).then((response)=> {
          console.log(response);
          this.setState({
            marketData: response
          });
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

module.exports = Market;
