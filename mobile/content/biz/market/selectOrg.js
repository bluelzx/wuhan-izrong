/**
 * Created by cui on 16/4/1.
 */
let React = require('react-native');
let {
  ListView,
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  } = React;

let NavBarView = require('../../framework/system/navBarView');

let data = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

let section1 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section2 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section3 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section4 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section5 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section6 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section7 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];
let section8 = [{title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}, {title: '天津银行', detail: '分行'}];

let arr = {T: section1, B: section2, C: section3, D: section4, E: section5, F: section6, G: section7, H: section8};

let SelectOrg = React.createClass({
  getInitialState: function () {
    return {
      dataSource: data.cloneWithRowsAndSections(arr),
    };
  },
  render() {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='选择发布机构' showBack={true} showBar={true}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          enableEmptySections={true}
          renderSectionHeader={this._renderSectionHeader}/>
      </NavBarView>
    );
  },
  _renderRow: function (rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)} underlayColor='rgba(0,0,0,0)'>
        <View
          style={{height: 40, backgroundColor: '#1e3754'}}>
          <Text style={{flex: 1, marginTop: 10,marginLeft:10, fontSize:16, color:'white',}}>
            {rowData.title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  },
  _renderSectionHeader(sectionData, sectionId){
    return (
      <View style={{}}>
        <View style={{backgroundColor: '#244266'}}>
          <Text style={{marginLeft:10,color:'white'}}>{sectionId}</Text>
        </View>
      </View>

    )
  },
  _pressRow: function (rowID) {
    this.props.navigator.pop();
  }
});

let styles = StyleSheet.create({});

module.exports = SelectOrg
