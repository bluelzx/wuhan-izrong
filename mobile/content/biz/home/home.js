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

const { Device } = require('mx-artifacts');
let NavBarView = require('../../framework/system/navBarView');
let ViewPager = require('react-native-viewpager');
let BusinessDetail = require('../market/businessDetail');
let MyBusiness = require('./myBusiness');
let AppStore = require('../../framework/store/appStore');
let {MARKET_CHANGE,MYBIZ_CHANGE,HOMEPAGE_CHANGE} = require('../../constants/dictEvent');
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
    let dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2
    });
    let PAGES = AppStore.queryAllHomePageInfo();
    let DEFAULTPAGES = [
      require('../../image/home/launch-01.png'),
      require('../../image/home/launch-02.png'),
      require('../../image/home/launch-03.png')
    ];
    return {
      categoryArr: categoryArr,
      dataSource: PAGES.length ? dataSource.cloneWithPages(PAGES) : dataSource.cloneWithPages(DEFAULTPAGES),
      category: '资金业务',
      contentList: [],
      bizCategoryID: categoryArr.length == 0 ? 0 : categoryArr[0].id
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    //AppStore.addChangeListener(this._onChange, MARKET_CHANGE);
    //AppStore.addChangeListener(this._search, MYBIZ_CHANGE);
    AppStore.addChangeListener(this._onChange, HOMEPAGE_CHANGE);
    this.bizOrderMarketSearch();
  },

  componentWillUnmount: function () {
    //AppStore.removeChangeListener(this._onChange, MARKET_CHANGE);
    //AppStore.removeChangeListener(this._search, MYBIZ_CHANGE);
    AppStore.addChangeListener(this._onChange, HOMEPAGE_CHANGE);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
  },
  _search: function () {
    this.bizOrderMarketSearch();
  },

  bizOrderMarketSearch: function () {
    let requestBody = {
      orderField: 'lastModifyDate',
      orderType: 'desc',
      pageIndex: 1,
      filterList: [
        this.state.bizCategoryID
      ]
    };
    this.props.exec(()=> {
        return MarketAction.bizOrderMarketSearch(requestBody)
          .then((response)=> {
            let contentList = _.slice(response.contentList, 0, 5);
            this.setState({
              contentList: contentList
            });
            AppStore.saveMarketInfo(response.contentList);
          }).catch((errorData) => {
            throw errorData;
          });
        //return MarketAction.getTop15BizOrderListByCategory('MIB')
        //  .then((response)=> {
        //     console.log(response);
        //  })
        //  .catch((errorData)=> {
        //    throw errorData;
        //  })
      }
    );
  },

  renderMenuItem(url, text, toPage){
    return (
      <TouchableHighlight activeOpacity={0.8} underlayColor={PlainStyle.colorSet.homeBorderColor}
                          onPress={()=>this.toPage(toPage)}>
        <View
          style={[styles.menuItem,{width:Device.width/2, flexDirection: 'column',borderLeftColor:'#e6e7ee',borderLeftWidth:0.5}]}>
          <Image style={styles.menuImage} resizeMode='cover' source={url}/>
          <Text style={[DictStyle.fontSize,DictStyle.fontColor,{marginTop:20}]}>{text}</Text>
        </View>
      </TouchableHighlight>
    )
  },


  toPage: function (name, data) {
    const { navigator } = this.props;
    if (navigator) {
      if (name == MyBusiness) {
        navigator.push({comp: name, data: data});
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
    if (data.url) {
      if (data.url.includes('http')) {
        return (
          <Image
            style={styles.page}
            source={{uri:data.url}}
          />
        );
      }
    } else {
      return (
        <Image
          style={styles.page}
          source={data}
        />
      );
    }
  },

  rendViewPager: function () {
    //return (
    //  <View style={styles.page}>
    //    <ViewPager
    //      style={this.props.style}
    //      dataSource={this.state.dataSource}
    //      renderPage={this._renderPage}
    //      isLoop={true}
    //      autoPlay={true}
    //    />
    //  </View>
    //);
    return( <View style={styles.page}>
      <Image
        style={styles.page}
        source={require('../../image/home/launch-01.png')}
      />
    </View>);
  },

  render() {
    return (
      <NavBarView navigator={this.props.navigator} title='首页' showBack={false}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          {this.rendViewPager()}
          <View style={{height: Device.width/3,width:Device.width,flexDirection:"row"}}>
            {this.renderMenuItem(require('../../image/home/myBiz.png'), '我的业务', MyBusiness)}
            {this.renderMenuItem(require('../../image/home/newBiz.png'), '敬请期待', '')}
          </View>
          <View style={styles.listHead}>
            <Text
              style={{marginLeft: 20, fontSize: 15, color: PlainStyle.colorSet.commonTextColor}}>{this.state.category}</Text>
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
      <View style={{width:Device.width,flex:1,backgroundColor: PlainStyle.colorSet.homeListHeaderColor}}>
        <View style={{height:26,flexDirection:'row',marginTop:10,marginLeft:5, borderBottomWidth: 1,
             borderBottomColor: PlainStyle.colorSet.homeBorderColor}}>
          <Text style={{position:"absolute",left:0,top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'方向'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'期限'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(130),top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'金额'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(220),top:0,marginLeft:10, color:PlainStyle.colorSet.homeListTextColor}}>
            {'发布方'}
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
      <TouchableHighlight onPress={() => this.toDetail(BusinessDetail,rowData)} underlayColor='#000'>
        <View
          style={{flexDirection:'row',height: 50, backgroundColor: PlainStyle.colorSet.homeListItemColor,alignItems:'center',
              borderBottomWidth:1,borderBottomColor:PlainStyle.colorSet.homeBorderColor}}>
          <Image style={{width:30,height:30,marginLeft:15,borderRadius:5}}
                 source={rowData.bizOrientationDesc == '出'?require('../../image/market/issue.png'):require('../../image/market/receive.png')}
          />
          <Text
            style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:15, marginTop:15,color:PlainStyle.colorSet.homeListTextColor}}>
            {rowData.term == null || rowData.term == 0 ? '--' : rowData.term + '天'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(130),top:0, marginLeft:15,marginTop:15,color:rowData.amount == null || rowData.amount == 0 ? DictStyle.marketSet.fontColor :DictStyle.marketSet.amountColor}}>
            {rowData.amount == null || rowData.amount == 0 ? '--' : rowData.amount < 100000000 ? (rowData.amount / 10000) + '万' : rowData.amount / 100000000 + '亿'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(220),top:0, marginLeft:15, marginTop:15,color:PlainStyle.colorSet.homeListTextColor,width:Adjust.width(135)}}
            numberOfLines={1}>
            {rowData.userName != null ? rowData.userName + '-' + rowData.orgName : rowData.orgName}
          </Text>
        </View>
      </TouchableHighlight>
    )
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

  //处理viewpager左右滑动和scrollView上下滑动冲突问题
  scrollViewMove: function (e:Event) {
    console.log('move');
    //if(e.nativeEvent.locationY <= 50){
    //  this.refs.scrollView.scrollTo({x:0,y:0,animated:true});
    //}
  }
});

var styles = StyleSheet.create({
  page: {
    width: Device.width,
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
    width: Device.width / 2,
    justifyContent: 'center'
  },
  listHead: {
    height: 50,
    backgroundColor: PlainStyle.colorSet.content,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: PlainStyle.colorSet.homeBorderColor,
    borderTopColor: PlainStyle.colorSet.homeBorderColor,
    justifyContent: 'center'
  }
});

module.exports = Home;
