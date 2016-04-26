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
  }=React;

let { Alert } = require('mx-artifacts');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let NavBarView = require('../../framework/system/navBarView');
let SelectBtn = require('../publish/selectBtn');
let Remarks = require('../publish/remarks');
let ImagePicker = require('../../comp/utils/imagePicker');
let DateHelper = require('../../comp/utils/dateHelper');
let Input = require('../../comp/utils/input');
let Adjust = require('../../comp/utils/adjust');


let AppStore = require('../../framework/store/appStore');
let MarketAction = require('../../framework/action/marketAction');
let ImAction = require('../../framework/action/imAction');

let bizOrientationUnit = ['出', '收'];
let termUnit = ['日', '月', '年'];
let amountUnit = ['万', '亿'];

let MyBizDetail = React.createClass({
  getInitialState(){
    let filterItems = AppStore.getFilters().filterItems;
    let marketInfo = this.props.param.marketInfo;
    return {
      detailData: '',
      bizOrderOwnerBean: '',
      marketInfo: marketInfo,
      filterItems: filterItems,
      bizOrientationDefault: 0,
      termDefault: 0,
      amountDefault: 0,
      termText: '',
      amountText: '',
      rateText: '',
      remarkText: '',
      lastModifyDate: '',
      //networt
      id: '',
      term: '',
      rate: '',
      remark: '',
      bizOrientation: '',
      bizCategory: '',
      bizItem: '',
      amount: '',
      fileUrlList: []
    }
  },

  componentWillMount: function () {
    {
      this.getBizOrderByCreator(this.state.marketInfo.id);
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
    if(key == 'termText'){
      this.setState({term: (this.state.termDefault == 0) ? Number(value) : (this.state.termDefault == 1) ? Number(value) * 30 : Number(value) * 365});
    }else if (key == 'amountText'){
      this.setState({amount: (this.state.amountDefault == 0) ? Number(value) * 10000 : Number(value) * 100000000});
    }else {
      this.setState({rate:Number(value)});
    }
    if (this.state.termText.length == 0 || this.state.amountText.length == 0 || this.state.rateText.length == 0) {
      this.setState({disabled: true});
    } else {
      this.setState({disabled: false});
    }
  },
  renderShutDownBiz: function () {
    return (
      <TouchableOpacity style={{width:75}}
                        onPress={()=>this.shutDownBiz()}>
        <Text style={{color:'#ffffff'}}>{'下架'}</Text>
      </TouchableOpacity>
    );
  },
  renderSelectOrg: function () {
    return (
      <View
        style={{marginTop:10,height:36,alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
        <Text
          style={{fontSize:16,marginLeft:10,color:'white'}}>{'业务类型: ' + this.state.detailData.bizCategoryDesc + '-' + this.state.detailData.bizItemDesc}</Text>
      </View>
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
                 value={this.state.termText}
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
                 placeholder='1万-1000亿' maxLength={8} field='amountText' inputType="numeric"
                 onChangeText={this._onChangeText}
                 value={this.state.amountText}
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
                 placeholder='0-100.00' maxLength={3} field='rateText' inputType="numeric"
                 onChangeText={this._onChangeText}
                 value={this.state.rateText}
          />
          <Text style={{marginLeft:10,fontWeight: 'bold', color:'white'}}>{'%'}</Text>
        </View>
      </View>
    )
  },
  renderAddImg: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white'}}>{'添加图片'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <ImagePicker
            type="all"
            onSelected={(response) => {this.handleSendImage(response)}}
            onError={(error) => this.handleImageError(error)}
            title="选择图片"
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,borderRadius:5,borderWidth:1,borderColor:'white'}}
          >
            <Image
              style={{flex:1,width:(screenWidth-60)/5-2,height:(screenWidth-60)/5-2,borderRadius:5}}
              source={{uri:this.state.fileUrlList[0]}}
            />
          </ImagePicker>
        </View>
      </View>
    )
  },
  renderRemarks: function () {
    return (
      <View style={{marginTop:10}}>
        <TouchableHighlight onPress={() => this.toRemarks(Remarks)} underlayColor='rgba(129,127,201,0)'>
          <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height: 40, backgroundColor: '#102a42'}}>
            <Text style={{marginLeft:10, fontWeight: 'bold', color:'white'}}>
              {'备注'}
            </Text>
            <View>
              <Text style={{marginRight:10, fontWeight: 'bold', color:'#325779'}}
                    numberOfLines={1}>{(this.state.remarkText == '') ? '20字以内' : this.state.remarkText}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  },
  renderModifyData: function () {
    return (
      <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
        <Text style={{marginLeft:10,color:'white'}}>{'最近修改时间:'}</Text>
        <Text style={{marginLeft:10,color:'#ffd547'}}>{this.state.lastModifyDate}</Text>
      </View>
    )
  },
  renderSaveBtn: function () {
    return (
      <TouchableHighlight onPress={() => this._pressSave()} underlayColor='rgba(129,127,201,0)'>
        <View
          style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
          <Text style={{fontWeight: 'bold', color:'white'}}>
            {'保存'}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },
  _pressSave: function () {
    {
      this.updateBizOrder();
    }
  },
  shutDownBiz: function () {
    {
      this.downselfBizOrder(this.state.marketInfo.id)
    }
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
          callBackRemarks: this.callBackRemarks
        },
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

  setStsteWithBizDetail: function (response) {
    let t = new Date(response.lastModifyDate);
    this.setState({
      id: response.id,
      detailData: response,
      bizOrderOwnerBean: response.bizOrderOwnerBean,
      fileUrlList: response.fileIds,
      bizOrientation: response.bizOrientation,
      bizOrientationDefault: (response.bizOrientation == 'IN') ? 0 : 1,
      termText: (response.term < 30) ? ((response.term).toString()) : (response.term < 365) ? (response.term / 30).toString() : (response.term / 365).toString(),
      termDefault: (response.term < 30) ? 0 : (response.term < 365) ? 1 : 2,
      amountText: (response.amount >= 100000000) ? (response.amount / 100000000).toString() : (response.amount / 10000).toString(),
      amountDefault: (response.amount >= 100000000) ? 0 : 1,
      rateText: (response.rate*100).toString(),
      remarkText: response.remark,
      lastModifyDate: DateHelper.formatBillDetail(t),
      bizCategory: response.bizCategory,
      bizItem: response.bizItem,
    })
  },

  updateBizOrder: function () {
    this.props.exec(
      ()=> {
        return MarketAction.updateBizOrder({
            id: this.state.id,
            bizCategory: this.state.bizCategory,
            bizItem: this.state.bizItem,
            bizOrientation: this.state.bizOrientation,
            term: this.state.termText,
            amount: this.state.amountText,
            rate: this.state.rateText,
            fileUrlList: this.state.fileUrlList,
            remark: this.state.remarkText
          }
        ).then((response)=> {
          Alert('保存成功');
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
          Alert('下架成功')
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },

});

module.exports = MyBizDetail;
