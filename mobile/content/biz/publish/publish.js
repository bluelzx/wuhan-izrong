/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  ScrollView,
  ActionSheetIOS,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  CameraRoll,
  ToastAndroid,
  DeviceEventEmitter,
  Animated
  }=React;

let { Alert ,Button } = require('mx-artifacts');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let NavBarView = require('../../framework/system/navBarView');
let SelectBtn = require('./selectBtn');
let Remarks = require('./remarks');
let SelectBusiness1 = require('./selectBusiness1');
let ImagePicker = require('../../comp/utils/imagePicker');
let Input = require('../../comp/utils/input');
let Adjust = require('../../comp/utils/adjust');
let Validation = require('../../comp/utils/validation');
let MyBusiness = require('../home/myBusiness');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let DictStyle = require('../../constants/dictStyle');
let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let ImAction = require('../../framework/action/imAction');
let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;
let bizOrientationUnit = ['收', '出'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];
import Share from 'react-native-share';
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let Lightbox = require('../../comp/lightBox/Lightbox');
let Icon = require('react-native-vector-icons/Ionicons');
let { MARKET_CHANGE } = require('../../constants/dictEvent');

let Publish = React.createClass({
  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let category = MarketStore.getFilterOptions(filterItems, 'bizCategory');
    let categoryArr = this.deleteFirstObj(category.options);

    let myCategory = AppStore.getCategory();

    return {
      filterItems: filterItems,
      bizOrientationDefault: 3,
      termDefault: 0,
      amountDefault: 0,
      termText: '',
      amountText: '',
      amountTextDigit: 8,
      rateText: '',
      remarkText: '',
      disabled: false,
      //networt
      term: '',
      rate: '',
      remark: '',
      bizOrientation: 'IN',
      bizCategory: myCategory != null ? myCategory : categoryArr.length == 0 ? [] : categoryArr[0],
      amount: 0,
      fileUrlList: [],

      keyboardSpace: 0,
      scrollHeight: screenHeight - 108
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

  componentDidMount: function () {
    //// Keyboard events监听
    if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener('keyboardDidShow', this.updateKeyboardSpace);
      DeviceEventEmitter.addListener('keyboardDidHide', this.resetKeyboardSpace);
    } else {
      DeviceEventEmitter.addListener('keyboardWillShow', this.updateKeyboardSpace);
      DeviceEventEmitter.addListener('keyboardWillHide', this.resetKeyboardSpace);
    }

    AppStore.addChangeListener(this._onChange, MARKET_CHANGE);
  },

  componentWillUnmount: function () {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.removeAllListeners('keyboardDidShow');
      DeviceEventEmitter.removeAllListeners('keyboardDidHide');
    } else {
      DeviceEventEmitter.removeAllListeners('keyboardWillShow');
      DeviceEventEmitter.removeAllListeners('keyboardWillHide');
    }

    AppStore.removeChangeListener(this._onChange, MARKET_CHANGE);
  },

  _onChange () {
    let myCategory = AppStore.getCategory();
    this.setState({
      bizCategory: myCategory != null ? myCategory : categoryArr.length == 0 ? [] : categoryArr[0]
    })
  },

  // Keyboard actions
  updateKeyboardSpace: function (frames) {
    const keyboardSpace = frames.endCoordinates ? frames.endCoordinates.height : frames.end.height//获取键盘高度
    this.setState({
      keyboardSpace: keyboardSpace,
    });

      //if (Platform.OS === 'android') {
      //  this.activeInput.measure((ox, oy, width, height, px, py) => {
      //    let keyBoardTop = screenHeight - this.state.keyboardSpace;
      //    let activeInputBottom = py + height;
      //
      //    //Animated.timing(this.state.scrollHeight, {
      //    //    toValue: screenHeight - (this.state.keyboardSpace + 64),
      //    //    duration: 200,
      //    //}).start(()=> {
      //    //
      //    //});
      //    //this.setState({
      //    //  scrollHeight: screenHeight - (this.state.keyboardSpace + 80),
      //    //});
      //
      //    //if (activeInputBottom > keyBoardTop + 15) {
      //    //this.refs['scroll'].scrollTo({y: 200});
      //    //}
      //  });
      //
      //
      //} else {
      //  this.activeInput.measure((ox, oy, width, height, px, py) => {
      //    let keyBoardTop = screenHeight - this.state.keyboardSpace;
      //    let activeInputBottom = py + height;
      //
      //    if (activeInputBottom > keyBoardTop + 15) {
      //      this.refs['scroll'].scrollTo({y: activeInputBottom - keyBoardTop + 10});
      //    }
      //  });
      //}
  },

  resetKeyboardSpace: function () {

    if (Platform.OS === 'android') {
      this.setState({
        scrollHeight: screenHeight - 108
      });
    }

    this.refs['scroll'].scrollTo({y: 0})
  },

  render: function () {
    let {title, param}  = this.props;
    let isFromIM = param && param.isFromIM;
    let isFromMyBusiness = param ? param.isFromMyBusiness : false;
    return (
      <NavBarView navigator={this.props.navigator} title={isFromIM ? '业务信息' : '发布新业务'}
                  actionButton={isFromIM || isFromMyBusiness ? null : this.renderToMyBiz}>
        <View style={{height: screenHeight - 64 ,backgroundColor:DictStyle.colorSet.content}}>
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
                {this.renderAddImg(isFromIM)}
                {this.renderRemarks(isFromIM)}
              </ScrollView>
            </Animated.View>
            {this.renderReleaseBtn(isFromIM)}
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
      amount: (index == 0) ? Number(this.state.amountText) * 10000 : Number(this.state.amountText) * 100000000,
      amountTextDigit: (index == 0) ? 8 : 4,
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
  },

  renderSelectOrg: function () {
    return (
      <TouchableOpacity onPress={()=>this.toPage(SelectBusiness1)} activeOpacity={0.8} underlayColor="#f0f0f0">
        <View
          style={{width: screenWidth-20,marginLeft:10,marginTop:10,borderRadius:5,height:36,backgroundColor:'#4b76df',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
          <Text
            style={{fontSize:16,marginLeft:10,color:'white'}}>{(this.state.bizCategory == '') ? '资金业务' : this.state.bizCategory.displayName}</Text>
          <Image style={{margin:10,width:16,height:16}}
                 source={require('../../image/market/next.png')}
          />
        </View>
      </TouchableOpacity>
    )
  },
  renderBusinessType: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'方向'}</Text>
          <Text style={{color:'#dd656c'}}>{'*'}</Text>

            <View style={{marginLeft:10,flexDirection:'row'}}>
                <SelectBtn dataList={bizOrientationUnit} defaultData={this.state.bizOrientationDefault}
                           change={this._bizOrientationDataChange}/>
            </View>

        </View>
      </View>
    )
  },
  renderTimeLimit: function () {
    return (
        <View style={{flexDirection:'column',marginTop:5}}>
            <View style={{marginTop:5,flexDirection:'row'}}
              ref="timeLimitInputView"
              onLayout={() => {}}
        >
          <Input containerStyle={{backgroundColor:'white',borderRadius:5,marginLeft:10,height:40}}
                 iconStyle={{}} placeholderTextColor={DictStyle.colorSet.inputPlaceholderTextColor}
                 inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#7ac4e7'}}
                 placeholder='期限' maxLength={3} field='termText' inputType="numeric"
                 onChangeText={this._onChangeText}
                 onFocus={
                 () => this.activeInput = this.refs['timeLimitInputView']
                 }
          />
          <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._termDataChange}/>

        </View>
      </View>
    )
  },
  renderAmount: function () {
    return (
        <View style={{flexDirection:'column',marginTop:5}}>
            <View style={{marginTop:5,flexDirection:'row'}}
              ref="amountInputView"
              onLayout={() => {}}
        >
          <Input containerStyle={{backgroundColor:'white',borderRadius:5,marginLeft:10,height:40}}
                 iconStyle={{}} placeholderTextColor={DictStyle.colorSet.inputPlaceholderTextColor}
                 inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#7ac4e7'}}
                 placeholder='金额' maxLength={this.state.amountTextDigit} field='amountText'
                 inputType="numeric"
                 onChangeText={this._onChangeText}
                 onFocus={
                 () => this.activeInput = this.refs['amountInputView']
                 }
          />
          <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault}
                     change={this._amountDataChange}/>

        </View>
      </View>
    )
  },
  renderRate: function () {
    return (
        <View style={{flexDirection:'column',marginTop:5}}>
            <View style={{alignItems:'center',marginTop:5,flexDirection:'row'}}
              ref="rateInputView"
              onLayout={() => {}}
        >
          <Input containerStyle={{backgroundColor:'white',borderRadius:5,marginLeft:10,height:40}}
                 iconStyle={{}} placeholderTextColor={DictStyle.colorSet.inputPlaceholderTextColor}
                 inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#7ac4e7'}}
                 placeholder='利率' maxLength={5} field='rateText' inputType="numeric"
                 onChangeText={this._onChangeText}
                 onFocus={
                 () => this.activeInput = this.refs['rateInputView']
                 }
          />
          <Text style={{marginLeft:10,fontWeight: 'bold', color:DictStyle.marketSet.fontColor}}>{'%'}</Text>
        </View>
      </View>
    )
  },
  renderAddImg (isFromIM) {
    if (!isFromIM) {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:DictStyle.marketSet.fontColor}}>{'添加图片'}</Text>
          <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
            <View style={{width:((screenWidth-60)/5 + 10) * this.state.fileUrlList.length}}>
              <ListView style={{}} scrollEnabled={false} horizontal={true}
                        dataSource={ds.cloneWithRows(this.state.fileUrlList)}
                        renderRow={this.renderImgItem}/>
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
  renderImgItem: function (rowData, sectionID, rowID) {
    return (
      <ImagePicker
        longPress={() => this._longPress(rowID)}
        type="all"
        onSelected={(response) => {this.handleSendImage(response, rowID)}}
        onError={(error) => this.handleImageError(error)}
        title="选择图片"
        fileId="publish1"
        allowsEditing={true}
        style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
      >
        <Lightbox imageSource={{uri:rowData}}
                  navigator={this.props.navigator}
                  underlayColor="#f7f7f7"
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
  renderRemarks: function (isFromIM) {
    if (!isFromIM) {
      return (
        <View style={{marginTop:10,marginBottom:10}}>
          <TouchableHighlight onPress={() => this.toRemarks(Remarks)} underlayColor='rgba(129,127,201,0)'>
            <View
              style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height: 50, backgroundColor: 'white'}}>
              <Text style={{marginLeft:10,color:DictStyle.marketSet.fontColor}}>
                {'备注'}
              </Text>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text
                  style={{marginRight:10,color:(this.state.remarkText == '') ? '#d3d5df' : DictStyle.marketSet.fontColor,flex:1,width:screenWidth-120}}
                >{(this.state.remarkText == '') ? '50字以内' : this.state.remarkText}
                </Text>
                <Icon style={{marginRight: 10}} name="ios-arrow-right" size={30} color='#a8afb3'/>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  },
  renderReleaseBtn: function (isFromIM) {
    return (
      <View style={{height:44}}>
        <Button
          containerStyle={{height:44,borderRadius:0,backgroundColor:"#4b76df"}}
          style={{fontSize: 15, color: '#ffffff',}}
          disabled={this.state.disabled}
          onPress={() => this._pressPublish()}
        >
          {'发布'}
        </Button>
      </View>
    )
  },

  renderToMyBiz: function () {
    return (
      <TouchableOpacity style={{marginLeft: -20}} onPress={()=>this.toMyBiz()}>
        <Text style={{color: '#ffffff'}}>我的业务</Text>
      </TouchableOpacity>
    );
  },

  _pressPublish: function () {

    if (!Validation.isTerm(this.state.termText)) {
      Alert('期限：请输入0-999间的整数');
    } else if (!Validation.isAmount(this.state.amountText)) {
      Alert('金额：请输入正确的浮点数');
    } else if (!Validation.isRate(this.state.rateText)) {
      Alert('利率：请输入0-99.99之间的小数');
    } else if (this.state.amount > 100000000000) {
      Alert('您输入的金额过大');
    } else if (this.state.bizOrientationDefault === 3) {
      Alert('请选择业务方向');
    } else {
      this.addBizOrder();
    }
  },

  callBackCategory: function (category) {
    this.setState({
      bizCategory: category,
    });
    AppStore.saveCategory(category);
  },

  callBackRemarks: function (remarkText) {
    this.setState({
      remark: remarkText,
      remarkText: remarkText
    })
  },

  toPage: function (name) {
    if (this.state.filterItems.length != 0) {
      const { navigator } = this.props;
      if (navigator) {
        navigator.push({
          comp: name,
          param: {
            filterItems: this.state.filterItems,
            callBackCategory: this.callBackCategory
          }
        })
      }
    }
  },

  toRemarks: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          callBackRemarks: this.callBackRemarks,
          remarkText: this.state.remarkText
        },
      })
    }
  },

  toMyBiz: function () {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: MyBusiness, param: {fromPublish: true, isFromPublish: true}});
    }
  },

  addBizOrder: function () {

    dismissKeyboard();

    if (this.state.term % 360 == 0) {
      this.setState({
        term: this.state.term + (this.state.term / 360) * 5
      });
    }

    let {title, param}  = this.props;
    let params = {
      id: '',
      term: this.state.term,
      rate: this.state.rate / 100,
      remark: this.state.remark,
      bizOrientation: this.state.bizOrientation,
      bizCategory: this.state.bizCategory.displayCode,
      amount: this.state.amount,
      fileUrlList: this.state.fileUrlList
    };
    let item = {
      bizCategory: (this.state.bizCategory == '') ? '资金业务' : this.state.bizCategory.displayName,
      bizOrientation: params.bizOrientation,
      term: params.term,
      amount: params.amount,
      rate: params.rate,
      remark: params.remark
    };
    if (param && param.isFromIM) {
      this.props.navigator.pop();
      param.callBack(item);
    } else {
      this.props.exec(
        ()=> {
          return MarketAction.addBizOrder(params).then((response)=> {
            Alert('发布成功, 是否分享?', () => {
              this.shareDialog(item)
            }, () => {
            }, '分享', '不分享');
            this.props.navigator.resetTo({comp: 'tabView', tabName: 'market'});
          }).catch(
            (errorData) => {
              throw errorData;
            }
          );
        }
      );
    }
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
    let shareContent = data.bizCategory + '  ' + '业务方向:  ' + (data.bizOrientation == 'IN' ? '收' : '出')  + '\n'
      + '金额:' + amount  + '\n' + '期限:' + dayNum + '\n'  + '利率:' + rate + '\n' + '备注:' + remark
      + '\n' + '——来自爱资融APP';

    Share.open({
      share_text: shareContent,
      share_URL: Platform.OS === 'android' ? shareContent : 'http://www.izirong.com/fas',
      title: "Share Link"
    }, (e) => {
      console.log(e);
    });
  },

  handleSendImage(uri, index) {
    this.props.exec(() => {
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
        }).catch((errorData) => {
          throw errorData;
        });
    });
  },

  handleImageError(error) {
    console.log('Image select error ' + JSON.stringify(error));
    Alert('图片选择失败');
  }

});

module.exports = Publish;
