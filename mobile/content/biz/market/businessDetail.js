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
let DictStyle = require('../../constants/dictStyle');
let AppStore = require('../../framework/store/appStore');
let MarketStore = require('../../framework/store/marketStore');
let { Alert } = require('mx-artifacts');
let { SESSION_TYPE } = require('../../constants/dictIm');
let Chat = require('../im/chat');
let Lightbox = require('../../comp/lightBox/Lightbox');

let MarketAction = require('../../framework/action/marketAction');
let { MARKET_CHANGE } = require('../../constants/dictEvent');

let BusinessDetail = React.createClass({
  getInitialState(){
    let marketInfo = this.props.param.marketInfo;
    let loginUserInfo = AppStore.getLoginUserInfo();
    let userInfo = MarketStore.getUserInfoByUserId(marketInfo.userId);

    if (loginUserInfo.userId == marketInfo.userId){
      userInfo = loginUserInfo;
    }

    let t = new Date(marketInfo.lastModifyDate);

    return {
      userId: loginUserInfo.userId,
      detailData: '',
      fileUrlList: marketInfo.fileUrlList,
      marketInfo: marketInfo,
      orderUserId: marketInfo.userId,
      lastModifyDate: DateHelper.formatBillDetail(t),
      userInfo: userInfo
    }
  },

  componentDidMount() {
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
    if (!this.state.marketInfo) {
      return (
        <View>
        </View>
      );
    }

    return (
      <ScrollView style={{backgroundColor:'white'}}>
        <View style={{backgroundColor:'white'}}>
          <View style={{backgroundColor:'#f7f7f7',height:10}}>
          </View>
          <View style={{marginLeft:10}}>
            {this.returnItem('业务类型:', (this.state.marketInfo.bizCategoryDesc))}
            {this.returnItem('方向:', this.state.marketInfo.bizOrientationDesc)}
            {this.returnItem('期限:', this.termChangeHelp(this.state.marketInfo.term))}
            {this.returnItem('金额:', this.state.marketInfo.amount == null || this.state.marketInfo.amount == 0 ? '--'
              : this.state.marketInfo.amount < 100000000 ? (this.state.marketInfo.amount / 10000) + '万' : (this.state.marketInfo.amount / 100000000) + '亿')}
            {this.returnItem('利率:', this.state.marketInfo.rate == null || this.state.marketInfo.rate == 0 ? '--' : numeral(this.state.marketInfo.rate * 100).format('0,0.00') + '%')}
            {this.returnItem('备注:', this.state.marketInfo.remark == null || this.state.marketInfo.remark == 0 ? '--' : this.state.marketInfo.remark)}
            {this.returnItem('更新时间:', this.state.lastModifyDate)}
          </View>
          {this.renderAdjunct()}
          {this.renderUserInfo()}
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
        <Text style={{fontSize:16,color:DictStyle.marketSet.fontColor,flex:1}}>{desc}</Text>
        <Text style={{fontSize:16,color:(desc == '更新时间:')?DictStyle.marketSet.modifyDateColor:DictStyle.marketSet.fontColor,width:235/375*screenWidth}}>{value}</Text>
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
  renderUserInfo: function () {
    if (this.state.userInfo == null) {
      return (
        <View>
        </View>
      );
    }
    return (
      <View style={{backgroundColor:'#f0f0f0',borderRadius:2,margin:10}}>
        {this.renderPromulgator()}
        {this.returnInfoItem(require('../../image/market/email.png'), this.state.userInfo.email, true)}
        {this.returnInfoItem(require('../../image/market/tel.png'), this.state.userInfo.phoneNumber == null ? '未填写' : this.state.userInfo.phoneNumber, this.state.userInfo.publicPhone)}
        {this.returnInfoItem(require('../../image/market/mobile.png'), this.state.userInfo.mobileNumber == null ? '未填写' : this.state.userInfo.mobileNumber, this.state.userInfo.publicMobile)}
        {this.returnInfoItem(require('../../image/market/QQ.png'), this.state.userInfo.qqNo == null ? '未填写' : this.state.userInfo.qqNo, this.state.userInfo.publicQQ)}
        {this.returnInfoItem(require('../../image/market/weChat.png'), this.state.userInfo.weChatNo == null ? '未填写' : this.state.userInfo.weChatNo, this.state.userInfo.publicWeChat)}
      </View>
    );
  },
  renderPromulgator: function () {
    if (this.state.userId == this.state.orderUserId) {
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {this.renderUserPhoto(this.state.userInfo)}
          <Text style={{fontSize:16,color:DictStyle.marketSet.fontColor}}>{this.state.marketInfo.userName}</Text>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {this.renderUserPhoto(this.state.userInfo)}
          <Text style={{fontSize:16,color:DictStyle.marketSet.fontColor}}
                numberOfLines={1}>{this.state.marketInfo.userName}</Text>
          <TouchableHighlight onPress={()=>this.gotoIM(Chat)} underlayColor='#f0f0f0' activeOpacity={0.8}>
            <Text style={{fontSize:12,color:'#49cfae'}}>{'(点击洽谈)'}</Text>
          </TouchableHighlight>
        </View>
      );
    }
  },
  renderUserPhoto: function () {
    if (this.state.userInfo.photoStoredFileUrl == null) {
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
            source={{uri:this.state.userInfo.photoStoredFileUrl}}
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
          <Text style={{marginLeft:10,fontSize:16,color:DictStyle.marketSet.fontColor,width:screenWidth - 60}}>{value}</Text>
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
        <Text style={{marginLeft:10,marginTop:5,fontSize:16, color:DictStyle.marketSet.fontColor}}>{'附件:'}</Text>
      );
    }
  },
  renderImageItem: function () {
    return (
      <View style={{flexDirection:'row',marginTop:10}}>
        {
          this.state.fileUrlList.map((item, index) => {
            return (
                <Lightbox imageSource={{uri:item, isStatic: true}}>
                  <Image
                      key={index}
                      style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5}}
                      source={{uri:item, isStatic: true}}
                  />
                </Lightbox>
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
          userId: this.state.orderUserId
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
