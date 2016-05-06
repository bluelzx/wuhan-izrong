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
  Animated
  } = React;

let NavBarView = require('../../framework/system/navBarView');
let {height, width} = Dimensions.get('window');
let ViewPager = require('react-native-viewpager');
let MarketList = require('../market/marketList');
let MyBusiness = require('./myBusiness');
let AppStore = require('../../framework/store/appStore');
let {MARKET_CHANGE} = require('../../constants/dictEvent');
let MarketStore = require('../../framework/store/marketStore');
let Market = require('../market/market');

var marketData = {
  contentList: [
    {bizOrientationDesc: '收', term: '365', amount: '10000000', orgName: '上海安硕信息股份有限公司'},
    {bizOrientationDesc: '收', term: '365', amount: '10000000', orgName: '上海安硕信息股份有限公司'},
    {bizOrientationDesc: '收', term: '365', amount: '10000000', orgName: '上海安硕信息股份有限公司'},
    {bizOrientationDesc: '收', term: '365', amount: '10000000', orgName: '上海安硕信息股份有限公司'},
    {bizOrientationDesc: '收', term: '365', amount: '10000000', orgName: '上海安硕信息股份有限公司'}]
};
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
      item: myItem != null ? myItem.displayName : '同业存款'
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, MARKET_CHANGE);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, MARKET_CHANGE);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  toPage: function (name, data) {
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
          <Text style={{color:'#ffffff'}}>敬请期待</Text>
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

  returnItem: function (border, url, text, toPage, data) {
    if (border) {
      return (
        <TouchableHighlight style={styles.borderTableItem} activeOpacity={0.8}
                            underlayColor='#18304b' onPress={()=>this.toPage(toPage,data)}
        >
          <View style={styles.menuItem}>
            <Image style={styles.menuImage} resizeMode='cover' source={url}/>
            <Text style={styles.menuText}>{text}</Text>
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <TouchableHighlight style={{flex: 1, flexDirection: 'column'}} activeOpacity={0.8}
                          underlayColor='#18304b' onPress={()=>this.toPage(toPage,data)}
      >
        <View style={styles.menuItem}>
          <Image style={styles.menuImage} resizeMode='cover' source={url}/>
          <Text style={styles.menuText}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
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
      <NavBarView navigator={this.props.navigator} title='首页' fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' showBack={false} showBar={true}
      >
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          {this.rendViewPager()}
          <View style={{height: width/3*2,flexDirection:"column",backgroundColor: "#162a40",justifyContent: "center"}}>
            <View style={{flex: 1, flexDirection:"row",borderBottomColor:"#000000",borderBottomWidth:1}}>
              {this.returnItem(false, require('../../image/home/assetTransaction.png'), '资产交易', Market, {
                category: this.state.categoryArr[2],
                item: this.state.categoryItem[2].itemArr[0]
              })}
              {this.returnItem(true, require('../../image/home/billTransaction.png'), '票据交易', Market, {
                category: this.state.categoryArr[1],
                item: this.state.categoryItem[1].itemArr[0]
              })}
              {this.returnItem(false, require('../../image/home/capitalBusiness.png'), '资金业务', Market, {
                category: this.state.categoryArr[0],
                item: this.state.categoryItem[0].itemArr[0]
              })}
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              {this.returnItem(false, require('../../image/home/companyBank.png'), '公司投行', Market, {
                category: this.state.categoryArr[4],
                item: this.state.categoryItem[4].itemArr[0]
              })}
              {this.returnItem(true, require('../../image/home/interbankAgent.png'), '同业代理', Market, {
                category: this.state.categoryArr[3],
                item: this.state.categoryItem[3].itemArr[0]
              })}
              {this.returnItem(false, require('../../image/home/myBusiness.png'), '我的业务', MyBusiness, {})}
            </View>
          </View>
          <View style={styles.listHead}>
            <Text
              style={{marginLeft: 20, fontSize: 15, color: '#ffffff'}}>{this.state.category + '--' + this.state.item}</Text>
          </View>
          <MarketList navigator={this.props.navigator} marketData={marketData}/>
        </ScrollView>
        <View style={{height:(Platform.OS == 'ios') ? 49 : 0}}></View>
      </NavBarView>
    );
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
  borderTableItem: {
    flex: 1,
    flexDirection: 'column',
    borderRightColor: '#000000',
    borderLeftColor: '#000000',
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  menuImage: {
    height: 50,
    width: 50
  },
  menuText: {
    color: '#ffffff',
    marginTop: 20,
    fontSize: 15
  },
  menuItem: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  listHead: {
    height: 50,
    backgroundColor: '#18304D',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    justifyContent: 'center'
  }

});


module.exports = Home;
