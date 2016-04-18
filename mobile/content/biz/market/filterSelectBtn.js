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

let data = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let FilterSelectBtn = React.createClass({
  getInitialState(){
    return {
      isAll: true,
      rowDefault: 10000,
    }
  },
  render: function () {
    return (
      <View>
        <Text style={{marginTop:10,marginLeft:10,fontWeight: 'bold',color:'white'}}>{this.props.typeTitle}</Text>
        <View style={{flexDirection:'row'}}>
          <TouchableHighlight onPress={() => this._pressAll()} underlayColor='rgba(0,0,0,0)'>
            <View>
              <View
                style={{justifyContent: 'center', padding: 5, marginLeft: 10, marginTop:10, width:(screenWidth-50)/4, height: 40, backgroundColor: this.state.isAll ? '#817fc9':'#102a42', alignItems: 'center', borderRadius: 5,}}>
                <Text style={{flex: 1, marginTop: 5, fontWeight: 'bold', color:'white'}}>
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
            style={{justifyContent: 'center', padding: 5, marginLeft: 10, marginTop:10, width:(this.props.section == 3)?(screenWidth-50)/4:(screenWidth-120)/2, height: 40, backgroundColor: this.state.isAll ? '#102a42' : (this.state.rowDefault == rowID ? '#817fc9':'#102a42'), alignItems: 'center', borderRadius: 5, }}>
            <Text style={{flex: 1, marginTop: 5, fontWeight: 'bold', color:'white'}}>
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
    {this._returnSelectOption(Number(rowID)+1,this.props.typeTitle)}
  },
  _pressAll: function () {
    this.setState({
      isAll: true,
    });
    {this._returnSelectOption(0,this.props.typeTitle)}
  },
  _returnSelectOption: function (number,title) {
    this.props.callBack(this.props.dataList[number],title);
  },
  deleteFirstObj: function (obj) {
    let arr = new Array();
    for(let item of obj){
      if(item.displayCode != 'ALL'){
        arr.push(item);
      }
    }
    return(
      arr
    )
  }
});

let styles = StyleSheet.create({});

module.exports = FilterSelectBtn;
