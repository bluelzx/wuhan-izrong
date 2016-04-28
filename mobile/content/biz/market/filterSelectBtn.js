/**
 * Created by cui on 16/4/7.
 */
let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Platform,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  InteractionManager
  } = React;

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
let Adjust = require('../../comp/utils/adjust');

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let FilterSelectBtn = React.createClass({
  getInitialState(){
    let rowDefault = this.props.rowDefault;
    let isAll = this.props.isAll;
    return {
      isAll: isAll,
      rowDefault: rowDefault,
    }
  },
  setDefaultState: function () {
    this.setState({
      isAll: true,
      rowDefault: 10000,
    });
    {this._returnSelectOption(0, this.props.typeTitle , 10000, this.state.isAll)}
  },
  render: function () {
    return (
      <View>
        <Text style={{marginTop:10,marginLeft:10,color:'white'}}>{this.props.typeTitle}</Text>
        <View style={{flexDirection:'row'}}>
          <TouchableHighlight onPress={() => this._pressAll()} underlayColor='rgba(0,0,0,0)'>
            <View>
              <View
                style={{justifyContent: 'center', padding: 5, marginLeft: 10, marginTop:10, width:Adjust.width(80), height: 40, backgroundColor: this.state.isAll ? '#817fc9':'#102a42', alignItems: 'center', borderRadius: 5,}}>
                <Text style={{flex: 1, marginTop: 5, color:'white'}}>
                  {this.props.dataList[0].displayName}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
          <ListView
            contentContainerStyle={{justifyContent: 'flex-start',flexDirection: 'row',flexWrap: 'wrap',}}
            dataSource={data.cloneWithRows(this.deleteFirstObj(this.props.dataList))}
            scrollEnabled={false}
            renderRow={this._renderRow}
          />
        </View>
      </View>
    )
  },
  _renderRow: function (rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={this.state.rowDefault == rowID ? null : () => this._pressRow(rowID)}
                          underlayColor='rgba(0,0,0,0)'>
        <View>
          <View
            style={{justifyContent: 'center', padding: 5, marginLeft: 10, marginTop:10, width:(this.props.section == 3)?Adjust.width(80):Adjust.width(125.5), height: 40, backgroundColor: this.state.isAll ? '#102a42' : (this.state.rowDefault == rowID ? '#817fc9':'#102a42'), alignItems: 'center', borderRadius: 5, }}>
            <Text
              style={{flex: 1, marginTop: 8, fontSize:12, color:'white'}}
              numberOfLines={1}>
              {rowData.displayName}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
  _pressRow: function (rowID) {
    this.setState({
      isAll: false,
      rowDefault: rowID
    });
    {
      this._returnSelectOption(Number(rowID) + 1, this.props.typeTitle, Number(rowID), this.state.isAll)
    }
  },
  _pressAll: function () {
    this.setState({
      isAll: true,
    });
    {
      this._returnSelectOption(0, this.props.typeTitle , 10000, this.state.isAll)
    }
  },
  _returnSelectOption: function (number, title, rowDefault, isAll) {
    this.props.callBack(this.props.dataList[number], title, rowDefault, isAll);
  },
  deleteFirstObj: function (obj) {
    let arr = [];
    obj.forEach(function (item) {
      if (item.displayCode != 'ALL') {
        arr.push(item);
      }
    });
    return (
      arr
    )
  }
});

let styles = StyleSheet.create({});

module.exports = FilterSelectBtn;
