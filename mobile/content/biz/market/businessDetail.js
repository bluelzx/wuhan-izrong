/**
 * Created by cui on 16/4/6.
 */
let React = require('react-native');
let {
  TouchableHighlight,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  InteractionManager
  } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');
let imagePicker = require('../../comp/utils/imagePicker');
let DateHelper = require('../../comp/utils/dateHelper');
let numeral = require('numeral');
let NameCircular = require('../im/nameCircular').NameCircular;

let AppStore = require('../../framework/store/appStore');
let MarketStore = require('../../framework/store/marketStore');
let { Alert } = require('mx-artifacts');
let { SESSION_TYPE } = require('../../constants/dictIm');
let Chat = require('../im/chat');

let MarketAction = require('../../framework/action/marketAction');
let { MARKET_CHANGE } = require('../../constants/dictEvent');

let BusinessDetail = React.createClass({
  getInitialState(){
    let marketInfo = this.props.param.marketInfo;
    let userId = AppStore.getUserId();
    let userInfo = MarketStore.getUserInfoByUserId(marketInfo.userId);

    return {
      userId: userId,
      detailData: '',
      bizOrderOwnerBean: '',
      fileUrlList: [],
      marketInfo: marketInfo,
      orderUserId: marketInfo.userId,
      lastModifyDate: '',
      userInfo: userInfo
    }
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getBizOrderInMarket(this.state.marketInfo.id);
    });
  },

  componentWillUnmount: function () {
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

  _renderContent: function () {
    if (!this.state.detailData) {
      return (
        <View></View>
      );
    }

    return (
      <ScrollView style={{backgroundColor:'#194269'}}>
        <View style={{backgroundColor:'#194269'}}>
          <View style={{marginLeft:10}}>
            {this.returnItem('业务类型:', (this.state.detailData.bizCategoryDesc + '-' + this.state.detailData.bizItemDesc))}
            {this.returnItem('方向:', this.state.detailData.bizOrientationDesc)}
            {this.returnItem('期限:', this.termChangeHelp(this.state.detailData.term))}
            {this.returnItem('金额:', this.state.detailData.amount == null || this.state.detailData.amount == 0 ? '--'
              : this.state.detailData.amount < 100000000 ? (this.state.detailData.amount / 10000) + '万' : (this.state.detailData.amount / 100000000) + '亿')}
            {this.returnItem('利率:', this.state.detailData.rate == null || this.state.detailData.rate == 0 ? '--' : numeral(this.state.detailData.rate * 100).format('0,0.00') + '%')}
            {this.returnItem('备注:', this.state.detailData.remark == null || this.state.detailData.remark == 0 ? '--' : this.state.detailData.remark)}
            {this.returnItem('更新时间:', this.state.lastModifyDate)}
          </View>
          {this.renderAdjunct()}
          {this.renderUserInfo(this.state.userInfo)}
        </View>
      </ScrollView>
    );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='业务详情'>
        {this._renderContent()}
      </NavBarView>
    );
  },

  returnItem: function (desc, value) {
    return (
      <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
        <Text style={{fontSize:16,color:'white',flex:1}}>{desc}</Text>
        <Text style={{fontSize:16,color:(desc == '更新时间:')?'#ffd547':'white',width:235/375*screenWidth}}>{value}</Text>
      </View>
    );
  },
  renderAdjunct: function () {
    return (
      <View>
        {this.renderImageTitle()}
        {this.renderImageItem()}
      </View>
    );
  },
  renderUserInfo: function (userInfo) {
    if (userInfo == null) {
      return (
        <View></View>
      );
    }
    return (
      <View style={{backgroundColor:'#153757',borderRadius:2,margin:10}}>
        {this.renderPromulgator(userInfo)}
        {this.returnInfoItem(require('../../image/market/tel.png'), userInfo.phoneNumber == null ? '未填写' : userInfo.phoneNumber, userInfo.publicPhone)}
        {this.returnInfoItem(require('../../image/market/mobile.png'), userInfo.mobileNumber == null ? '未填写' : userInfo.mobileNumber, userInfo.publicMobile)}
        {this.returnInfoItem(require('../../image/market/QQ.png'), userInfo.qqNo == null ? '未填写' : userInfo.qqNo, userInfo.publicQQ)}
        {this.returnInfoItem(require('../../image/market/weChat.png'), userInfo.weChatNo == null ? '未填写' : userInfo.weChatNo, userInfo.publicWeChat)}
        {this.returnInfoItem(require('../../image/market/org.png'), this.state.marketInfo.orgName, true)}
      </View>
    );
  },
  renderPromulgator: function () {
    if (this.state.userId == this.state.orderUserId) {
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {this.renderUserPhoto(this.state.userInfo)}
          <Text style={{fontSize:16,color:'white'}}>{this.state.marketInfo.userName}</Text>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {this.renderUserPhoto(this.state.userInfo)}
          <Text style={{fontSize:16,color:'white'}}
                numberOfLines={1}>{this.state.marketInfo.userName}</Text>
          <TouchableHighlight onPress={()=>this.gotoIM(Chat)} underlayColor='#153757' activeOpacity={0.8}>
            <Text style={{fontSize:12,color:'#68bbaa'}}>{'(点击洽谈)'}</Text>
          </TouchableHighlight>
        </View>
      );
    }
  },
  renderUserPhoto: function (userInfo) {
    if (userInfo.photoFileUrl == null) {
      return (
        <View style={{margin:10}}>
          <NameCircular name={this.state.marketInfo.userName}/>
        </View>
      );
    }else{
      return (
        <View style={{margin:10}}>
          <Image
            style={{height:36,width:36,borderRadius:18}}
            source={{uri:userInfo.photoFileUrl}}
          />
        </View>
      );
    }
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
      );
    } else {
      return (
        <View></View>
      );
    }
  },
  renderImageTitle(){
    if (this.state.fileUrlList.length > 0) {
      return (
        <Text style={{marginLeft:10,marginTop:5,fontSize:16, color:'white'}}>{'附件:'}</Text>
      );
    }
  },
  renderImageItem: function () {
    return (
      <View style={{flexDirection:'row',marginTop:10}}>
        {
          this.state.fileUrlList.map((item, index) => {
            return (
              <Image
                key={index}
                style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5}}
                source={{uri:item, isStatic: true}}
              />
            )
          })
        }
      </View>
    );
  },
  gotoIM: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          chatType: SESSION_TYPE.USER,
          userId: this.state.bizOrderOwnerBean.userId
        }
      })
    }
  },

  getBizOrderInMarket: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.getBizOrderInMarket({
            orderId: id
          }
        ).then((response)=> {
          let t = new Date(response.lastModifyDate);
          this.setState({
            detailData: response,
            bizOrderOwnerBean: response.bizOrderOwnerBean,
            fileUrlList: response.fileUrlList,
            lastModifyDate: DateHelper.formatBillDetail(t)
          });
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  }

});

let styles = StyleSheet.create({});

module.exports = BusinessDetail;
