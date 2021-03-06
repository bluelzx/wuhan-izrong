/**
 * Created by cui on 16/4/21.
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
  }=React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');
let FilterSelectBtn = require('../market/filterSelectBtn');
let Icon = require('react-native-vector-icons/Ionicons');
let MyBizDetail = require('./myBizDetail');
let numeral = require('numeral');

let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let AppStore = require('../../framework/store/appStore');

let {Alert, GiftedListView, Button} = require('mx-artifacts');
let {MYBIZ_CHANGE, FINISH_LOADING} = require('../../constants/dictEvent');
let Adjust = require('../../comp/utils/adjust');
let DictStyle = require('../../constants/dictStyle');

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let Market = React.createClass({

  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let orderItems = AppStore.getFilters().orderItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let categoryArr = this.deleteFirstObj(category.options);
    let bizOrientation = MarketStore.getFilterOptions(filterItems, 'bizOrientation').options;
    let term = MarketStore.getFilterOptions(filterItems, 'term').options;
    let amount = MarketStore.getFilterOptions(filterItems, 'amount').options;

    let filterType = AppStore.getCategory();

    return {
      filterItems: filterItems,
      bizOrientation: bizOrientation,
      term: term,
      amount: amount,
      categorySource: categoryArr,
      termSource: orderItems,
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: 0,
      levelOneText: filterType != null ? filterType.category.displayName : categoryArr.length == 0 ? '' : categoryArr[0].displayName,
      optionTwoText: '最新发布',
      pickTypeRow: filterType != null ? filterType.rowId : 0,
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
      isOtherNull: true,
      //network
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      bizCategoryID: filterType != null ? filterType.category.id : categoryArr.length == 0 ? [] : categoryArr[0].id,
      bizOrientationID: '',
      termID: '',
      amountID: '',
      marketData: [],
      listReminder: '未找到符合条件的业务记录'
    }
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, MYBIZ_CHANGE);
    AppStore.addChangeListener(this._finishLoading, FINISH_LOADING);
  },

  componentWillUnmount () {
    AppStore.removeChangeListener(this._onChange, MYBIZ_CHANGE);
    AppStore.removeChangeListener(this._finishLoading, FINISH_LOADING);
  },

  _onChange () {
    this.refs.marketGiftedListView._refreshWithoutSpinner();
  },

  _finishLoading () {
    this.setState({
      listReminder: '请检查网络连接'
    });
  },

  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page, callback, options) {
    return MarketAction.bizOrderAdminSearch({
        orderFieldList: [
          {
            orderField: 'status',
            orderType: 'asc'
          }, {
            orderField: this.state.orderField,
            orderType: this.state.orderType
          }
        ],
        pageIndex: page,
        filterList: [
          this.state.bizCategoryID,
          this.state.bizOrientationID,
          this.state.termID,
          this.state.amountID
        ]
      }
    ).then((response)=> {
      console.log(response);
      if (response.totalPages === page) {
        setTimeout(() => {
          callback(response.contentList, {
            allLoaded: true // the end of the list is reached
          });
        }, 800); // simulating network fetching
      } else {
        setTimeout(() => {
          callback(response.contentList, {
            allLoaded: false // the end of the list is reached
          });
        }, 800); // simulating network fetching
      }
    }).catch(
      (errorData) => {
        setTimeout(() => {
          callback([], {
            allLoaded: true, // the end of the list is reached
          });
        }, 1000); // simulating network fetching
        if (errorData.msgCode == 'APP_SYS_TOKEN_INVALID') {
          AppStore.forceLogout();
        } else if (errorData.message.includes('Network request failed')) {
          Alert('网络异常');
        } else {
          Alert(errorData.msgContent || errorData.message);
        }
      }
    );
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
      <TouchableHighlight onPress={() => this.toDetail(MyBizDetail,rowData)} underlayColor='#000'>
        <View
          style={{flexDirection:'row',height: 50, backgroundColor: 'white',alignItems:'center',borderBottomWidth:0.5,borderBottomColor:'#edeef4'}}>
          <Image style={{width:30,height:30,marginLeft:15,borderRadius:5}}
                 source={rowData.bizOrientationDesc == '出'?require('../../image/market/issue.png'):require('../../image/market/receive.png')}
          />
          <Text
            style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:15, marginTop:15,color:rowData.status == 'ACTIVE'?DictStyle.marketSet.fontColor:'#c0c8ce'}}>
            {this.termChangeHelp(rowData.term)}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(120),top:0, marginLeft:15,marginTop:15,color:rowData.status == 'ACTIVE'? rowData.amount == null || rowData.amount == 0 ? DictStyle.marketSet.fontColor :DictStyle.marketSet.amountColor:'#c0c8ce'}}>
            {rowData.amount == null || rowData.amount == 0 ? '--' : rowData.amount < 100000000 ? numeral(rowData.amount / 10000) + '万' : numeral(rowData.amount / 100000000) + '亿'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(200),top:0, marginLeft:15, marginTop:15,color:rowData.status == 'ACTIVE'?DictStyle.marketSet.fontColor:'#c0c8ce'}}
            numberOfLines={1}>
            {rowData.rate == null || rowData.rate == 0 ? '--' : numeral(rowData.rate * 100).format('0,0.00') + '%'}
          </Text>
          {this.renderFreshBtn(rowData)}
        </View>
      </TouchableHighlight>
    )
  },
  renderFreshBtn: function (rowData) {
    if (rowData.status == 'ACTIVE') {
      return (
        <View>
          <Button
            containerStyle={{flexDirection:'row',justifyContent:'center',alignItems:'center',borderRadius:5,position:"absolute",left:Adjust.width(240),top:0,marginTop:-15,backgroundColor: '#6ebfe5',height:30,width:Adjust.width(75)}}
            style={{fontSize: 15, color: 'white'}}
            disabled={this.state.disabled}
            onPress={() => this.freshBiz(rowData)}
          >
            刷新
          </Button>
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
  },

  freshBiz: function (rowData) {
    this.refreshBizOrder(rowData);
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

  refreshBizOrder: function (rowData) {
    this.props.exec(
      ()=> {
        return MarketAction.refreshBizOrder({
            orderId: rowData.id
          }
        ).then((response)=> {
          Alert('刷新成功', ()=>this.refs.marketGiftedListView._refreshWithoutSpinner());
          AppStore.emitChange(MYBIZ_CHANGE);
        }).catch((errorData) => {
          throw errorData;
        });
      }
    );
  },


  renderMarketList: function () {
    return (
      <View style={{width:screenWidth,flex:1,backgroundColor: '#f7f7f7'}}>
        <View style={{height:26,flexDirection:'row',marginTop:10,marginLeft:5}}>
          <Text style={{position:"absolute",left:0,top:0,marginLeft:10, color:DictStyle.marketSet.fontColor}}>
            {'方向'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:10, color:DictStyle.marketSet.fontColor}}>
            {'期限'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(120),top:0,marginLeft:10, color:DictStyle.marketSet.fontColor}}>
            {'金额'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(200),top:0,marginLeft:10, color:DictStyle.marketSet.fontColor}}>
            {'利率'}
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
              backgroundColor: 'rgba(0, 0, 0, 0)',
            },
            spinnerColor: DictStyle.marketSet.filterSelectColor
          }}

          refreshableTintColor={DictStyle.marketSet.filterSelectColor}
          style={{flex: 1}}
        />
      </View>
    );
  },

  _emptyView: function () {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:50}}>
        <Text style={{fontSize:15, color:'#cad2d1'}}>{this.state.listReminder}</Text>
      </View>
    );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='我的业务'>
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
    if (this.state.isOtherNull) {
      this.setState({
        orientionDefault: 10000,
        orientionIsAll: true,
        termDefault: 10000,
        termIsAll: true,
        amountDefault: 10000,
        amountIsAll: true
      });
    }
  },
  pressFilterTime(){
    this.setState({
      clickFilterType: 0,
      clickFilterOther: 0,
      clickFilterTime: (this.state.clickFilterTime == 0) ? 1 : 0,
    });
    if (this.state.isOtherNull) {
      this.setState({
        orientionDefault: 10000,
        orientionIsAll: true,
        termDefault: 10000,
        termIsAll: true,
        amountDefault: 10000,
        amountIsAll: true
      });
    }
  },
  pressFilterOther(){
    this.setState({
      clickFilterType: 0,
      clickFilterTime: 0,
      clickFilterOther: (this.state.clickFilterOther == 0) ? 1 : 0,
    });
    if (this.state.isOtherNull) {
      this.setState({
        orientionDefault: 10000,
        orientionIsAll: true,
        termDefault: 10000,
        termIsAll: true,
        amountDefault: 10000,
        amountIsAll: true
      });
    }
  },
  pressTypeRow(rowId){
    this.setState({
      clickFilterType: 0,
      pickTypeRow: rowId,
      levelOneText: this.state.categorySource[rowId].displayName,
      bizCategoryID: this.state.categorySource[rowId].id
    });
    let filterType = {
      category: this.state.categorySource[rowId],
      rowId: rowId
    };
    this.refs.marketGiftedListView._refresh();
    AppStore.saveCategory(filterType);
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
            style={{width: screenWidth / 3,height:DictStyle.heightSet.filter,backgroundColor:'white',alignItems: 'center',justifyContent: 'center',flexDirection: 'row',borderRightColor:DictStyle.marketSet.filterBorder,borderRightWidth:1,borderBottomWidth:0.5,borderBottomColor:DictStyle.marketSet.filterBorder}}>
            <Text
              style={{width:screenWidth/3 - 30,textAlign:'center',fontSize:DictStyle.marketSet.filterFontSize,color:(this.state.clickFilterType == 1)?DictStyle.marketSet.filterSelectColor:DictStyle.marketSet.fontColor}}
              numberOfLines={1}>{this.state.levelOneText}</Text>
            <Icon name={(this.state.clickFilterType == 1)?'chevron-up':'chevron-down'} size={15}
                  color={(this.state.clickFilterType == 1)?DictStyle.marketSet.filterSelectColor:DictStyle.marketSet.fontColor}/>

          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressFilterTime} activeOpacity={1}
                          underlayColor="#f0f0f0">
          <View
            style={{width: screenWidth / 3,height:DictStyle.heightSet.filter,backgroundColor:'white',alignItems: 'center',justifyContent: 'center',flexDirection: 'row',borderRightColor:DictStyle.marketSet.filterBorder,borderRightWidth:0.5,borderBottomWidth:0.5,borderBottomColor:DictStyle.marketSet.filterBorder}}>
            <Text
              style={{width:screenWidth/3 - 30,textAlign:'center',fontSize:DictStyle.marketSet.filterFontSize,color:(this.state.clickFilterTime == 1)?DictStyle.marketSet.filterSelectColor:DictStyle.marketSet.fontColor}}
              numberOfLines={1}>{this.state.optionTwoText}</Text>
            <Icon name={(this.state.clickFilterTime == 1)?'chevron-up':'chevron-down'} size={15}
                  color={(this.state.clickFilterTime == 1)?DictStyle.marketSet.filterSelectColor:DictStyle.marketSet.fontColor}/>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={pressFilterOther} activeOpacity={1}
                          underlayColor="#f0f0f0">
          <View
            style={{width: screenWidth / 3,height:DictStyle.heightSet.filter,backgroundColor:'white',alignItems: 'center',justifyContent: 'center',flexDirection: 'row',borderBottomWidth:0.5,borderBottomColor:DictStyle.marketSet.filterBorder}}>
            <Text
              style={{width:screenWidth/3 - 30,textAlign:'center',fontSize:DictStyle.marketSet.filterFontSize,color:(!this.state.isOtherNull)?DictStyle.marketSet.filterSelectColor:DictStyle.marketSet.fontColor}}
              numberOfLines={1}>{'筛选'}</Text>
            <Icon name={(this.state.clickFilterOther == 1)?'chevron-up':'chevron-down'} size={15}
                  color={(!this.state.isOtherNull)?DictStyle.marketSet.filterSelectColor:DictStyle.marketSet.fontColor}/>
          </View>
        </TouchableOpacity>

      </View>
    )
  },

  renderOptionType(){
    if (this.state.clickFilterType == 0) {
      return <View>
      </View>;
    }
    else {
      return (
        <View style={{position:"absolute",left:0,top:DictStyle.heightSet.filter}}>
          <TouchableOpacity onPress={()=>this.pressFilterType()} activeOpacity={0.8} underlayColor="#f0f0f0">
            <View
              style={{flex: 1, backgroundColor: 'black',opacity:0.2,height:screenHeight,width:screenWidth}}>
            </View>
          </TouchableOpacity>
          <ListView
            style={{backgroundColor:'white',height:DictStyle.heightSet.filter*5,position:"absolute",left:0,top:0,opacity:this.state.clickFilterType}}
            dataSource={data.cloneWithRows(this.state.categorySource)}
            enableEmptySections={true}
            renderRow={this.renderTypeRow}/>
        </View>
      );
    }
  },
  renderOptionTime(){
    if (this.state.clickFilterTime == 0) {
      return <View>
      </View>;
    } else {
      return (
        <View style={{position:"absolute",left:0,top:DictStyle.heightSet.filter}}>
          <TouchableOpacity onPress={()=>this.pressFilterTime()} activeOpacity={0.8} underlayColor="#f0f0f0">
            <View
              style={{flex: 1, backgroundColor: 'black',opacity:0.2,height:screenHeight,width:screenWidth}}>
            </View>
          </TouchableOpacity>
          <ListView
            style={{backgroundColor:'#244266',height:DictStyle.heightSet.filter*3,position:"absolute",left:0,top:0,opacity:this.state.clickFilterTime}}
            dataSource={data.cloneWithRows(this.state.termSource)}
            enableEmptySections={true}
            renderRow={this.renderTimeRow}
          />
        </View>
      );
    }

  },
  renderOptionOther(){
    if (this.state.clickFilterOther == 0) {
      return <View>

      </View>;
    } else {
      return (
        <View
          style={{backgroundColor:'white',width:screenWidth,height:screenHeight - 100,position:"absolute",left:0,top:DictStyle.heightSet.filter}}>
          <ScrollView>
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
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <TouchableHighlight onPress={() => this.clearOptions()} underlayColor='rgba(129,127,201,0)'>
                <View style={{alignItems: 'center',justifyContent:'center'}}>
                  <View
                    style={{alignItems: 'center',justifyContent:'center',marginLeft:10,marginRight:10,marginTop:10,borderRadius:5,width:(screenWidth-30)/2,height:36,borderColor:'#ed5867',borderWidth:1}}>
                    <Text style={{color:'#ed5867'}}>{'清空'}</Text>
                  </View>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.confirmBtn()} underlayColor='rgba(129,127,201,0)'>
                <View
                  style={{alignItems: 'center',justifyContent:'center',marginRight:10,marginTop:10,borderRadius:5,width:(screenWidth-30)/2,height:36, backgroundColor: '#4b76df'}}>
                  <Text style={{fontWeight: 'bold', color:'white'}}>{'确定'}</Text>
                </View>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </View>
      );
    }

  },
  renderTypeRow(rowData, sectionID, rowID){
    return (
      <TouchableOpacity
        style={{height:DictStyle.heightSet.filter,backgroundColor:(this.state.pickTypeRow == rowID)?'#f4fdfc':'white',alignItems: "center",justifyContent: "center",borderBottomWidth:0.5,borderBottomColor:'#edeef4'}}
        onPress={()=>this.pressTypeRow(rowID)} activeOpacity={1}
        underlayColor="#f0f0f0">
        <View style={{width:screenWidth}}>
          <Text style={{marginLeft:10,color:DictStyle.marketSet.fontColor}}>{rowData.displayName}</Text>
        </View>
      </TouchableOpacity>
    );
  },
  renderTimeRow(rowData, sectionID, rowID){
    return (
      <TouchableOpacity
        style={{height:DictStyle.heightSet.filter,backgroundColor:(this.state.pickTimeRow == rowID)?'#f4fdfc':'white',alignItems: "center",justifyContent: "center",borderBottomWidth:0.5,borderBottomColor:'#edeef4'}}
        onPress={()=>this.pressTimeRow(rowID)} activeOpacity={1}
        underlayColor="#f0f0f0">
        <View style={{width:screenWidth}}>
          <Text style={{marginLeft:10,color:DictStyle.marketSet.fontColor}}>{rowData.fieldDisplayName}</Text>
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

  setIsOtherNull: function () {
    this.setState({
      isOtherNull: true
    });
  },

  setIsOtherNotNull: function () {
    if (this.state.orientionIsAll && this.state.termIsAll && this.state.amountIsAll) {

    } else {
      this.setState({
        isOtherNull: false
      });
    }
  },

  clearOptions: function () {
    this.refs["ORIENTATION"].setDefaultState();
    this.refs["TERM"].setDefaultState();
    this.refs["AMOUNT"].setDefaultState();
    this.setIsOtherNull();
  },

  _pressPublish: function () {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: 'publish',
        param: {
          isFromMyBusiness: true
        }
      })
    }
  },

  confirmBtn: function () {
    this.setIsOtherNotNull();
    this.pressFilterOther();
    this.refs.marketGiftedListView._refresh();
  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
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
