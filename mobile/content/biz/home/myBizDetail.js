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
  DeviceEventEmitter,
  Animated
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
let DictStyle = require('../../constants/dictStyle');
let Lightbox = require('../../comp/lightBox/Lightbox');
let Icon = require('react-native-vector-icons/Ionicons');

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
      termDefault: marketInfo.term == null || marketInfo.term == 0 ? 0 : (marketInfo.term % 365 == 0) ? 2 : (marketInfo.term % 30 == 0) ? 1 : 0,
      amountDefault: (marketInfo.amount < 100000000) ? 0 : 1,
      termText: this.termChangeHelp(marketInfo.term).toString(),
      amountText: marketInfo.amount == null || marketInfo.amount == 0 ? '' : (marketInfo.amount < 100000000) ? (marketInfo.amount / 10000).toString() : (marketInfo.amount / 100000000).toString(),
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
      amount: marketInfo.amount,
      fileUrlList: marketInfo.fileUrlList,

      keyboardSpace: 0,
      scrollHeight: screenHeight - 108
    }
  },

  componentDidMount: function () {
    //// Keyboard events监听
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('keyboardDidShow', this.updateKeyboardSpace);
      DeviceEventEmitter.addListener('keyboardDidHide', this.resetKeyboardSpace);
    } else {
      DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
      DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
    }

  },

  componentWillUnmount: function () {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.removeAllListeners('keyboardDidShow');
      DeviceEventEmitter.removeAllListeners('keyboardDidHide');
    } else {
      DeviceEventEmitter.removeAllListeners('keyboardWillShow');
      DeviceEventEmitter.removeAllListeners('keyboardWillHide');
    }
  },

  // Keyboard actions
  updateKeyboardSpace: function (frames) {
    const keyboardSpace = frames.endCoordinates ? frames.endCoordinates.height : frames.end.height//获取键盘高度
    this.setState({
      keyboardSpace: keyboardSpace,
    });

    if (Platform.OS === 'android') {
      this.activeInput.measure((ox, oy, width, height, px, py) => {
        let keyBoardTop = screenHeight - this.state.keyboardSpace;
        let activeInputBottom = py + height;

        //Animated.timing(this.state.scrollHeight, {
        //    toValue: screenHeight - (this.state.keyboardSpace + 64),
        //    duration: 200,
        //}).start(()=> {
        //
        //});
        this.setState({
          scrollHeight: screenHeight - (this.state.keyboardSpace + 80),
        });

        //if (activeInputBottom > keyBoardTop + 15) {
        //this.refs['scroll'].scrollTo({y: 200});
        //}
      });


    } else {
      this.activeInput.measure((ox, oy, width, height, px, py) => {
        let keyBoardTop = screenHeight - this.state.keyboardSpace;
        let activeInputBottom = py + height;

        if (activeInputBottom > keyBoardTop + 15) {
          this.refs['scroll'].scrollTo({y: activeInputBottom - keyBoardTop + 10});
        }
      });
    }
  },

  resetKeyboardSpace: function () {

    if (Platform.OS === 'android') {
      this.setState({
        scrollHeight: screenHeight - 108
      });
    }

    this.refs['scroll'].scrollTo({y: 0})
  },


  termChangeHelp(term){
    if (term == null || term == 0) {
      return '';
    } else if (term % 365 == 0) {
      return term / 365
    } else if (term % 30 == 0) {
      return term / 30
    } else {
      return term
    }
  },

  termLimitChangeHelp(term){
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

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title='业务详情' actionButton={this.renderShutDownBiz}>
        <View style={{height:screenHeight-64,backgroundColor:'#f7f7f7'}}>
          <View style={{flex:1}}>
            <Animated.View
              style={{
                     height: this.state.scrollHeight,
                    }}
            >
              <ScrollView ref="scroll"
                          keyboardShouldPersistTaps={true}
                          keyboardDismissMode='none'
                          onLayout={() => {}}
              >
                {this.renderSelectOrg()}
                {this.renderBusinessType()}
                {this.renderTimeLimit()}
                {this.renderAmount()}
                {this.renderRate()}
                {this.renderAddImg()}
                {this.renderRemarks()}
                {this.renderModifyData()}
                {this.renderDownBizImage()}
              </ScrollView>
            </Animated.View>
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
      <View style={{flexDirection:'column',marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          {this.returnItem('业务类型:', this.state.marketInfo.bizCategoryDesc)}
        </View>
      </View>

    );
  },
  renderBusinessType: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <View style={{flexDirection:'row'}}>
            <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'方向'}</Text>
            <Text style={{color:'#dd656c'}}>{'*'}</Text>
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
            {this.returnItem('方\u3000\u3000向:', this.state.marketInfo.bizOrientationDesc)}
          </View>
        </View>
      );
    }
  },
  renderTimeLimit: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'期限'}</Text>
          <View style={{marginTop:10,flexDirection:'row'}}
                ref="timeLimitInputView"
                onLayout={() => {}}
          >
            <Input containerStyle={{backgroundColor:'white',borderRadius:5,marginLeft:10,height:40}}
                   iconStyle={{}} placeholderTextColor={DictStyle.colorSet.inputPlaceholderTextColor}
                   inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#7ac4e7'}}
                   placeholder='0-999' maxLength={3} field='termText' inputType="numeric"
                   onChangeText={this._onChangeText}
                   value={this.state.termText}
                   onFocus={
                 () => this.activeInput = this.refs['timeLimitInputView']
                 }
            />
            <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._termDataChange}/>

          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',marginTop:10}}>
          {this.returnItem('期\u3000\u3000限:', this.termLimitChangeHelp(this.state.marketInfo.term))}
        </View>
      );
    }
  },
  renderAmount: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'金额'}</Text>
          <View style={{marginTop:10,flexDirection:'row'}}
                ref="amountInputView"
                onLayout={() => {}}
          >
            <Input containerStyle={{backgroundColor:'white',borderRadius:5,marginLeft:10,height:40}}
                   iconStyle={{}} placeholderTextColor={DictStyle.colorSet.inputPlaceholderTextColor}
                   inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#7ac4e7'}}
                   placeholder='0-1000亿' maxLength={8} field='amountText' inputType="numeric"
                   onChangeText={this._onChangeText}
                   value={this.state.amountText}
                   onFocus={
                 () => this.activeInput = this.refs['amountInputView']
                 }
            />
            <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault} change={this._amountDataChange}/>

          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',marginTop:10}}>
          {this.returnItem('金\u3000\u3000额:',
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
          <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'利率'}</Text>
          <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}
            } ref="rateInputView"
                onLayout={() => {}}
          >
            <Input containerStyle={{backgroundColor:'white',borderRadius:5,marginLeft:10,height:40}}
                   iconStyle={{}} placeholderTextColor={DictStyle.colorSet.inputPlaceholderTextColor}
                   inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#7ac4e7'}}
                   placeholder='0-99.99' maxLength={5} field='rateText' inputType="numeric"
                   onChangeText={this._onChangeText}
                   value={this.state.rateText}
                   editable={false}
                   onFocus={
                 () => this.activeInput = this.refs['rateInputView']
                 }
            />
            <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'%'}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row',marginTop:10}}>
          {this.returnItem('利\u3000\u3000率:', this.state.marketInfo.rate == null || this.state.marketInfo.rate == 0 ? '--' : numeral(this.state.marketInfo.rate * 100).format('0,0.00') + '%')}
        </View>
      );
    }
  },
  renderAddImg: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'添加图片'}</Text>
          <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
            <View style={{width:((screenWidth-60)/5 + 10) * this.state.fileUrlList.length}}>
              <ListView style={{}} scrollEnabled={false} horizontal={true}
                        dataSource={ds.cloneWithRows(this.state.fileUrlList)} renderRow={this.renderImgItem}/>
            </View>
            {this.renderAdd()}
          </View>
        </View>

      )
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
          style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'#d3d5df'}}
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
        <Text style={{marginLeft:10,marginTop:5,fontSize:16, color:DictStyle.marketSet.fontColor}}>{'附件:'}</Text>
      );
    } else {
      return <View>
      </View>;
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
        allowsEditing={true}
        style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'#d3d5df'}}
      >
        <Lightbox imageSource={{uri:rowData}}
                  navigator={this.props.navigator}
                  deleteHeader={()=>{
                    let arr = this.state.fileUrlList;
                    _.pullAt(arr,rowID);
                    this.setState({fileUrlList: arr});
                    }}
        >
          <Image
            style={{flex:1,width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
            source={{uri:rowData}}
          />
        </Lightbox>
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
              style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:50, backgroundColor: 'white'}}>
              <Text style={{marginLeft:10,color:DictStyle.marketSet.fontColor}}>
                {'备注'}
              </Text>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{marginRight:10,color:'#d3d5df',flex:1,width:screenWidth-120}}
                >{(this.state.remarkText == '' || this.state.remarkText == null) ? '50字以内' : this.state.remarkText}
                </Text>
                <Icon style={{marginRight: 10}} name="ios-arrow-right" size={30} color='#a8afb3'/>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection:'row'}}>
          {this.returnItem('备\u3000\u3000注:', this.state.remarkText == null || this.state.remarkText.length == 0 ? '--' : this.state.remarkText)}
        </View>
      );
    }
  },
  renderModifyData: function () {
    return (
      <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
        {this.returnItem('更新时间:', this.state.lastModifyDate)}
      </View>

    )
  },
  renderDownBizImage: function () {
    if (this.state.marketInfo.status != 'ACTIVE') {
      return (
        <View>
          {this.renderImageTitle()}
          {this.renderImageItem()}
        </View>
      );
    }
  },
  renderSaveBtn: function () {
    if (this.state.marketInfo.status == 'ACTIVE') {
      return (
        <TouchableHighlight onPress={() => this._pressSave()} underlayColor='rgba(129,127,201,0)'>
          <View
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4b76df'}}>
            <Text style={{color:'white'}}>
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
      <View style={{marginLeft:10,flexDirection:'row',alignItems:'center',paddingVertical:8}}>
        <Text
          style={{alignSelf:'stretch',fontSize:16,color:DictStyle.marketSet.fontColor,width:Adjust.width(120)}}>{desc}</Text>
        <Text
          style={{alignSelf:'stretch',marginLeft:10,fontSize:16,color:(desc == '更新时间:')?
          DictStyle.marketSet.modifyDateColor:(desc == '备\u3000\u3000注:')?DictStyle.marketSet.amountColor:DictStyle.marketSet.fontColor,
          width:225/375*screenWidth}}>{value}</Text>
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
              (data) => {
                Alert('保存成功')
              },
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
          switch (index) {
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
      Alert('期限：请输入0-999间的整数');
    } else if (!Validation.isAmount(this.state.amountText)) {
      Alert('金额：请输入正确的浮点数');
    } else if (!Validation.isRate(this.state.rateText)) {
      Alert('利率：请输入0-99.99之间的两位小数');
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

    if (this.state.term % 360 == 0) {
      this.setState({
        term: this.state.term + (this.state.term / 360) * 5
      });
    }

    let {title, param}  = this.props;
    let params = {
      id: this.state.id,
      bizCategory: this.state.bizCategory,
      bizOrientation: this.state.bizOrientation,
      term: this.state.term,
      amount: this.state.amount,
      rate: this.state.rate / 100,
      fileUrlList: this.state.fileUrlList,
      remark: this.state.remarkText
    };
    let item = {
      bizCategory: (this.state.bizCategory == '') ? '资金业务' : this.state.bizCategory.displayName,
      bizOrientation: params.bizOrientation,
      term: params.term,
      amount: params.amount,
      rate: params.rate,
      remark: params.remark
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
    if (data.term == '' || data.term == 0) {
      dayNum = '--'
    } else if (data.term % 365 == 0) {
      dayNum = parseInt(data.term / 365) + '年';
    } else if (data.term % 30 == 0) {
      dayNum = parseInt(data.term / 30) + '月';
    } else {
      dayNum = data.term + '日';
    }
    let rate = data.rate == 0 ? '--' : (numeral(data.rate * 100).format('0,0.00') + '%');
    let remark = data.remark == '' ? '--' : data.remark;
    let shareContent = this.state.marketInfo.bizCategoryDesc + '  ' + '业务方向:  ' + (data.bizOrientation == 'IN' ? '收' : '出') + '\n'
      + '金额:' + amount + '\n' + '期限:' + dayNum + '\n' + '利率:' + rate + '\n' + '备注:' + remark
      + '\n' + '——来自爱资融APP';

    Share.open({
      share_text: shareContent,
      share_URL: Platform.OS === 'android' ? shareContent : 'http://www.izirong.com/fas',
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
          Alert('下架成功', ()=> {
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
  handleSendImage(uri, index) {
    this.props.exec(
      ()=> {
        return ImAction.uploadImage(uri)
          .then((response) => {
            let arr = this.state.fileUrlList;
            if (index > 5) {
              arr.push(response.fileUrl);
            } else {
              arr[index] = response.fileUrl;
            }
            this.setState({
              fileUrlList: arr
            });
          }).catch((errorData) => {
            console.log('Image upload error ' + JSON.stringify(errorData));
            throw errorData;
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
