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

let MarketStore = require('../../framework/store/marketStore');

let data = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

let SelectBusiness1 = React.createClass({
  getInitialState(){
    let category = MarketStore.getFilterOptions(this.props.param.filterItems, 'bizCategory').options;
    let categoryArr = this.removeDisplayCodeIsAllObj(category);
    return {
      dataSource: categoryArr == null ? [] : categoryArr,
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='选择业务'>
        <View style={{backgroundColor:'#f7f7f7',height:10}}>
        </View>
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
        onPress={()=>this.pressRow(rowData)} underlayColor='#f4f7fc'>
        <View
          style={{width:screenWidth,height:50,flexDirection:'row',alignItems: "center",justifyContent: "space-between",backgroundColor:'white',borderBottomColor:"#edeef4",borderBottomWidth:0.5}}>
          <Text style={{marginLeft:10,fontSize:16,color:'#495154'}}>{rowData.displayName}</Text>
          <Image style={{margin:10,width:16,height:16}}
                 source={require('../../image/market/next.png')}
          />
        </View>
      </TouchableHighlight>
    )
  },
  pressRow: function (rowData) {
    this.props.navigator.push({
      comp: SelectBusiness2,
      param: {
        bizItem: MarketStore.getFilterOptions(this.props.param.filterItems, 'bizItem').options,
        category: rowData,
        callBackCategoryAndItem: this.props.param.callBackCategoryAndItem
      }
    });
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

let styles = StyleSheet.create({});

module.exports = SelectBusiness1;
