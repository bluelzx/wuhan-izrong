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
  InteractionManager
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


let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let ImAction = require('../../framework/action/imAction');

let bizOrientationUnit = ['收', '出'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];

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
      rateText: marketInfo.rate == null || marketInfo.rate == 0 ? '' : (marketInfo.rate * 100).toString(),
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
        <TouchableOpacity style={{width:75}}
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
                   placeholder='1万-1000亿' maxLength={8} field='amountText' inputType="numeric"
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
              this.state.marketInfo.amount < 100000000 ? numeral(this.state.marketInfo.amount / 10000).format('0,0') + '万' :
              numeral(this.state.marketInfo.amount / 100000000).format('0,0') + '亿')
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
                   placeholder='0-99.99' maxLength={3} field='rateText' inputType="numeric"
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
          {this.returnItem('利率:', this.state.marketInfo.rate == null || this.state.marketInfo.rate == 0 ? '--' : this.state.marketInfo.rate * 100 + '%')}
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
            <ImagePicker
              type="all"
              onSelected={(response) => {this.handleSendImage(response)}}
              onError={(error) => this.handleImageError(error)}
              fileId="myBiz1"
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
      );
    } else {
      return (
        <View>
          {this.renderImageTitle()}
          {this.renderImageItem()}
        </View>
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

  _pressSave: function () {
    if (!Validation.isTerm(this.state.termText)) {
      Alert('期限：请输入大于0的整数');
    } else if (!Validation.isAmount(this.state.amountText)) {
      Alert('金额：请输入大于0的整数');
    } else if (!Validation.isRate(this.state.rateText)) {
      Alert('利率：请输入0-99.99之间的小数');
    } else if (this.state.amount > 100000000000) {
      Alert('您输入的金额过大');
    } else {
      this.updateBizOrder();
    }

  },
  shutDownBiz: function () {
      Alert('你确定下架该业务吗?',() => {
          this.downselfBizOrder(this.state.marketInfo.id)
      },()=>{});
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
          console.log(detail);
          {
            this.setStsteWithBizDetail(response);
          }
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },

  requestParameter: function () {
    this.setState({
      term: (this.state.termDefault == 0) ? Number(value) : (this.state.termDefault == 1) ? Number(value) * 30 : Number(value) * 365,
      amount: (this.state.amountDefault == 0) ? Number(value) * 10000 : Number(value) * 100000000,
      rate: Number(this.state.rateText) / 100
    });
  },

  updateBizOrder: function () {
    this.props.exec(
      ()=> {
        return MarketAction.updateBizOrder({
            id: this.state.id,
            bizCategory: this.state.bizCategory,
            bizItem: this.state.bizItem,
            bizOrientation: this.state.bizOrientation,
            term: this.state.term,
            amount: this.state.amount,
            rate: this.state.rate / 100,
            fileUrlList: this.state.fileUrlList,
            remark: this.state.remarkText
          }
        ).then((response)=> {
          Alert('保存成功',()=>this.props.navigator.pop());
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },

  downselfBizOrder: function (id) {
    this.props.exec(
      ()=> {
        return MarketAction.downselfBizOrder({
            orderId: id
          }
        ).then((response)=> {
          Alert('下架成功',()=>this.props.navigator.pop());
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
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
  }


});

module.exports = MyBizDetail;
