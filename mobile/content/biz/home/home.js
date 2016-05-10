'use strict';

let React = require('react-native');
let {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  Platform,
  Animated,
  ListView
  } = React;

let NavBarView = require('../../framework/system/navBarView');
let {height, width} = Dimensions.get('window');
let ViewPager = require('react-native-viewpager');
let MyBusiness = require('./myBusiness');
let AppStore = require('../../framework/store/appStore');
let {MARKET_CHANGE} = require('../../constants/dictEvent');
let MarketStore = require('../../framework/store/marketStore');
let MarketAction = require('../../framework/action/marketAction');
let Adjust = require('../../comp/utils/adjust');
let _ = require('lodash');
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let Home = React.createClass({
  getStateFromStores: function () {
    let filterItems = AppStore.getFilters().filterItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let categoryArr = this.deleteFirstObj(category.options);
    let item = MarketStore.getCategoryAndItem(filterItems);
    item.shift();
    let dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2
    });
    let myCategory = AppStore.getCategory();
    let myItem = AppStore.getItem();
    let PAGES = AppStore.queryAllHomePageInfo();
    if (PAGES.length == 0) {
      PAGES = [
        '敬请期待',
        '敬请期待',
        '敬请期待'
      ];
    }
    return {
      categoryArr: categoryArr,
      categoryItem: item,
      dataSource: dataSource.cloneWithPages(PAGES),
      category: myCategory != null ? myCategory.displayName : '资金业务',
      item: myItem != null ? myItem.displayName : '同业存款',
      contentList: [],
      bizCategoryID: myCategory != null ? myCategory.id : item.length == 0 ? 0 : item[0].id,
      bizItemID: myItem != null ? myItem.id : item.length == 0 ? 0 : item[0].itemArr[1].id,
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, MARKET_CHANGE);
    this.bizOrderMarketSearch();
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, MARKET_CHANGE);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  bizOrderMarketSearch: function () {
    let requestBody = {
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      filterList: [
        this.state.bizCategoryID,
        this.state.bizItemID
      ]
    };
    this.props.exec(
      ()=> {
        return MarketAction.bizOrderMarketSearch(requestBody
        ).then((response)=> {
          console.log(response);
          let contentList = _.slice(response.contentList, 0, 5);
          this.setState({
            contentList: contentList
          });
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },


  toPage: function (name, data) {
    AppStore.saveCategory(data.category);
    AppStore.saveItem(data.item);
    const { navigator } = this.props;
    if (navigator) {
      if (name == MyBusiness) {
        navigator.push({comp: name, data: data});
      } else {
        navigator.resetTo({comp: 'tabView', tabName: 'market', param: data});
      }
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
  },


  _renderPage: function (data:Object) {
    if (data == '敬请期待') {
      return (
        <View style={[styles.page,{flex:1,alignItems:'center',justifyContent:'center'}]}>
          <Text style={[DictStyle.fontSize,DictStyle.fontColor]}>敬请期待</Text>
        </View>
      )
    } else {
      return (
        <Image
          style={styles.page}
          source={{uri: data}}
        />
      );
    }
  },

  rendViewPager: function () {
    return (
      <View style={styles.page}>
        <ViewPager
          style={this.props.style}
          dataSource={this.state.dataSource}
          renderPage={this._renderPage}
          isLoop={true}
          autoPlay={true}
          animation={(animatedValue, toValue, gestureState) => {
            var duration = 1000;
            return Animated.timing(animatedValue,
            {
              toValue: toValue,
              duration: duration
            });
          }
        }/>
      </View>
    );
  },

  render() {
    return (
      <NavBarView navigator={this.props.navigator} title='首页' showBack={false}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          {this.rendViewPager()}
          <View style={{backgroundColor:PlainStyle.colorSet.homeMenuColor,height: width/3,flexDirection:"row"}}>
            <TouchableHighlight style={{flex: 1, flexDirection: 'column',borderRightColor:'#e6e7ee',borderRightWidth:0.5}} activeOpacity={0.8}
                                underlayColor='#18304b' onPress={()=>this.toPage(MyBusiness,{})}
            >
              <View style={styles.menuItem}>
                <Image style={styles.menuImage} resizeMode='cover' source={require('../../image/home/myBusiness.png')}/>
                <Text style={[DictStyle.fontSize,DictStyle.fontColor,{marginTop:20}]}>我的业务</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{flex: 1, flexDirection: 'column',borderLeftColor:'#e6e7ee',borderLeftWidth:0.5}} activeOpacity={0.8}
                                underlayColor='#18304b' onPress={()=>this.toPage(MyBusiness,{})}
            >
              <View style={styles.menuItem}>
                <Image style={styles.menuImage} resizeMode='cover' source={require('../../image/home/myBusiness.png')}/>
                <Text style={[DictStyle.fontSize,DictStyle.fontColor,{marginTop:20}]}>我的业务</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.listHead}>
            <Text
              style={{marginLeft: 20, fontSize: 15, color: PlainStyle.colorSet.commonTextColor}}>{this.state.category + '--' + this.state.item}</Text>
          </View>
          {this.renderMarketList()}
        </ScrollView>
        <View style={{height:(Platform.OS == 'ios') ? 49 : 0}}>
        </View>
      </NavBarView>
    );
  },
  renderMarketList() {
    return (
      <View style={{width:width,flex:1,backgroundColor: PlainStyle.colorSet.homeListHeaderColor}}>
        <View style={{height:26,flexDirection:'row',marginTop:10,marginLeft:5}}>
          <Text style={{position:"absolute",left:0,top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'方向'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'期限'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(130),top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'金额'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(220),top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'发布人'}
          </Text>
        </View>
        <ListView
          dataSource={data.cloneWithRows(this.state.contentList)}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
      </View>
    );
  },
  _renderRow: function (rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this._pressRow()} underlayColor='#000'>
        <View
          style={{flexDirection:'row',height: 50, backgroundColor: PlainStyle.colorSet.homeListItemColor,alignItems:'center',borderBottomWidth:0.7,borderBottomColor:'#0a1926'}}>
          <Image style={{width:25,height:25,marginLeft:15,borderRadius:5}}
                 source={rowData.bizOrientationDesc == '出'?require('../../image/market/issue.png'):require('../../image/market/receive.png')}
          />
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:15, marginTop:15,color:PlainStyle.colorSet.homeListTextColor}}>
            {rowData.term == null || rowData.term == 0 ? '--' : rowData.term + '天'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(130),top:0, marginLeft:15,marginTop:15,color:PlainStyle.colorSet.homeListTextColor}}>
            {rowData.amount == null || rowData.amount == 0 ? '--' : rowData.amount / 10000 + '万'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(220),top:0, marginLeft:15, marginTop:15,color:PlainStyle.colorSet.homeListTextColor,width:Adjust.width(135)}}
            numberOfLines={1}>
            {rowData.orgName}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },
  _pressRow: function () {
  }
});

var styles = StyleSheet.create({
  page: {
    width: width,
    height: 180
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },

  menuImage: {
    height: 50,
    width: 50
  },
  menuItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  listHead: {
    height: 50,
    backgroundColor: PlainStyle.colorSet.content,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    justifyContent: 'center'
  }
});

module.exports = Home;
