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
  Platform
  } = React;

let NavBarView = require('../../framework/system/navBarView');
let {height, width} = Dimensions.get('window');
let ViewPager = require('react-native-viewpager');
let MarketList = require('../market/marketList');
let myBusiness = require('./myBusiness');
let AppStore = require('../../framework/store/appStore');


var PAGES = [
  'https://images.unsplash.com/photo-1441742917377-57f78ee0e582?h=1024',
  'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?h=1024',
  'https://images.unsplash.com/photo-1441448770220-76743f9e6af6?h=1024',
  'https://images.unsplash.com/photo-1441260038675-7329ab4cc264?h=1024'
];
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
    let dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2
    });

    let myCategory = AppStore.getCategory();
    let myItem = AppStore.getItem();

    return {
      dataSource: dataSource.cloneWithPages(PAGES),
      category: myCategory != null ? myCategory.displayName : '资金业务',
      item: myItem != null ? myItem.displayName : '同业存款'
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name});
    }
  },

  _renderPage: function (data:Object) {
    return (
      <Image
        style={styles.page}
        source={{uri: data}}
      />
    );
  },

  returnItem: function (border, url, text, toPage) {
    if (border) {
      return (
        <TouchableHighlight style={styles.borderTableItem} activeOpacity={0.8}
                            underlayColor='#18304b' onPress={()=>this.toPage(toPage)}
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
                          underlayColor='#18304b' onPress={()=>this.toPage(toPage)}
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
      <ViewPager
        style={this.props.style}
        dataSource={this.state.dataSource}
        renderPage={this._renderPage}
        isLoop={true}
        autoPlay={true}
      />
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
              {this.returnItem(false, require('../../image/home/assetTransaction.png'), '资产交易', myBusiness)}
              {this.returnItem(true, require('../../image/home/billTransaction.png'), '票据交易', myBusiness)}
              {this.returnItem(false, require('../../image/home/capitalBusiness.png'), '资金业务', myBusiness)}
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              {this.returnItem(false, require('../../image/home/companyBank.png'), '公司投行', myBusiness)}
              {this.returnItem(true, require('../../image/home/interbankAgent.png'), '同业代理', myBusiness)}
              {this.returnItem(false, require('../../image/home/myBusiness.png'), '我的业务', myBusiness)}
            </View>
          </View>
          <View style={styles.listHead}>
            <Text style={{marginLeft: 20, fontSize: 15, color: '#ffffff'}}>{this.state.category + '--' + this.state.item}</Text>
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
