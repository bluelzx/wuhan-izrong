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

let data = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

let SelectBusiness2 = React.createClass({
  getInitialState(){
    let bizCategory = this.props.param.category;
    let bizItem = this.props.param.bizItem;
    let itemArr = this.getItemWithCategory(bizItem, bizCategory);
    return {
      dataSource: itemArr,
      category: bizCategory
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title={this.state.category.displayName}>
        <ListView
          dataSource={data.cloneWithRows(this.state.dataSource)}
          renderRow={this.renderRow}
          scrollEnabled={false}
          enableEmptySections={true}
        />
      </NavBarView>
    )
  },
  renderRow(rowData, sectionID, rowID){
    return (
      <TouchableHighlight
        onPress={()=>this.pressRow(rowData)} underlayColor='#2b4f79'>
        <View
          style={{width:screenWidth,height:50,flexDirection:'row',alignItems: "center",justifyContent: "space-between",backgroundColor:'#244266',borderBottomColor:"#0a1926",borderBottomWidth:0.7}}>
          <Text style={{marginLeft:10,fontSize:16,color:'white'}}>{rowData.displayName}</Text>
        </View>
      </TouchableHighlight>
    )
  },
  pressRow: function (rowData) {
    this.props.param.callBackCategoryAndItem(this.props.param.category,rowData);
    this.props.navigator._popN(2);
  },

  getItemWithCategory: function (bizItem, bizCategory) {
    let itemArr = [];
    bizItem.forEach(function (item) {
      if (item.displayCode.substring(0, 3) == bizCategory.displayCode) {
        itemArr.push(item);
      }
    });
    return (
      itemArr
    )
  }

});

let styles = StyleSheet.create({});

module.exports = SelectBusiness2;
