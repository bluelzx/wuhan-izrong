/**
 * Created by cui on 16/4/8.
 */
let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let NavBarView = require('../../framework/system/navBarView');
let SelectBusiness2 = require('./selectBusiness2');

let data = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

let SelectBusiness1 = React.createClass({
  getInitialState(){
    return {
      dataSource: ['资金业务', '资产交易', '票据交易', '同业代理', '公司与投行'],
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='选择业务' showBack={true} showBar={true}>
        <ListView
          dataSource={data.cloneWithRows(this.state.dataSource)}
          renderRow={this.renderRow}
          scrollEnabled={false}
        />
      </NavBarView>
    )
  },
  renderRow(rowData, sectionID, rowID){
    return (
      <TouchableHighlight
        onPress={()=>this.pressRow()} underlayColor='#2b4f79'>
        <View style={{width:screenWidth,height:50,flexDirection:'row',alignItems: "center",justifyContent: "space-between",backgroundColor:'#244266',borderBottomColor:"#0a1926",borderBottomWidth:0.7}}>
          <Text style={{marginLeft:10,fontSize:16,color:'white'}}>{rowData}</Text>
          <Image style={{margin:10,width:16,height:16}}
                 source={require('../../image/market/next.png')}
          />
        </View>
      </TouchableHighlight>
    )
  },
  pressRow: function () {
    {this.props.navigator.push({comp:SelectBusiness2})}
  },
});

let styles = StyleSheet.create({});

module.exports = SelectBusiness1;
