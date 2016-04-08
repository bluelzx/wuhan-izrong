/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

var React = require('react-native');
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

var dataList1 = ['出', '收'];
var dataList2 = ['日', '月', '年'];
var dataList3 = ['万', '亿'];

var WhitePage = React.createClass({
  getInitialState(){
    return {
      defaultData1: 0,
      defaultData2: 0,
      defaultData3: 0,
    }
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='发布' showBack={false} showBar={true}>
        <View style={{height:screenHeight-64,backgroundColor:'#153757'}}>
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
      </NavBarView>
    );
  },
  _dataChange1 (index) {
    this.setState({
      defaultData1: index
    })
  },
  _dataChange2 (index) {
    this.setState({
      defaultData2: index
    })
  },
  _dataChange3 (index) {
    this.setState({
      defaultData3: index
    })
  },
  renderSelectOrg: function () {
    return (
      <TouchableOpacity onPress={()=>this.toPage(SelectBusiness1)} activeOpacity={0.8} underlayColor="#f0f0f0">
        <View
          style={{width: screenWidth-20,margin:10,borderRadius:5,height:36,backgroundColor:'#4fb9fc',alignItems: 'center',justifyContent:'space-between',flexDirection: 'row'}}>
          <Text style={{fontSize:16,marginLeft:10,color:'white'}}>{'选择发布机构'}</Text>
          <Image style={{margin:10,width:16,height:16}}
                 source={require('../../image/market/next.png')}
          />
        </View>
      </TouchableOpacity>
    )
  },
  renderBusinessType: function () {
    return (
      <View style={{flexDirection:'column'}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{marginLeft:10, color:'white',}}>{'方向'}</Text>
          <Text style={{color:'red',}}>{'*'}</Text>
        </View>
        <View style={{marginTop:10,flexDirection:'row'}}>
          <SelectBtn dataList={dataList1} defaultData={this.state.defaultData1} change={this._dataChange1}/>
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
              style={{width:100,height:40,marginLeft:10,color:'#ffd547'}}/>
          </View>
          <SelectBtn dataList={dataList2} defaultData={this.state.defaultData2} change={this._dataChange2}/>

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
              style={{width:100,height:40,marginLeft:10,color:'#ffd547',}}/>
          </View>
          <SelectBtn dataList={dataList3} defaultData={this.state.defaultData3} change={this._dataChange3}/>

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
          <View
            style={{width:(screenWidth-60)/5,height:(screenWidth-60)/5,marginLeft:10,backgroundColor:'#0a1926',borderRadius:5,}}>
          </View>
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
      <View style={{marginTop:10}}>
        <TouchableHighlight onPress={() => this._pressRow()} underlayColor='rgba(129,127,201,0)'>
          <View
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:44, backgroundColor: '#4fb9fc'}}>
            <Text style={{fontWeight: 'bold', color:'white',}}>
              {'发布'}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  },
  _pressRow: function () {

  },
  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },
});

module.exports = WhitePage;
