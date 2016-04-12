/**
 * Created by cui on 16/4/8.
 */
var React = require('react-native');
var {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  } = React;

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var NavBarView = require('../../framework/system/navBarView');

var data = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

var SelectBusiness2 = React.createClass({
  getInitialState(){
    return {
      dataSource: ['同业存款', '同业拆借', '债券回购', '存单', '其他'],
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='资金业务' showBack={true} showBar={true}>
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
        onPress={()=>this.pressRow(rowID)} underlayColor='#2b4f79'>
        <View style={{width:screenWidth,height:50,flexDirection:'row',alignItems: "center",justifyContent: "space-between",backgroundColor:'#244266',borderBottomColor:"#0a1926",borderBottomWidth:0.7}}>
          <Text style={{marginLeft:10,fontSize:16,color:'white'}}>{rowData}</Text>
        </View>
      </TouchableHighlight>
    )
  },
  pressRow: function () {
    this.props.navigator.popToTop();
  },

});

var styles = StyleSheet.create({});

module.exports = SelectBusiness2;
