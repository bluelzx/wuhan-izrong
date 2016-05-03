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

let { SESSION_TYPE } = require('../../constants/dictIm');
let Chat = require('../im/chat');

let MarketAction = require('../../framework/action/marketAction');

let BusinessDetail = React.createClass({
  getInitialState(){
    let marketInfo = this.props.param.marketInfo;
    return {
      detailData: '',
      bizOrderOwnerBean: '',
      fileUrlList: [],
      marketInfo: marketInfo,
      lastModifyDate: ''
    }
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getBizOrderInMarket(this.state.marketInfo.id);
    });
  },

  termChangeHelp(term){
    if(term == null || term == 0){
      return '--';
    }else if (term % 365 == 0){
      return term/365 + '年';
    }else if (term % 30 == 0){
      return term/30 + '月';
    }else if (term == 1){
      return '隔夜';
    }
    else{
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
              : this.state.detailData.amount < 100000000 ? numeral(this.state.detailData.amount / 10000).format('0,0') + '万' : numeral(this.state.detailData.amount / 100000000).format('0,0') + '亿')}
            {this.returnItem('利率:', this.state.detailData.rate == null || this.state.detailData.rate == 0 ? '--' : numeral(this.state.detailData.rate * 100).format('0,0.00') + '%')}
            {this.returnItem('备注:', this.state.detailData.remark == null || this.state.detailData.remark == 0 ? '--' : this.state.detailData.remark)}
            {this.returnItem('更新时间:', this.state.lastModifyDate)}
          </View>
          {this.renderAdjunct()}
          <View style={{backgroundColor:'#153757',borderRadius:2,margin:10}}>
            {this.renderPromulgator()}
            {this.returnInfoItem(require('../../image/market/tel.png'), this.state.bizOrderOwnerBean.phoneNumber, this.state.bizOrderOwnerBean.isPublicPhone)}
            {this.returnInfoItem(require('../../image/market/mobile.png'), this.state.bizOrderOwnerBean.mobileNumber, this.state.bizOrderOwnerBean.isPublicMobile)}
            {this.returnInfoItem(require('../../image/market/QQ.png'), this.state.bizOrderOwnerBean.qqNo, this.state.bizOrderOwnerBean.isPublicQQNo)}
            {this.returnInfoItem(require('../../image/market/weChat.png'), this.state.bizOrderOwnerBean.weChatNo, this.state.bizOrderOwnerBean.isPublicWeChatNo)}
            {this.returnInfoItem(require('../../image/market/org.png'), this.state.marketInfo.orgName,true)}
          </View>
        </View>
      </ScrollView>
    );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='业务详情' showBack={true} showBar={true}>
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
  renderPromulgator: function () {
    return (
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <View style={{margin:10}}>
          <NameCircular name={this.state.marketInfo.userName}/>
        </View>
        <Text style={{fontSize:16,color:'white'}}>{this.state.marketInfo.userName}</Text>
        <TouchableHighlight onPress={()=>this.gotoIM(Chat)} underlayColor='#153757' activeOpacity={0.8}>
          <Text style={{fontSize:12,color:'#68bbaa'}}>{'(点击洽谈)'}</Text>
        </TouchableHighlight>
      </View>
    );
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
