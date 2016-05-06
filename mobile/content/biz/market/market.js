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
  ScrollView,
  InteractionManager,
  Platform
  } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');
let FilterSelectBtn = require('./filterSelectBtn');
let SelectOrg = require('../login/selectOrg');
let Icon = require('react-native-vector-icons/Ionicons');
let BusinessDetail = require('./businessDetail');

let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let AppStore = require('../../framework/store/appStore');

let { MARKET_CHANGE } = require('../../constants/dictEvent');
let _ = require('lodash');
let {Alert, GiftedListView} = require('mx-artifacts');
let Adjust = require('../../comp/utils/adjust');
let numeral = require('numeral');

var marketData = {contentList: []};

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let Market = React.createClass({

  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let categoryArr = this.deleteFirstObj(category.options);
    let item = MarketStore.getCategoryAndItem(filterItems);
    item.shift();
    let bizOrientation = MarketStore.getFilterOptions(filterItems, 'bizOrientation').options;
    let term = MarketStore.getFilterOptions(filterItems, 'term').options;
    let amount = MarketStore.getFilterOptions(filterItems, 'amount').options;
    let orderItems = AppStore.getFilters().orderItems;

    let myCategory = AppStore.getCategory();
    let myItem = AppStore.getItem();

    return {
      item: item,
      filterItems: filterItems,
      bizOrientation: bizOrientation,
      term: term,
      amount: amount,
      categorySource: categoryArr,
      itemSource: item.length == 0 ? [] : item[0].itemArr,
      termSource: orderItems,
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: 0,
      levelOneText: myCategory != null ? myCategory.displayName : item.length == 0 ? '' : item[0].displayName,
      levelTwoText: myItem != null ? myItem.displayName : item.length == 0 ? '' : item[0].itemArr[1].displayName,
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
      orgId: 0,
      //network
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      bizCategoryID: myCategory != null ? myCategory.id : item.length == 0 ? 0 : item[0].id,
      bizItemID: myItem != null ? myItem.id : item.length == 0 ? 0 : item[0].itemArr[1].id,
      bizOrientationID: '',
      termID: '',
      amountID: '',
      marketData: marketData
    };
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, MARKET_CHANGE);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, MARKET_CHANGE);
  },

  _onChange () {
    let filterItems = AppStore.getFilters().filterItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let categoryArr = this.deleteFirstObj(category.options);
    let item = MarketStore.getCategoryAndItem(filterItems);
    item.shift();
    let bizOrientation = MarketStore.getFilterOptions(filterItems, 'bizOrientation').options;
    let term = MarketStore.getFilterOptions(filterItems, 'term').options;
    let amount = MarketStore.getFilterOptions(filterItems, 'amount').options;
    let orderItems = AppStore.getFilters().orderItems;
    let myCategory = AppStore.getCategory();
    let myItem = AppStore.getItem();

    this.setState({
      item: item,
      filterItems: filterItems,
      bizOrientation: bizOrientation,
      term: term,
      amount: amount,
      categorySource: categoryArr,
      itemSource: item.length == 0 ? [] : item[0].itemArr,
      termSource: orderItems,
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: 0,
      levelOneText: myCategory != null ? myCategory.displayName : item.length == 0 ? '' : item[0].displayName,
      levelTwoText: myItem != null ? myItem.displayName : item.length == 0 ? '' : item[0].itemArr[1].displayName,
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
      orgId: 0,
      //network
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      bizCategoryID: myCategory != null ? myCategory.id : item.length == 0 ? 221 : item[0].id,
      bizItemID: myItem != null ? myItem.id : item.length == 0 ? 227 : item[0].itemArr[1].id,
      bizOrientationID: '',
      termID: '',
      amountID: '',
      marketData: marketData
    });
  },

  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    let requestBody = {
      orderField: this.state.orderField,
      orderType: this.state.orderType,
      pageIndex: page,
      filterList: [
        this.state.bizCategoryID,
        this.state.bizItemID,
        this.state.bizOrientationID,
        this.state.termID,
        this.state.amountID
      ]
    };
    if (this.state.orgId != 0) {
      _.assign(requestBody,
        {
          custFilterList: {
            orgId: {
              values: [this.state.orgId],
              opt: 'Eq',
              filedName: 'orgId',
              valueType: 'String'
            }
          }
        })
    }
    MarketAction.bizOrderMarketSearch(requestBody
    ).then((response)=> {
      console.log(response);
      if (response.totalPages === page) {
        setTimeout(() => {
          callback(response.contentList, {
            allLoaded: true, // the end of the list is reached
          });
        }, 1000); // simulating network fetching
      } else {
        setTimeout(() => {
          callback(response.contentList, {
            allLoaded: false, // the end of the list is reached
          });
        }, 1000); // simulating network fetching
      }

    }).catch(
      (errorData) => {
        setTimeout(() => {
          callback([], {
            allLoaded: true, // the end of the list is reached
          });
        }, 1000); // simulating network fetching
        Alert(errorData.msgContent || 'exception');
      }
    );
  },
  toDetail: function (name, rowData) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          marketInfo: rowData
        }
      })
    }
  },

  termChangeHelp(term){
    if (term == null || term == 0) {
      return '--';
    } else if (term % 365 == 0) {
      return term / 365 + '年';
    } else if (term % 30 == 0) {
      return term / 30 + '月';
    } else if (term == 1) {
      return '隔夜';
    }
    else {
      return term + '天';
    }
  },

  _renderRow: function (rowData) {
    if (!rowData) {
      return <View></View>;
    }

    return (
      <TouchableHighlight onPress={() => this.toDetail(BusinessDetail,rowData)} underlayColor='#000'>
        <View
          style={{flexDirection:'row',height: 50, backgroundColor: '#1e3754',alignItems:'center',borderBottomWidth:0.7,borderBottomColor:'#0a1926',}}>
          <Image style={{width:25,height:25,marginLeft:15,borderRadius:5}}
                 source={rowData.bizOrientationDesc == '出'?require('../../image/market/issue.png'):require('../../image/market/receive.png')}
          />
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:15, marginTop:15,color:'white',}}>
            {this.termChangeHelp(rowData.term)}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(120),top:0, marginLeft:15,marginTop:15,color:'rgba(175,134,86,1)',}}>
            {rowData.amount == null || rowData.amount == 0 ? '--' : rowData.amount < 100000000 ? (rowData.amount / 10000) + '万' : rowData.amount / 100000000 + '亿'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(220),top:0, marginLeft:15, marginTop:15,color:'white',width:Adjust.width(135)}}
            numberOfLines={1}>
            {rowData.userName != null ? rowData.userName + '-' + rowData.orgName : rowData.orgName}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },

  _emptyView: function () {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

      </View>
    );
  },

  renderMarketList: function () {
    return (
      <View style={{width:screenWidth,flex:1,backgroundColor: '#162a40'}}>
        <View style={{height:26,flexDirection:'row',marginTop:10,marginLeft:5}}>
          <Text style={{position:"absolute",left:0,top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'方向'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'期限'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(120),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'金额'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(220),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'发布人'}
          </Text>
        </View>

        <GiftedListView
          ref="marketGiftedListView"

          rowView={this._renderRow}
          onFetch={this._onFetch}
          firstLoader={true} // display a loader for the first fetching
          pagination={true} // enable infinite scrolling using touch to load more
          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections={false} // enable sections
          emptyView={this._emptyView}

          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          customStyles={{
            paginationView: {
              backgroundColor: 'rgba(0, 0, 0, 0)'
            },
            spinnerColor: 'white'
          }}

          refreshableTintColor="white"
          style={{flex: 1}}
        />

        <View style={{height: (Platform.OS === 'ios') ? 49 : 0}}></View>
      </View>
    );
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
        {this.renderMarketList()}
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
    });
  },
  pressFilterTime(){
    this.setState({
      clickFilterType: 0,
      clickFilterOther: 0,
      clickFilterTime: (this.state.clickFilterTime == 0) ? 1 : 0,
    });
  },
  pressFilterOther(){
    this.setState({
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: (this.state.clickFilterOther == 0) ? 1 : 0,
    });
  },
  pressTypeRow1(rowId){
    this.setState({
      pickTypeRow1: rowId,
      pickTypeRow2: 0,
      levelOneText: this.state.categorySource[rowId].displayName,
      itemSource: this.state.item[rowId].itemArr,
      levelTwoText: this.state.item[rowId].itemArr[0].displayName,
      bizCategoryID: this.state.categorySource[rowId].id
    });
    AppStore.saveCategory(this.state.categorySource[rowId]);
  },
  pressTypeRow2(rowId){
    this.setState({
      clickFilterType: 0,
      pickTypeRow2: rowId,
      levelTwoText: this.state.itemSource[rowId].displayName,
      bizItemID: this.state.itemSource[rowId].id
    });

    this.refs.marketGiftedListView._refresh();
    AppStore.saveItem(this.state.itemSource[rowId]);
  },
  pressTimeRow(rowId){
    this.setState({
      clickFilterTime: 0,
      pickTimeRow: rowId,
      optionTwoText: this.state.termSource[rowId].fieldDisplayName,
      orderField: this.state.termSource[rowId].fieldName,
      orderType: this.state.termSource[rowId].fieldName == 'rate' ? 'asc' : 'desc'
    });

    this.refs.marketGiftedListView._refresh();

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
            enableEmptySections={true}
            renderRow={this.renderTypeRow1}/>
          <ListView
            style={{backgroundColor:'#244266',height:180,position:"absolute",left:screenWidth/3,top:0,opacity:this.state.clickFilterType}}
            dataSource={data.cloneWithRows(this.state.itemSource)}
            enableEmptySections={true}
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
            enableEmptySections={true}
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
      );
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
                  numberOfLines={1}>{this.state.orgValue == '' ? '全部发布机构' : this.state.orgValue}</Text>
                <Image style={{margin:10,width:16,height:16}}
                       source={require('../../image/market/next.png')}
                />
              </View>
            </TouchableOpacity>
            <View>
              <FilterSelectBtn ref="ORIENTATION" typeTitle={'方向'} dataList={this.state.bizOrientation} section={3}
                               callBack={this.callBack} rowDefault={this.state.orientionDefault}
                               isAll={this.state.orientionIsAll}/>
              <FilterSelectBtn ref="TERM" typeTitle={'期限'} dataList={this.state.term} section={3}
                               callBack={this.callBack} rowDefault={this.state.termDefault}
                               isAll={this.state.termIsAll}/>
              <FilterSelectBtn ref="AMOUNT" typeTitle={'金额'} dataList={this.state.amount} section={2}
                               callBack={this.callBack} rowDefault={this.state.amountDefault}
                               isAll={this.state.amountIsAll}/>
            </View>
            <TouchableHighlight onPress={() => this.clearOptions()} underlayColor='rgba(129,127,201,0)'>
              <View style={{alignItems: 'center',justifyContent:'center'}}>
                <View
                  style={{alignItems: 'center',justifyContent:'center',margin:10,borderRadius:5,width:100,height:30,borderColor:'#ed135a',borderWidth:1}}>
                  <Text style={{color:'#ed135a'}}>{'清空'}</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => this.confirmBtn()} underlayColor='rgba(129,127,201,0)'>
              <View
                style={{margin:10,borderRadius:5,justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
                <Text style={{fontWeight: 'bold', color:'white'}}>{'确定'}</Text>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
      );
    }
    this.clearOptions();
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
    );
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
    );
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
    );
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
        callBack: this.callback,
        param: {needAll: true}
      })
    }
  },

  clearOptions: function () {
    this.refs["ORIENTATION"].setDefaultState();
    this.refs["TERM"].setDefaultState();
    this.refs["AMOUNT"].setDefaultState();
    this.setState({
      orgValue: '',
      orgId: 0
    });
  },

  confirmBtn: function () {

    this.pressFilterOther();
    this.refs.marketGiftedListView._refresh();

  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  bizOrderMarketSearch: function () {
    //this.props.exec(
    //  ()=> {
    //    return
    //  }, (Platform.OS === 'ios' ? true : false)
    //);
  },

  deleteFirstObj: function (obj) {
    let arr = [];
    if (!!obj) {
      obj.forEach(function (item) {
        if (item.displayCode != 'ALL') {
          arr.push(item);
        }
      });
    }
    return arr;
  }

});

module.exports = Market;
