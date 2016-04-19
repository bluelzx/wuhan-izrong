/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
var {
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

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
var NavBarView = require('../../framework/system/navBarView');
var SelectBtn = require('./selectBtn');
var Remarks = require('./remarks');
var SelectBusiness1 = require('./selectBusiness1');

let MarketAction = require('../../framework/action/marketAction');

var bizOrientationUnit = ['出', '收'];
var termUnit = ['日', '月', '年'];
var amountUnit = ['万', '亿'];

var WhitePage = React.createClass({
  getInitialState(){
    return {
      bizOrientationDefault: 0,
      termDefault: 0,
      amountDefault: 0,
      //networt
      term:33,
      rate:0.03,
      remark:'这里就只是一个备注',
      bizOrientation:'天津银行',
      bizCategory:'MCA',
      bizItem:'MCA_ABS',
      amount:10000000,
      fileIds:[
        ''
      ]
    }
  },

  componentWillMount: function () {
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='发布' showBack={false} showBar={true}>
        <View style={{height:screenHeight-113,backgroundColor:'#153757'}}>
          <View style={{flex:1}}>
            <ScrollView>
              {this.renderSelectOrg()}
              {this.renderBusinessType()}
              {this.renderTimeLimit()}
              {this.renderAmount()}
              {this.renderRate()}
              {this.renderAddImg()}
              {this.renderRemarks()}
            </ScrollView>
            {this.renderReleaseBtn()}
          </View>
        </View>
      </NavBarView>
    );
  },
  _dataChange1 (index) {
    this.setState({
      bizOrientationDefault: index
    })
  },
  _dataChange2 (index) {
    this.setState({
      termDefault: index
    })
  },
  _dataChange3 (index) {
    this.setState({
      amountDefault: index
    })
  },
  renderSelectOrg: function () {
    return (
      <TouchableOpacity onPress={()=>this.toPage(SelectBusiness1)} activeOpacity={0.8} underlayColor="#f0f0f0">
        <View
          style={{width: screenWidth-20,marginLeft:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
          <Text style={{fontSize:16,marginLeft:10,color:'white'}}>{'选择业务类型'}</Text>
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
          <Text style={{marginLeft:10, color:'white',}}>{'方向'}</Text>
          <Text style={{color:'red',}}>{'*'}</Text>
        </View>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <SelectBtn dataList={bizOrientationUnit} defaultData={this.state.bizOrientationDefault} change={this._dataChange1}/>
        </View>
      </View>
    )
  },
  renderTimeLimit: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white',}}>{'期限'}</Text>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <View style={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10}}>
            <TextInput
              placeholder={'天数'}
              placeholderTextColor='#325779'
              returnKeyType="search"
              maxLength={8}
              style={{width:100,height:40,marginLeft:10,color:'#ffd547'}}/>
          </View>
          <SelectBtn dataList={termUnit} defaultData={this.state.termDefault} change={this._dataChange2}/>

        </View>
      </View>
    )
  },
  renderAmount: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white',}}>{'金额'}</Text>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <View style={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10}}>
            <TextInput
              placeholder={'1万-1000亿'}
              placeholderTextColor='#325779'
              returnKeyType="search"
              maxLength={8}
              style={{width:100,height:40,marginLeft:10,color:'#ffd547',}}/>
          </View>
          <SelectBtn dataList={amountUnit} defaultData={this.state.amountDefault} change={this._dataChange3}/>

        </View>
      </View>
    )
  },
  renderRate: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white',}}>{'利率'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <View style={{backgroundColor:'#0a1926',borderRadius:5,marginLeft:10}}>
            <TextInput
              placeholder={'0-100.00'}
              placeholderTextColor='#325779'
              returnKeyType="search"
              maxLength={8}
              style={{width:100,height:40,marginLeft:10,color:'#ffd547'}}/>
          </View>
          <Text style={{marginLeft:10,fontWeight: 'bold', color:'white',}}>{'%'}</Text>
        </View>
      </View>
    )
  },
  renderAddImg: function () {
    return (
      <View style={{flexDirection:'column',marginTop:10}}>
        <Text style={{marginLeft:10, color:'white',}}>{'添加图片'}</Text>
        <View style={{alignItems:'center',marginTop:10,flexDirection:'row'}}>
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}/>
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}/>
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}/>
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}/>
          <Image
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}
            source={require('../../image/market/next.png')}/>

        </View>
      </View>
    )
  },
  renderRemarks: function () {
    return (
      <View style={{marginTop:10}}>
        <TouchableHighlight onPress={() => this.toPage(Remarks)} underlayColor='rgba(129,127,201,0)'>
          <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height: 40, backgroundColor: '#102a42'}}>
            <Text style={{marginLeft:10, fontWeight: 'bold', color:'white',}}>
              {'备注'}
            </Text>
            <View>
              <Text style={{marginRight:10, fontWeight: 'bold', color:'#325779',}}>
                {'20字以内'}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  },
  renderReleaseBtn: function () {
    return (
      <TouchableHighlight onPress={() => this._pressPublish()} underlayColor='rgba(129,127,201,0)'>
        <View
          style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
          <Text style={{fontWeight: 'bold', color:'white',}}>
            {'发布'}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },
  _pressPublish: function () {
    {
      this.addBizOrder();
    }
  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  addBizOrder: function () {
    this.props.exec(
      ()=> {
        return MarketAction.addBizOrder({
          id:'',
          term:33,
          rate:0.03,
          remark:'这里就只是一个备注',
          bizOrientation:'天津银行',
          bizCategory:'MCA',
          bizItem:'MCA_ABS',
          amount:10000000,
          fileIds:[
            ''
          ]
        }).then((response)=> {
          let arr = new Array();
          arr = (JSON.stringify(response));
          console.log(arr);
        }).catch(
          (errorData) => {
            throw errorData;
          }
        );
      }
    );
  },
});

module.exports = WhitePage;
