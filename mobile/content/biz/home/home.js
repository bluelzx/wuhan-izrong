'use strict';

var React = require('react-native');
var {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableHighlight,
  }=React;

var NavBarView = require('../../framework/system/navBarView');
var {height, width} = Dimensions.get('window');
var ViewPager = require('react-native-viewpager');
var MarketList = require('../market/marketList');

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
var Home = React.createClass({
  getInitialState: function () {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2
    });

    return {
      dataSource: dataSource.cloneWithPages(PAGES)
    };
  },

  componentWillMount(){
    //this.toArray();
  },

  componentDidMount() {
    //setInterval(this.set, 20)
  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  _renderPage: function (data:Object) {
    return (
      <Image
        style={styles.page}
        source={{uri:data}}/>
    );
  },

  returnItem: function (border, url, text, toPage) {
    if (border) {
      return (
        <TouchableHighlight style={styles.borderTableItem} activeOpacity={0.8}
                            underlayColor='#18304b' onPress={()=>console.log(toPage)}>
          <View style={styles.menuItem}>
            <Image style={styles.menuImage} resizeMode='cover' source={url}/>
            <Text style={styles.menuText}>{text}</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight style={{flex:1,flexDirection:"column"}} activeOpacity={0.8}
                            underlayColor='#18304b' onPress={()=>console.log(toPage)}>
          <View style={styles.menuItem}>
            <Image style={styles.menuImage} resizeMode='cover' source={url}/>
            <Text style={styles.menuText}>{text}</Text>
          </View>
        </TouchableHighlight>
      );
    }
  },
  rendViewPager: function(){
    return(
      <ViewPager
        style={[this.props.style,styles.viewPager]}
        dataSource={this.state.dataSource}
        renderPage={this._renderPage}
        isLoop={true}
        autoPlay={true}/>
      )
  },

  render() {
    return (
      <NavBarView navigator={this.props.navigator} title='首页' fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' showBack={false} showBar={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          {this.rendViewPager()}
          <View style={{height: width/3*2,flexDirection:"column",backgroundColor: "#162a40",justifyContent: "center"}}>
            <View style={{flex:1,flexDirection:"row",borderBottomColor:"#000000",borderBottomWidth:1}}>
              {this.returnItem(false, require('../../image/home/assetTransaction.png'), '资产交易','assetTransaction')}
              {this.returnItem(true, require('../../image/home/billTransaction.png'), '票据交易','billTransaction')}
              {this.returnItem(false, require('../../image/home/capitalBusiness.png'), '资金业务','capitalBusiness')}
            </View>
            <View style={{flex:1,flexDirection:"row"}}>
              {this.returnItem(false, require('../../image/home/companyBank.png'), '公司投行','companyBank')}
              {this.returnItem(true, require('../../image/home/interbankAgent.png'), '同业代理','interbankAgent')}
              {this.returnItem(false, require('../../image/home/myBusiness.png'), '我的业务','myBusiness')}
            </View>
          </View>
          <View style={styles.listHead}>
                 <Text style={{marginLeft:20,fontSize:16,color:'#ffffff'}}>资金业务--同业存款</Text>
          </View>
          <MarketList navigator={this.props.navigator} marketData={marketData}/>
        </ScrollView>
      </NavBarView>
    );
  }
});

var styles = StyleSheet.create({
  page: {
    width: width,
    height: 200
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  viewPager: {
    height: 200
  },
  borderTableItem: {
    flex: 1,
    flexDirection: "column",
    borderRightColor: "#000000",
    borderLeftColor: "#000000",
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  menuImage: {
    height: 70,
    width: 70
  },
  menuText: {
    color: '#ffffff',
    marginTop: 20,
    fontSize: 16
  },
  menuItem: {
    flexDirection:'column',
    alignItems:'center',
    flex:1,
    justifyContent:'center'
  },
  listHead:{
    height:50,
    backgroundColor:'#18304D',
    borderBottomWidth:0.5,
    borderBottomColor:'#000000',
    justifyContent:'center'
  }

});


module.exports = Home;
