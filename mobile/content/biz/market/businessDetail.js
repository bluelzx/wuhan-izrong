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
  InteractionManager,
  TouchableOpacity
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
let CallPhone = require('../../comp/utils/callPhone');
let LoadExtendImage = require('../../comp/utils/loadExtendImage');

let BusinessDetail = React.createClass({
  getInitialState(){
    let id = this.props.param.marketInfo.id;
    let myUserInfo = AppStore.getLoginUserInfo();

    return {
      id: id,
      myUserId: myUserInfo.userId,

      bizCategoryDesc: '',
      bizOrientation: '',
      bizOrientationDesc: '',
      term: 0,
      amount: 0,
      rate: 0,
      remark: null,
      modifyTimes: 0,
      fileUrlList: [],
      lastModifyDate: 0,
      userId: 0,
      userName: 0,
      realName: 0,
      orgId: 0,
      orgName: 0,
      mobileNumber: 0,
      isPublicMobile: null,
      phoneNumber: null,
      isPublicPhone: null,
      photoStoredFileUrl: null,
      isCertificated: null
    }
  },

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getBizOrderInMarket(this.state.id);
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
    if (this.state.bizCategoryDesc == '') {
      return (
        <View>
        </View>
      );
    }

    return (
      <View style={{backgroundColor:'white',flex:1}}>
        <ScrollView style={{backgroundColor:'white'}}>
          <View style={{backgroundColor:'white'}}>
            <View style={{backgroundColor:'#f7f7f7',height:10}}>
            </View>
            <View style={{marginLeft:10}}>
              {this.returnItem('业务类型:', (this.state.bizCategoryDesc))}
              {this.returnItem('方\u3000\u3000向:', this.state.bizOrientationDesc)}
              {this.returnItem('期\u3000\u3000限:', this.termChangeHelp(this.state.term))}
              {this.returnItem('金\u3000\u3000额:', this.state.amount == null || this.state.amount == 0 ? '--'
                : this.state.amount < 100000000 ? (this.state.amount / 10000) + '万' : (this.state.amount / 100000000) + '亿')}
              {this.returnItem('利\u3000\u3000率:', this.state.rate == null || this.state.rate == 0 ? '--' : numeral(this.state.rate * 100).format('0,0.00') + '%')}
              {this.returnItem('备\u3000\u3000注:', this.state.remark == null || this.state.remark == 0 ? '--' : this.state.remark)}
              {this.returnItem('更新时间:', DateHelper.descDate(new Date(this.state.lastModifyDate)))}
            </View>
            {this.renderAdjunct()}
            {this.renderUserInfo()}
          </View>
        </ScrollView>
        {this.renderChatBtn()}
      </View>
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
        <Text style={{alignSelf:'stretch',fontSize:16,color:DictStyle.marketSet.fontColor,flex:1}}>{desc}</Text>
        <Text
          style={{marginTop:1,alignSelf:'stretch',fontSize:16,color:(desc == '更新时间:')?DictStyle.marketSet.modifyDateColor : DictStyle.marketSet.fontColor,width:235/375*screenWidth}}>{value}</Text>
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
    return (
      <View style={{backgroundColor:'#f0f0f0',borderRadius:2,margin:10}}>
        {this.renderPromulgator()}
        <View style={{marginBottom:14}}>
          {this.returnInfoItem(true, require('../../image/market/mobile.png'), this.state.mobileNumber == null || this.state.mobileNumber == '' ? '--' : this.state.mobileNumber, this.state.isPublicMobile)}
          {this.returnInfoItem(true, require('../../image/market/tel.png'), this.state.phoneNumber == null || this.state.phoneNumber == '' ? '--' : this.state.phoneNumber, this.state.isPublicPhone)}
          {this.returnInfoItem(false, require('../../image/market/email.png'), this.state.userName, true)}
        </View>
      </View>
    );
  },
  renderPromulgator: function () {
    return (

      <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        {this.renderUserPhoto()}
        <View style={{flexDirection:'column',flex:1,justifyContent:'space-between'}}>
          <View style={{marginLeft:5,flexDirection:'row',alignItems:'center'}}>
            <Text style={{width:screenWidth - 106,fontSize:16,color:DictStyle.marketSet.fontColor}}
                  numberOfLines={1}>{this.state.realName}</Text>
          </View>
          <Text style={{marginLeft:5,marginTop: 10,fontSize:12,color:DictStyle.marketSet.fontColor}}
                numberOfLines={1}>{this.state.orgName}</Text>
        </View>
      </View>

    );

  },
  renderUserPhoto: function () {
    if (this.state.photoStoredFileUrl == null) {
      return (
        <View style={{margin:10}}>
          <NameCircular name={this.state.realName}/>
          {this.renderIsCertificated()}
        </View>
      );
    } else {
      let uri = this.state.photoStoredFileUrl + ImageSize50;
      return (
        <View style={{margin:10}}>
          <LoadExtendImage jobMode="load"
                           source={{uri: uri}}
                           occurError={(error) => Alert(error)}
                           style={{height:46,width:46,borderRadius:23}}
                           navigator = {this.props}
                           ref="loadImage"
          />
          {this.renderIsCertificated()}
        </View>
      );
    }
  },
  renderIsCertificated: function () {
    if (this.state.isCertificated) {
      return (
        <View>
          <Image style={[styles.certified,{position: 'absolute',bottom:0,left:30}]}
                 resizeMode="cover" source={require('../../image/user/certificated.png')}/>
        </View>
      );
    }
  },
  returnInfoItem: function (isCallPhone, url, value, isPublic) {
    if (isCallPhone) {
      if (isPublic == false) {
        return (
          <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
            <Image style={{width:16,height:16}}
                   source={url}
            />
            <Text
              style={{marginLeft:10,fontSize:DictStyle.marketSet.fontSize,color:DictStyle.marketSet.fontColor}}
              numberOfLines={2}
            >{'--'}</Text>
          </View>
        );
      } else {
        if (value == '--'){
          return (
            <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
              <Image style={{width:16,height:16}}
                     source={url}
              />
              <Text
                style={{marginLeft:10,fontSize:DictStyle.marketSet.fontSize,color:DictStyle.marketSet.fontColor}}
                numberOfLines={2}
              >{isPublic ? value : '--'}</Text>
            </View>
          );
        }
        return (
          <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
            <Image style={{width:16,height:16}}
                   source={url}
            />
            <TouchableOpacity onPress={()=>{CallPhone.callPhone(value)}}>
              <Text
                style={{marginLeft:10,fontSize:DictStyle.marketSet.fontSize,color:DictStyle.marketSet.fontColor,textDecorationLine: 'underline'}}
                numberOfLines={2}>{value}</Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else {
      return (
        <View style={{flexDirection:'row',alignItems:'center',paddingVertical:5,marginLeft:10}}>
          <Image style={{alignSelf:'stretch',width:16,height:16}}
                 source={url}
          />
          <Text
            style={{alignSelf:'stretch',width:screenWidth - 60,marginLeft:10,fontSize:DictStyle.marketSet.fontSize,color:DictStyle.marketSet.fontColor}}
            numberOfLines={2}
          >{isPublic ? value : '--'}</Text>
        </View>
      );
    }
  },
  renderImageTitle(){
    if (this.state.fileUrlList.length > 0) {
      return (
        <Text
          style={{marginLeft:10,marginTop:5,fontSize:16, color:DictStyle.marketSet.fontColor}}>{'图\u3000\u3000片:'}</Text>
      );
    }
  },
  renderImageItem: function () {
    if (this.state.fileUrlList == null || this.state.fileUrlList == ''){
      return (
        <View>
        </View>
      );

    }
    return (
      <View style={{flexDirection:'row',marginTop:10}}>
        {
          this.state.fileUrlList.map((item, index) => {

            let uri = item + ImageSize50;

            return (
              <LoadExtendImage
                style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'#cccccc'}}
                source={{uri:uri}}
                jobMode="load"
                navigator = {this.props}
                key={index}
              >
              </LoadExtendImage>
            )
          })
        }
      </View>
    );
  },

//<Lightbox key={index}
//          imageSource={{uri:item, isStatic: true}}
//          underlayColor="#f7f7f7"
//          navigator={this.props.navigator}
//          springConfig={{tension: 35, friction: 6}}
//>
//  <Image
//    style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'#cccccc'}}
//    source={{uri:uri}}
//  />
//</Lightbox>

  renderChatBtn: function () {
    if (this.state.userId == this.state.myUserId) {
      return (
        <View>
        </View>
      );
    }
    return (
      <View style={{height:44}}>
        <Button
          containerStyle={{height:44,borderRadius:0,backgroundColor:"#4b76df"}}
          style={{fontSize: 15, color: '#ffffff'}}
          disabled={this.state.disabled}
          onPress={() => this.gotoIM()}
        >
          {'洽谈'}
        </Button>
      </View>
    )
  },
  gotoIM: function () {
    let userId = this.state.userId;
    let myInfo = ContactStore.getUserInfo();
    let self = this;
    this.props.exec(()=> {
      return new Promise((resolve, reject)=> {
        let user = ContactStore.getUserInfoByUserId(userId);
        resolve(user);
      }).catch((err)=> {
        //
        if (err == ErrorMsg.USERINFONULL) {
          return ContactAction.getUserInfoFromServer(userId);
        } else {
          throw err;
        }
      }).then((user)=> {
        let sessionId = KeyGenerator.getSessionKey(SESSION_TYPE.USER, user.userId, myInfo.userId);
        let content = {
          "bizCategory": this.state.bizCategoryDesc,
          "bizOrientation": this.state.bizOrientation,
          "term": this.state.term,
          "amount": this.state.amount,
          "rate": this.state.rate,
          "remark": this.state.remark
        };
        const { navigator } = self.props;
        if (navigator) {
          navigator.push({
            comp: Chat,
            param: {
              chatType: SESSION_TYPE.USER,
              userId: userId,
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
            bizCategoryDesc: response.bizCategoryDesc,
            bizOrientation: response.bizOrientation,
            bizOrientationDesc: response.bizOrientationDesc,
            term: response.term,
            amount: response.amount,
            rate: response.rate,
            remark: response.remark,
            modifyTimes: response.modifyTimes,
            fileUrlList: response.fileUrlList,
            lastModifyDate: response.lastModifyDate,
            userId: response.userId,
            userName: response.userName,
            realName: response.realName,
            orgId: response.orgId,
            orgName: response.orgName,
            mobileNumber: response.mobileNumber,
            isPublicMobile: response.isPublicMobile,
            phoneNumber: response.phoneNumber,
            isPublicPhone: response.isPublicPhone,
            photoStoredFileUrl: response.photoStoredFileUrl,
            isCertificated: response.isCertificated
          });
          console.log('wxg--' + 'isPublicMobile: ' +  response.isPublicMobile + '\n' +
                      'wxg--' + 'mobileNumber: ' +  response.mobileNumber + '\n' +
                      'response' + JSON.stringify(response))
        }).catch(
          (errorData) => {
            if (errorData.msgCode == 'APP_BIZ_ORDER_HAS_DOWNSELF'){
              Alert(errorData.msgContent,()=>{
                const { navigator } = this.props;
                if (navigator) {
                  navigator.pop();
                }
              });
            }else{
              throw errorData;
            }
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
