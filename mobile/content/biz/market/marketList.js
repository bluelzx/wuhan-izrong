/**
 * Created by cui on 16/4/5.
 */

var React = require('react-native');
var {
  ListView,
  ScrollView,
  TouchableHighlight,
  Text,
  View,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
  AppRegistry
  } = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var Adjust = require('../../comp/utils/adjust');
var BusinessDetail = require('./businessDetail');

var MarketStore = require('../../framework/store/marketStore');

var data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let MarketList = React.createClass({
  getInitialState: function () {

    return {
      dataSource: data.cloneWithRows(this.props.marketData.contentList),
    };
  },
  componentWillMount: function () {
  },
  render() {
    return (
      <View style={{width:screenWidth,height:screenHeight-149,backgroundColor: '#162a40'}}>
        <View style={{height:26,flexDirection:'row',marginTop:10,marginLeft:5}}>
          <Text style={{position:"absolute",left:0,top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'方向'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'期限'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(130),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'金额'}
          </Text>
          <Text style={{position:"absolute",left:Adjust.width(220),top:0,marginLeft:10, color:'#8d8d8d',}}>
            {'发布人'}
          </Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  },
  _renderRow: function (rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this.toDetail(BusinessDetail,rowData)} underlayColor='#000'>
        <View
          style={{flexDirection:'row',height: 50, backgroundColor: '#1e3754',alignItems:'center',borderBottomWidth:0.7,borderBottomColor:'#0a1926',}}>
          <Image style={{width:25,height:25,marginLeft:15,borderRadius:5}}
                 source={rowData.bizOrientationDesc == '出'?require('../../image/market/issue.png'):require('../../image/market/receive.png')}
          />
          <Text style={{position:"absolute",left:Adjust.width(60),top:0,marginLeft:15, marginTop:15,color:'white',}}>
            {rowData.term + '天'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(130),top:0, marginLeft:15,marginTop:15,color:'rgba(175,134,86,1)',}}>
            {rowData.amount / 10000 + '万'}
          </Text>
          <Text
            style={{position:"absolute",left:Adjust.width(220),top:0, marginLeft:15, marginTop:15,color:'white',width:Adjust.width(135)}}
            numberOfLines={1}>
            {rowData.orgName}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },
  _pressRow: function (rowID) {
  },
  toDetail: function (name, rowData) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          marketInfo: rowData
        }
      })
    }
  },

  _changeData: function () {
    this.setState({
      dataSource: data.cloneWithRows(this.props.marketData.contentList),
    })
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
module.exports = MarketList;
