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
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
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


let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let MarketStore = require('../../framework/store/marketStore');
let ImAction = require('../../framework/action/imAction');

let bizOrientationUnit = ['收', '出'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];

let Publish = React.createClass({
  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let categaryAndItem = MarketStore.getCategoryAndItem(filterItems);
    let item = this.removeDisplayCodeIsAllObj(categaryAndItem);

    let myCategory = AppStore.getCategory();
    let myItem = AppStore.getItem();

    return {
      filterItems: filterItems,
      bizOrientationDefault: 0,
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
      bizCategory: myCategory != null ? myCategory : item.length == 0 ? [] : item[0],
      bizItem: myItem != null ? myItem : item.length == 0 ? [] : item[0].itemArr[1],
      amount: 0,
      fileUrlList: []
    }
  },

  componentWillMount: function () {
  },

  render: function () {
    let {title, param}  = this.props;
    let isFromIM = param ? param.isFromIM : false;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='发布新业务' showBack={isFromIM} showBar={true}
                  actionButton={isFromIM ? null : this.renderToMyBiz}>
        <View style={{height:isFromIM ? screenHeight-64 : screenHeight-113,backgroundColor:'#153757'}}>
          <View style={{flex:1}}>
            <ScrollView>
              {this.renderSelectOrg()}
              {this.renderBusinessType()}
              {this.renderTimeLimit()}
              {this.renderAmount()}
              {this.renderRate()}
              {this.renderAddImg(isFromIM)}
              {this.renderRemarks(isFromIM)}
            </ScrollView>
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
          style={{width: screenWidth-20,marginLeft:10,marginTop:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
          <Text
            style={{fontSize:16,marginLeft:10,color:'white'}}>{(this.state.bizCategory == '' && this.state.bizItem == '') ? '资金业务 - 同业存款' : this.state.bizCategory.displayName + '-' + this.state.bizItem.displayName}</Text>
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
          <Text style={{marginLeft:10, color:'white'}}>{'方向'}</Text>
          <Text style={{color:'red'}}>{'*'}</Text>
        </View>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <SelectBtn dataList={bizOrientationUnit} defaultData={this.state.bizOrientationDefault}
                     change={this._bizOrientationDataChange}/>
        </View>
      </View>
    )
  },
  renderTimeLimit: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'期限'}</Text>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                 iconStyle={{}} placeholderTextColor='#325779'
                 inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                 placeholder='天数' maxLength={3} field='termText' inputType="numeric"
                 onChangeText={this._onChangeText}
          />
          <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._termDataChange}/>

        </View>
      </View>
    )
  },
  renderAmount: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'金额'}</Text>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                 iconStyle={{}} placeholderTextColor='#325779'
                 inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                 placeholder='1万-1000亿' maxLength={this.state.amountTextDigit} field='amountText' inputType="numeric"
                 onChangeText={this._onChangeText}
          />
          <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault} change={this._amountDataChange}/>

        </View>
      </View>
    )
  },
  renderRate: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'利率'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <Input containerStyle={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10,height:40}}
                 iconStyle={{}} placeholderTextColor='#325779'
                 inputStyle={{width:Adjust.width(100),height:40,marginLeft:10,color:'#ffd547'}}
                 placeholder='0-99.99' maxLength={5} field='rateText' inputType="numeric"
                 onChangeText={this._onChangeText}
          />
          <Text style={{marginLeft:10,fontWeight: 'bold', color:'white'}}>{'%'}</Text>
        </View>
      </View>
    )
  },
  renderAddImg: function (isFromIM) {
    if (!isFromIM) {
      return (
        <View style={{flexDirection:'column',marginTop:10}}>
          <Text style={{marginLeft:10, color:'white'}}>{'添加图片'}</Text>
          <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
            <ImagePicker
              type="all"
              onSelected={(response) => {this.handleSendImage(response)}}
              onError={(error) => this.handleImageError(error)}
              fileId="publish1"
              allowsEditing={true}
              title="选择图片"
              style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
            >
              <Image
                style={{flex:1,width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
                source={this.state.fileUrlList.length != 0?{uri:this.state.fileUrlList[0]}:require('../../image/market/addImage.png')}
              />
            </ImagePicker>
          </View>
        </View>
      )
    }
  },
  renderRemarks: function (isFromIM) {
    if (!isFromIM) {
      return (
        <View style={{marginTop:10,marginBottom:10}}>
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
      )
    }
  },
  renderReleaseBtn: function (isFromIM) {
    return (
      <View style={{height:44}}>
        <Button
          containerStyle={{height:44,borderRadius:0}}
          style={{fontSize: 15, color: '#ffffff'}}
          disabled={this.state.disabled}
          onPress={() => this._pressPublish()}
        >
          {isFromIM ? '发送' : '发布'}
        </Button>
      </View>
    )
  },

  renderToMyBiz: function () {
    return (
      <TouchableOpacity style={{width: 150 ,marginLeft: -20}} onPress={()=>this.toMyBiz()}>
        <Text style={{color: '#ffffff'}}>我的业务</Text>
      </TouchableOpacity>
    );
  },

  _pressPublish: function () {
    if (!Validation.isTerm(this.state.termText)) {
      Alert('格式不合法：请输入整数');
    } else if (!Validation.isAmount(this.state.amountText)) {
      Alert('格式不合法：请输入整数');
    } else if (!Validation.isRate(this.state.rateText)) {
      Alert('格式不合法：请输入0-99.99之间的小数');
    } else if (this.state.amount > 100000000000) {
      Alert('您输入的金额过大');
    } else {
      this.addBizOrder();
    }
  },

  callBackCategoryAndItem: function (category, item) {
    this.setState({
      bizCategory: category,
      bizItem: item
    });
    AppStore.saveCategory(category);
    AppStore.saveItem(item);
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
            callBackCategoryAndItem: this.callBackCategoryAndItem
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
      navigator.push({comp: MyBusiness, param: {fromPublish: true}});
    }
  },

  addBizOrder: function () {
    dismissKeyboard();
    let {title, param}  = this.props;
    let params = {
      id: '',
      term: this.state.term,
      rate: this.state.rate / 100,
      remark: this.state.remark,
      bizOrientation: this.state.bizOrientation,
      bizCategory: this.state.bizCategory.displayCode,
      bizItem: this.state.bizItem.displayCode,
      amount: this.state.amount,
      fileUrlList: this.state.fileUrlList
    };
    if (param ? param.isFromIM : false) {
      let item = {
        bizCategory: (this.state.bizCategory == '' && this.state.bizItem == '') ? '资金业务 - 同业存款' : this.state.bizCategory.displayName + '-' + this.state.bizItem.displayName,
        bizOrientation: params.bizOrientation,
        term: params.term,
        amount: params.amount,
        rate: params.rate
      };
      this.props.navigator.pop();
      param.callBack(item);
    } else {
      this.props.exec(
        ()=> {
          return MarketAction.addBizOrder(params).then((response)=> {
            Alert('发布成功');
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

  handleSendImage(uri) {
    this.props.exec(
      ()=> {
        return ImAction.uploadImage(uri)
          .then((response) => {
            let arr = [];
            arr.push(response.fileUrl);
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
  },

  removeDisplayCodeIsAllObj: function (arr) {
    let itemArr = [];
    if (!!arr) {
      arr.forEach(function (item) {
        if (item.displayCode != 'ALL') {
          itemArr.push(item);
        }
      });
      return (
        itemArr
      );
    }
  }

});

module.exports = Publish;
