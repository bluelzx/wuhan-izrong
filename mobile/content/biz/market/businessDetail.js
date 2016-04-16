/**
 * Created by cui on 16/4/6.
 */
var React = require('react-native');
var {
  ListView,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ScrollView,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
  } = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var NavBarView = require('../../framework/system/navBarView');

var MarketStore = require('../../framework/store/marketStore');

var BusinessDetail = React.createClass({
  getInitialState(){
    return {
      detailData: ''
    }
  },
  componentWillMount: function () {
    //{
    //  this.getBizOrderInMarket(this.props.param.marketInfo.id)
    //}
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='业务详情' showBack={true} showBar={true}>
        <ScrollView style={{backgroundColor:'#194269'}}>
          <View style={{backgroundColor:'#194269'}}>
            <View style={{marginLeft:10}}>
              {this.returnItem('业务类型:', '资金业务-同业存款')}
              {this.returnItem('方向:', '收')}
              {this.returnItem('期限:', '364天')}
              {this.returnItem('金额:', '2000万')}
              {this.returnItem('利率:', '1200%')}
              {this.returnItem('备注:', '虽百年的写的啊是开发好看阿福送快递方阿福')}
              {this.returnItem('更新时间:', '2016/03/27 20:58')}
            </View>
            {this.renderAdjunct()}
            <View style={{backgroundColor:'#153757',borderRadius:2,margin:10}}>
              {this.renderPromulgator()}
              {this.returnInfoItem(require('../../image/market/tel.png'), '1234567890')}
              {this.returnInfoItem(require('../../image/market/mobile.png'), '1234567890')}
              {this.returnInfoItem(require('../../image/market/QQ.png'), '1234567890')}
              {this.returnInfoItem(require('../../image/market/weChat.png'), '1234567890')}
              {this.returnInfoItem(require('../../image/market/org.png'), '1234567890')}
            </View>
          </View>
        </ScrollView>
      </NavBarView>
    )
  },
  returnItem: function (desc, value) {
    return (
      <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
        <Text style={{fontSize:16,color:'white',flex:1}}>{desc}</Text>
        <Text style={{fontSize:16,color:(desc == '更新时间:')?'#ffd547':'white',width:235/375*screenWidth}}>{value}</Text>
      </View>
    )
  },
  renderAdjunct: function () {
    return (
      <View>
        <Text style={{marginLeft:10,fontSize:16, color:'white',}}>{'附件'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}
          />
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}
          />
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}
          />
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}
          />
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}
          />
        </View>
      </View>
    )
  },
  renderPromulgator: function () {
    return (
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <Image style={{width:40,height:40,margin:10,backgroundColor:'#0a1926',borderRadius:5,alignItems:'center',}}
               source={require('../../image/market/next.png')}
        />

        <Text style={{fontSize:16,color:'white',}}>姚某某</Text>
        <TouchableHighlight onPress={this.gotoIM()}
                            underlayColor='white'>
          <Text style={{fontSize:12,color:'#68bbaa',marginTop:5}}>{'(点击洽谈)'}</Text>
        </TouchableHighlight>
      </View>
    )
  },
  returnInfoItem: function (url, value) {
    return (
      <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
        <Image style={{width:16,height:16}}
               source={url}
        />
        <Text style={{marginLeft:10,fontSize:16,color:'white',width:200}}>{value}</Text>
      </View>
    )
  },
  gotoIM: function () {

  },

  getBizOrderInMarket: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.getBizOrderInMarket(
        ).then((response)=> {
          var detail = (JSON.stringify(response));
          console.log(arr);
          this.setState({
            detailData: detail,
          })
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },

});

var styles = StyleSheet.create({});

module.exports = BusinessDetail;
