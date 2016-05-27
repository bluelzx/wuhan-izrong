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
let { Alert ,Button } = require('mx-artifacts');
let { SESSION_TYPE } = require('../../constants/dictIm');
let Chat = require('../im/chat');
let Lightbox = require('../../comp/lightBox/Lightbox');
let ContactStore = require('../../framework/store/contactStore');
let ContactAction = require('../../framework/action/contactAction');
let KeyGenerator = require('../../comp/utils/keyGenerator');
let CustomImage = require('../../comp/utils/CustomImage');
let {ImageSize50,ImageSize100} = require('../../../config');
let MarketAction = require('../../framework/action/marketAction');
let ErrorMsg = require('../../constants/errorMsg');

let BusinessDetail = React.createClass({
  getInitialState(){
    let marketInfo = this.props.param.marketInfo;
    let t = new Date(marketInfo.lastModifyDate);

    return {
      fileUrlList: marketInfo.fileUrlList,
      marketInfo: marketInfo,
      orderUserId: marketInfo.userId,
      lastModifyDate: DateHelper.formatBillDetail(t),
      bizOrderOwnerBean: []
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
            {this.returnItem('方\u3000\u3000向:', this.state.marketInfo.bizOrientationDesc)}
            {this.returnItem('期\u3000\u3000限:', this.termChangeHelp(this.state.marketInfo.term))}
            {this.returnItem('金\u3000\u3000额:', this.state.marketInfo.amount == null || this.state.marketInfo.amount == 0 ? '--'
              : this.state.marketInfo.amount < 100000000 ? (this.state.marketInfo.amount / 10000) + '万' : (this.state.marketInfo.amount / 100000000) + '亿')}
            {this.returnItem('利\u3000\u3000率:', this.state.marketInfo.rate == null || this.state.marketInfo.rate == 0 ? '--' : numeral(this.state.marketInfo.rate * 100).format('0,0.00') + '%')}
            {this.returnItem('备\u3000\u3000注:', this.state.marketInfo.remark == null || this.state.marketInfo.remark == 0 ? '--' : this.state.marketInfo.remark)}
            {this.returnItem('更新时间:', this.state.lastModifyDate)}
          </View>
          {this.renderAdjunct()}
          {this.renderUserInfo()}
        </View>
      </ScrollView>
    );
  },

  render: function () {
    if (this.state.bizOrderOwnerBean.length == 0) {
      return (
        <NavBarView navigator={this.props.navigator} title='业务详情'>
        </NavBarView>
      );
    }
    return (
      <NavBarView navigator={this.props.navigator} title='业务详情'>
        {this._renderContent()}
      </NavBarView>
    );
  },

  returnItem: function (desc, value) {
    return (
      <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
        <Text style={{alignSelf:'stretch',fontSize:16,color:DictStyle.marketSet.fontColor,flex:1}}>{desc}</Text>
        <Text
          style={{alignSelf:'stretch',fontSize:16,color:(desc == '更新时间:')?DictStyle.marketSet.modifyDateColor:(desc == '备\u3000\u3000注:')?
          this.state.marketInfo.remark == null || this.state.marketInfo.remark == 0 ? DictStyle.marketSet.fontColor :DictStyle.marketSet.amountColor:DictStyle.marketSet.fontColor,width:235/375*screenWidth}}>{value}</Text>
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
    if (this.state.marketInfo == null) {
      return (
        <View>
        </View>
      );
    }
    return (
      <View style={{backgroundColor:'#f0f0f0',borderRadius:2,margin:10}}>
        {this.renderPromulgator()}
        <View style={{marginBottom:14}}>
          {this.returnInfoItem(require('../../image/market/mobile.png'), this.state.bizOrderOwnerBean.mobileNumber == null || this.state.bizOrderOwnerBean.mobileNumber == '' ? '--' : this.state.bizOrderOwnerBean.mobileNumber, this.state.bizOrderOwnerBean.isPublicMobile != false ? true : false)}
          {this.returnInfoItem(require('../../image/market/email.png'), this.state.bizOrderOwnerBean.userName, true)}
          {this.returnInfoItem(require('../../image/market/tel.png'), this.state.bizOrderOwnerBean.phoneNumber == null || this.state.bizOrderOwnerBean.phoneNumber == '' ? '--' : this.state.bizOrderOwnerBean.phoneNumber, this.state.bizOrderOwnerBean.isPublicPhone != false ? true : false)}
        </View>
        {this.renderChatBtn()}
      </View>
    );
  },
  renderPromulgator: function () {
    return (

      <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        {this.renderUserPhoto()}
        <View style={{flexDirection:'column',flex:1,justifyContent:'space-between'}}>
          <View style={{marginLeft:5,flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:16,color:DictStyle.marketSet.fontColor}}
                  numberOfLines={1}>{this.state.marketInfo.userName}</Text>
          </View>
          <Text style={{marginLeft:5,marginTop: 10,fontSize:12,color:DictStyle.marketSet.fontColor}}
                numberOfLines={1}>{this.state.marketInfo.orgName}</Text>
        </View>
      </View>

    );

  },
  renderUserPhoto: function () {
    if (this.state.bizOrderOwnerBean.photoStoredFileUrl == null) {
      return (
        <View style={{margin:10}}>
          <NameCircular name={this.state.marketInfo.userName}/>
          {this.renderIsCertificated()}
        </View>
      );
    } else {
      let uri = this.state.bizOrderOwnerBean.photoStoredFileUrl + ImageSize50;
      return (
        <View style={{margin:10}}>
          <Image
            style={{height:46,width:46,borderRadius:23}}
            source={{uri:uri}}
          />
          {this.renderIsCertificated()}
        </View>
      );
    }
  },
  renderIsCertificated: function () {
    if (this.state.bizOrderOwnerBean.isCertificated) {
      return (
        <View>
          <Image style={[styles.certified,{position: 'absolute',bottom:5,left:40}]}
                 resizeMode="cover" source={require('../../image/user/certificated.png')}/>
        </View>
      );
    }
  },
  returnInfoItem: function (url, value, isPublic) {
    return (
      <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
        <Image style={{width:16,height:16}}
               source={url}
        />
        <Text
          style={{marginLeft:10,fontSize:16,color:DictStyle.marketSet.fontColor,width:screenWidth - 60}}
        >{isPublic ? value : '--'}</Text>
      </View>
    );

  },
  renderImageTitle(){
    if (this.state.fileUrlList.length > 0) {
      return (
        <Text
          style={{marginLeft:10,marginTop:5,fontSize:16, color:DictStyle.marketSet.fontColor}}>{'附\u3000\u3000件:'}</Text>
      );
    }
  },
  renderImageItem: function () {
    return (
      <View style={{flexDirection:'row',marginTop:10}}>
        {
          this.state.fileUrlList.map((item, index) => {

            let uri = item + ImageSize50;

            return (
              <Lightbox key={index}
                        imageSource={{uri:item, isStatic: true}}
                        underlayColor="#f7f7f7"
                        navigator={this.props.navigator}
                        springConfig={{tension: 35, friction: 6}}
              >
                <Image
                  style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'#cccccc'}}
                  source={{uri:uri}}
                />
              </Lightbox>
            )
          })
        }
      </View>
    );
  },
  renderChatBtn: function () {
    return (
      <View style={{height:44}}>
        <Button
          containerStyle={{height:44,borderRadius:0,backgroundColor:"#4b76df"}}
          style={{fontSize: 15, color: '#ffffff',}}
          disabled={this.state.disabled}
          onPress={() => this.gotoIM()}
        >
          {'洽谈'}
        </Button>
      </View>
    )
  },
  gotoIM: function () {
    let orderUserId = this.state.orderUserId;
    let myInfo = ContactStore.getUserInfo();
    let self = this;
    this.props.exec(()=> {
      return new Promise((resolve, reject)=> {
        let user = ContactStore.getUserInfoByUserId(orderUserId);
        resolve(user);
      }).catch((err)=> {
        //
        if (err == ErrorMsg.USERINFONULL) {
          return ContactAction.getUserInfoFromServer(orderUserId);
        } else {
          throw err;
        }
      }).then((user)=> {
        let sessionId = KeyGenerator.getSessionKey(SESSION_TYPE.USER, user.userId, myInfo.userId);//'user:' + this.state.orderUserId.toString();
        let content = {
          "bizCategory": this.state.marketInfo.bizCategoryDesc,
          "bizOrientation": this.state.marketInfo.bizOrientation,
          "term": this.state.marketInfo.term,
          "amount": this.state.marketInfo.amount,
          "rate": this.state.marketInfo.rate,
          "remark": this.state.marketInfo.remark
        };
        const { navigator } = self.props;
        if (navigator) {
          navigator.push({
            comp: Chat,
            param: {
              chatType: SESSION_TYPE.USER,
              userId: orderUserId,
              sessionId: sessionId,
              content: JSON.stringify(content),
              isFromBizDetail: true
            }
          })
        }

      });
    });


  },

  getBizOrderInMarket: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.getBizOrderInMarket({
            orderId: id
          }
        ).then((response)=> {
          this.setState({
            bizOrderOwnerBean: response.bizOrderOwnerBean
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

let styles = StyleSheet.create({
  certified: {
    width: 15,
    height: 15
  }
});

module.exports = BusinessDetail;
