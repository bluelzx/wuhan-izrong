/**
 * Created by cui on 16/4/21.
 */

'use strict';

let React = require('react-native');
let {
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  ListView,
  ActionSheetIOS,
  Platform,
  CameraRoll,
  ToastAndroid,
  DeviceEventEmitter
  }=React;

let { Alert } = require('mx-artifacts');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let NavBarView = require('../../framework/system/navBarView');
let SelectBtn = require('../publish/selectBtn');
let Remarks = require('../publish/remarks');
let ImagePicker = require('../../comp/utils/imagePicker');
let Validation = require('../../comp/utils/validation');
let DateHelper = require('../../comp/utils/dateHelper');
let Input = require('../../comp/utils/input');
let Adjust = require('../../comp/utils/adjust');
let numeral = require('numeral');
let dismissKeyboard = require('react-native-dismiss-keyboard');

let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let ImAction = require('../../framework/action/imAction');
import Share from 'react-native-share';

let {MYBIZ_CHANGE} = require('../../constants/dictEvent');

let bizOrientationUnit = ['收', '出'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let MyBizDetail = React.createClass({
  getInitialState(){
    let marketInfo = this.props.param.marketInfo;
    let t = new Date(marketInfo.lastModifyDate);

    return {
      marketInfo: marketInfo,
      bizOrientationDefault: (marketInfo.bizOrientation == 'IN') ? 0 : 1,
      termDefault: marketInfo.term == null || marketInfo.term == 0 ? 0 :(marketInfo.term % 365 == 0) ? 2 : (marketInfo.term % 30 == 0) ? 1 : 0,
      amountDefault: (marketInfo.amount <= 100000000) ? 0 : 1,
      termText: this.termChangeHelp(marketInfo.term).toString(),
      amountText: marketInfo.amount == null || marketInfo.amount == 0 ? '' : (marketInfo.amount <= 100000000) ? (marketInfo.amount / 10000).toString() : (marketInfo.amount / 100000000).toString(),
      rateText: marketInfo.rate == null || marketInfo.rate == 0 ? '' : numeral((marketInfo.rate * 100)).format('0,0.00'),
      remarkText: marketInfo.remark,
      lastModifyDate: DateHelper.formatBillDetail(t),
      //networt
      id: marketInfo.id,
      term: marketInfo.term,
      rate: marketInfo.rate * 100,
      remark: marketInfo.remark,
      bizOrientation: marketInfo.bizOrientation,
      bizCategory: marketInfo.bizCategory,
      bizItem: marketInfo.bizItem,
      amount: marketInfo.amount,
      fileUrlList: marketInfo.fileUrlList
    }
  },

  componentDidMount() {
  },

  componentWillUnmount() {
  },




  termChangeHelp(term){
    if(term == null || term == 0){
      return '';
    }else if (term % 365 == 0){
      return term/365
    }else if (term % 30 == 0){
      return term/30
    } else{
      return term
    }
  },

    termLimitChangeHelp(term){
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

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='业务详情' showBack={true} showBar={true}
                  actionButton={this.renderShutDownBiz}>
        <View style={{height:screenHeight-64,backgroundColor:'#153757'}}>
          <View style={{flex:1}}>
            <ScrollView>
              {this.renderSelectOrg()}
              {this.renderBusinessType()}
              {this.renderTimeLimit()}
              {this.renderAmount()}
              {this.renderRate()}
              {this.renderAddImg()}
              {this.renderRemarks()}
              {this.renderModifyData()}
            </ScrollView>
            {this.renderSaveBtn()}
          </View>
        </View>
      </NavBarView>
    );
  },
  _bizOrientationDataChange (index) {
    this.setState({
      bizOrientationDefault: index,
      bizOrientation: (index == 0) ? 'IN' : 'OUT'
    });

  },
  _termDataChange (index) {
    this.setState({
      termDefault: index,
      term: (index == 0) ? Number(this.state.termText) : (index == 1) ? Number(this.state.termText) * 30 : Number(this.state.termText) * 365
    });

  },
  _amountDataChange (index) {
    this.setState({
      amountDefault: index,
      amount: (index == 0) ? Number(this.state.amountText) * 10000 : Number(this.state.amountText) * 100000000
    });

  },

  _onChangeText(key, value){
    this.setState({[key]: value});
    if (key == 'termText') {
      this.setState({term: (this.state.termDefault == 0) ? Number(value) : (this.state.termDefault == 1) ? Number(value) * 30 : Number(value) * 365});
    } else if (key == 'amountText') {
      this.setState({amount: (this.state.amountDefault == 0) ? Number(value) * 10000 : Number(value) * 100000000});
    } else {
      this.setState({rate: Number(value)});
    }
    if (this.state.termText.length == 0 || this.state.amountText.length == 0 || this.state.rateText.length == 0) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  },
  renderShutDownBiz: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <TouchableOpacity
                          onPress={()=>this.shutDownBiz()}>
          <Text style={{color:'#ffffff'}}>{'下架'}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <View></View>
      );
    }
  },
  renderSelectOrg: function () {
    return (
      <View
        style={{marginTop:10,height:36,alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
        <Text
          style={{fontSize:16,marginLeft:10,color:'white'}}
        >{'业务类型: ' + this.state.marketInfo.bizCategoryDesc + '-' + this.state.marketInfo.bizItemDesc
        }</Text>
      </View>
    )
  },
  renderBusinessType: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{marginLeft:10, color:'white'}}>{'方向'}</Text>
            <Text style={{color:'red'}}>{'*'}</Text>
          </View>
          <View style={{marginTop:10,flexDirection:'row'}}>
            <SelectBtn dataList={bizOrientationUnit} defaultData={this.state.bizOrientationDefault}
                       change={this._bizOrientationDataChange}/>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <View style={{flexDirection:'row'}}>
            {this.returnItem('方向:', this.state.marketInfo.bizOrientationDesc)}
          </View>
        </View>
      );
    }
  },
  renderTimeLimit: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:'white'}}>{'期限'}</Text>
          <View style={{marginTop:10,flexDirection:'row'}}>
            <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                   iconStyle={{}} placeholderTextColor='#325779'
                   inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                   placeholder='天数' maxLength={3} field='termText' inputType="numeric"
                   onChangeText={this._onChangeText}
                   value={this.state.termText}
            />
            <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._termDataChange}/>

          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',marginTop:10}}>
          {this.returnItem('期限:', this.termLimitChangeHelp(this.state.marketInfo.term))}
        </View>
      );
    }
  },
  renderAmount: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:'white'}}>{'金额'}</Text>
          <View style={{marginTop:10,flexDirection:'row'}}>
            <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                   iconStyle={{}} placeholderTextColor='#325779'
                   inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                   placeholder='0-1000亿' maxLength={8} field='amountText' inputType="numeric"
                   onChangeText={this._onChangeText}
                   value={this.state.amountText}
            />
            <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault} change={this._amountDataChange}/>

          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',marginTop:10}}>
          {this.returnItem('金额:',
            this.state.marketInfo.amount == null || this.state.marketInfo.amount == 0 ? '--' :
              this.state.marketInfo.amount < 100000000 ? this.state.marketInfo.amount / 10000 + '万' :
              (this.state.marketInfo.amount / 100000000) + '亿')
          }
        </View>
      );
    }
  },
  renderRate: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:'white'}}>{'利率'}</Text>
          <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
            <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                   iconStyle={{}} placeholderTextColor='#325779'
                   inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                   placeholder='0-99.99' maxLength={5} field='rateText' inputType="numeric"
                   onChangeText={this._onChangeText}
                   value={this.state.rateText}
                   editable={false}
            />
            <Text style={{marginLeft:10,fontWeight: 'bold', color:'white'}}>{'%'}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',marginTop:10}}>
          {this.returnItem('利率:', this.state.marketInfo.rate == null || this.state.marketInfo.rate == 0 ? '--' : numeral(this.state.marketInfo.rate * 100).format('0,0.00')+ '%')}
        </View>
      );
    }
  },
  renderAddImg: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:'white'}}>{'添加图片'}</Text>
          <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
            <View style={{width:((screenWidth-60)/5 + 10) * this.state.fileUrlList.length}}>
              <ListView style={{}} scrollEnabled={false} horizontal={true}
                        dataSource={ds.cloneWithRows(this.state.fileUrlList)} renderRow={this.renderImgItem}/>
            </View>
            {this.renderAdd()}
          </View>
        </View>

      )
    } else {
      return (
        <View>
          {this.renderImageTitle()}
          {this.renderImageItem()}
        </View>
      );
    }
  },

  renderAdd (){
    if (this.state.fileUrlList.length < 5) {
      return (
        <ImagePicker
          type="all"
          onSelected={(response) => {this.handleSendImage(response, 10)}}
          onError={(error) => this.handleImageError(error)}
          title="选择图片"
          fileId="publish1"
          allowsEditing={true}
          style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
        >
          <Image
            style={{width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
            source={require('../../image/market/addImage.png')}
          />
        </ImagePicker>
      );
    }
  },

  renderImageTitle(){
    if (this.state.fileUrlList.length > 0) {
      return (
        <Text style={{marginLeft:10,marginTop:5,fontSize:16, color:'white'}}>{'附件:'}</Text>
      );
    } else {
      return <View></View>;
    }
  },
  renderImgItem: function (rowData, sectionID, rowID) {
    return (
      <ImagePicker
        longPress={() => this._longPress(rowID)}
        type="all"
        onSelected={(response) => {this.handleSendImage(response, rowID)}}
        onError={(error) => this.handleImageError(error)}
        title="选择图片"
        style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
      >
        <Image
          style={{flex:1,width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
          source={{uri:rowData}}
        />
      </ImagePicker>
    )
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

  renderRemarks: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{marginTop:10}}>
          <TouchableHighlight onPress={() => this.toRemarks(Remarks)} underlayColor='rgba(129,127,201,0)'>
            <View
              style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height: 40, backgroundColor: '#102a42'}}>
              <Text style={{marginLeft:10, fontWeight: 'bold', color:'white'}}>
                {'备注'}
              </Text>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginRight:10, fontWeight: 'bold', color:'#325779'}}
                      numberOfLines={1}>{(this.state.remarkText == '') ? '20字以内' : this.state.remarkText}
                </Text>
                <Image style={{margin:10,width:16,height:16}}
                       source={require('../../image/market/next.png')}
                />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row'}}>
          {this.returnItem('备注:', this.state.remarkText == null || this.state.remarkText.length == 0 ? '--' : this.state.remarkText)}
        </View>
      );
    }
  },
  renderModifyData: function () {
    return (
      <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
        {this.returnItem('最近修改时间:', this.state.lastModifyDate)}
      </View>

    )
  },
  renderSaveBtn: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <TouchableHighlight onPress={() => this._pressSave()} underlayColor='rgba(129,127,201,0)'>
          <View
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
            <Text style={{fontWeight: 'bold', color:'white'}}>
              {'保存'}
            </Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return <View></View>;
    }
  },

  returnItem: function (desc, value) {
    return (
      <View style={{marginLeft:10,flexDirection:'row',alignItems:'center',paddingVertical:5}}>
        <Text style={{fontSize:15,color:'white',flex:1}}>{desc}</Text>
        <Text
          style={{marginLeft:10,fontSize:15,color:(desc == '最近修改时间:')?'#ffd547':'white',width:225/375*screenWidth}}>{value}</Text>
      </View>
    )
  },

  _longPress (rowId){
    if (Platform.OS === 'ios') {
      let options = [
        '保存图片',
        '删除图片',
        '返回'
      ];
      ActionSheetIOS.showActionSheetWithOptions({
          options: options,
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex == 0) {
            CameraRoll.saveImageWithTag('file://' + this.state.fileUrlList[rowId]).then(
              (data) => {Alert('保存成功')},
              (err) => {
                console.log('CameraRoll,err' + err);
              }
            );
          } else if (buttonIndex == 1) {
            let arr = this.state.fileUrlList;
            arr[rowId] = 0;
            this.setState({fileUrlList: _.compact(arr)})
          }
        });
    } else {
      UserPhotoPicModule.showSaveImgDialog(
        (index) => {
          switch(index) {
            case 0:
              CameraRoll.saveImageWithTag('file://' + this.state.fileUrlList[rowId]).then(
                (data) => {
                  ToastAndroid.show('保存成功', ToastAndroid.SHORT);
                },
                (err) => {
                  ToastAndroid.show('保存失败', ToastAndroid.SHORT);
                }
              );
              break;
            case 1:
              let arr = this.state.fileUrlList;
              arr[rowId] = 0;
              this.setState({fileUrlList: _.compact(arr)});
              break;
            default:
              break;
          }
        }
      );
    }
  },

  _pressSave: function () {
    if (!Validation.isTerm(this.state.termText)) {
      Alert('期限：请输入大于0的整数');
    } else if (!Validation.isAmount(this.state.amountText)) {
      Alert('金额：请输入正确的浮点数');
    } else if (!Validation.isRate(this.state.rateText)) {
      Alert('利率：请输入0-99.99之间的小数');
    } else if (this.state.amount > 100000000000) {
      Alert('您输入的金额过大');
    } else {
      this.updateBizOrder();
    }

  },

  shutDownBiz: function () {
    Alert('你确定下架该业务吗?', () => {
      this.downselfBizOrder(this.state.marketInfo.id)
    }, () => {
    }, '确定', '取消');
  },
  callBackRemarks: function (remarkText) {
    this.setState({
      remarkText: remarkText
    })
  },

  toRemarks: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          callBackRemarks: this.callBackRemarks,
          remarkText: this.state.remarkText
        }
      })
    }
  },

  getBizOrderByCreator: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.getBizOrderByCreator({
            orderId: id
          }
        ).then((response)=> {
          let detail = (JSON.stringify(response));
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },

  updateBizOrder: function () {
    dismissKeyboard();
    let {title, param}  = this.props;
    let params = {
      id: this.state.id,
      bizCategory: this.state.bizCategory,
      bizItem: this.state.bizItem,
      bizOrientation: this.state.bizOrientation,
      term: this.state.term,
      amount: this.state.amount,
      rate: this.state.rate / 100,
      fileUrlList: this.state.fileUrlList,
      remark: this.state.remarkText
    };
    let item = {
      bizCategory: (this.state.bizCategory == '' && this.state.bizItem == '') ? '资金业务 - 同业存款' : this.state.bizCategory.displayName + '-' + this.state.bizItem.displayName,
      bizOrientation: params.bizOrientation,
      term: params.term,
      amount: params.amount,
      rate: params.rate
    };
    this.props.exec(
      ()=> {
        return MarketAction.updateBizOrder(params).then((response)=> {
          Alert('保存成功, 是否分享?', () => {
            this.shareDialog(item);
          }, () => {
          }, '分享', '不分享');
          AppStore.emitChange(MYBIZ_CHANGE);
          this.props.navigator.pop();
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },
  shareDialog (data) {
    let amount = data.amount == '' ? '--' : (data.amount > 99999999 ? data.amount / 100000000 + '亿' : data.amount / 10000 + '万');
    let dayNum;
    if (data.term == '') {
      dayNum = '--'
    } else if (data.term % 365 == 0) {
      dayNum = parseInt(data.term / 365) + '年';
    } else if (data.term % 30 == 0) {
      dayNum = parseInt(data.term / 30) + '月';
    }else {
      dayNum = data.term + '日';
    }
    let rate = data.rate == 0 ? '--' : (numeral(data.rate * 100).format('0,0.00') + '%');
    let shareContent = '我利用[渤海银通]分享了一个业务信息给您：' + data.bizCategory + '  ' + (data.bizOrientation == 'IN' ? '入' : '出') + '  ' + dayNum + '  ' + amount + '  ' + rate;
    Share.open({
      share_text: shareContent,
      share_URL: Platform.OS === 'android' ? shareContent : "http://google.cl",
      title: "Share Link"
    }, (e) => {
      console.log(e);
    });
  },

  downselfBizOrder: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.downselfBizOrder({
            orderId: id
          }
        ).then((response)=> {
          Alert('下架成功',()=>{
            this.props.navigator.pop();
            AppStore.emitChange(MYBIZ_CHANGE);
          });
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },
  handleSendImage(uri,index) {
    this.props.exec(
      ()=> {
        return ImAction.uploadImage(uri)
          .then((response) => {
            let arr = this.state.fileUrlList;
            if (index > 5) {
              arr.push(response.fileUrl);
            } else {
              arr[index] = uri;
            }
            this.setState({
              fileUrlList: arr
            });
          }).catch((errorData) => {
            console.log('Image upload error ' + JSON.stringify(errorData));
          });
      }
    )
  },

  handleImageError(error) {
    console.log('Image select error ' + JSON.stringify(error));
    Alert('图片选择失败');
  }


});

module.exports = MyBizDetail;
