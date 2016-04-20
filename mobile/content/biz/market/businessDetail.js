/**
 * Created by cui on 16/4/6.
 */
let React = require('react-native');
let {
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

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');

let MarketAction = require('../../framework/action/marketAction');

let BusinessDetail = React.createClass({
  getInitialState(){
    return {
      detailData: '',
      bizOrderOwnerBean:''
    }
  },
  componentWillMount: function () {
    {
      this.getBizOrderInMarket(this.props.param.marketInfo.id);
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='业务详情' showBack={true} showBar={true}>
        <ScrollView style={{backgroundColor:'#194269'}}>
          <View style={{backgroundColor:'#194269'}}>
            <View style={{marginLeft:10}}>
              {this.returnItem('业务类型:', (this.state.detailData.bizCategoryDesc + '-' + this.state.detailData.bizItemDesc))}
              {this.returnItem('方向:', this.state.detailData.bizOrientationDesc)}
              {this.returnItem('期限:', this.state.detailData.term + '天')}
              {this.returnItem('金额:', this.state.detailData.amount / 10000 + '万')}
              {this.returnItem('利率:', this.state.detailData.rate * 100 + '%')}
              {this.returnItem('备注:', this.state.detailData.remark)}
              {this.returnItem('更新时间:', this.state.detailData.lastModifyDate)}
            </View>
            {this.renderAdjunct()}
            <View style={{backgroundColor:'#153757',borderRadius:2,margin:10}}>
              {this.renderPromulgator()}
              {this.returnInfoItem(require('../../image/market/tel.png'), this.state.bizOrderOwnerBean.phoneNumber,this.state.bizOrderOwnerBean.isPublicPhone)}
              {this.returnInfoItem(require('../../image/market/mobile.png'), this.state.bizOrderOwnerBean.mobileNumber,this.state.bizOrderOwnerBean.isPublicMobile)}
              {this.returnInfoItem(require('../../image/market/QQ.png'), this.state.bizOrderOwnerBean.qqNo,this.state.bizOrderOwnerBean.isPublicQQNo)}
              {this.returnInfoItem(require('../../image/market/weChat.png'), this.state.bizOrderOwnerBean.weChatNo,this.state.bizOrderOwnerBean.isPublicWeChatNo)}
              {this.returnInfoItem(require('../../image/market/org.png'), this.state.bizOrderOwnerBean.orgName)}
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

        <Text style={{fontSize:16,color:'white',}}>{this.state.bizOrderOwnerBean.userName}</Text>
        <TouchableHighlight onPress={this.gotoIM()}
                            underlayColor='white'>
          <Text style={{fontSize:12,color:'#68bbaa',marginTop:5}}>{'(点击洽谈)'}</Text>
        </TouchableHighlight>
      </View>
    )
  },
  returnInfoItem: function (url, value, isPublic) {
    if (isPublic) {
      return (
        <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
          <Image style={{width:16,height:16}}
                 source={url}
          />
          <Text style={{marginLeft:10,fontSize:16,color:'white',width:screenWidth - 60}}>{value}</Text>
        </View>
      )
    } else {
      return (
        <View></View>
      )
    }
  },
  gotoIM: function () {

  },

  getBizOrderInMarket: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.getBizOrderInMarket({
            orderId: id
          }
        ).then((response)=> {
          let detail = (JSON.stringify(response));
          console.log(detail);
          this.setState({
            detailData: response,
            bizOrderOwnerBean:response.bizOrderOwnerBean
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

let styles = StyleSheet.create({});

module.exports = BusinessDetail;
