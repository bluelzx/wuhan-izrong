/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
  } = React;
let AppStore = require('../../framework/store/appStore');
let NavBarView = require('../../framework/system/navBarView');
let AlphabetListView = require('react-native-alphabetlistview');
let {ORG_CHANGE} = require('../../constants/dictEvent');
let SearchBar = require('../im/searchBar');
var that;
let DictStyle = require('../../constants/dictStyle');

let Register_selectOrg = React.createClass({

  getStateFromStores() {
    that = this;
    let orgBuildList = AppStore.getOrgList();
    return {
      data: orgBuildList,
      text: ''
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },
  componentDidMount() {
    AppStore.addChangeListener(this._onChange, ORG_CHANGE);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, ORG_CHANGE);
  },
  _onChange: function () {

  },
  onCellSelect: function (item) {
    console.log(item);
  },

  textChange: function (text) {
    this.setState({
      text: text,
      data: AppStore.getOrgByOrgName(text)
    });

  },

  rendSelectAll: function () {
    if (this.props.param.needAll) {
      return (
        <TouchableHighlight style={{backgroundColor: '#f7f7f7'}} activeOpacity={0.8} underlayColor='#f4f7fd'
                            onPress={()=>{
                              that.props.callback({orgValue: '全部发布机构',id: 0});
                              that.props.navigator.pop();}
                             }>
          <View
            style={{height: 40,  backgroundColor: '#f7f7f7',justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#ebeef7'}}>
            <Text style={{marginLeft: 20, color: '#3b4549', textAlign: 'left'}}>全部发布机构</Text>
          </View>
        </TouchableHighlight>
      );
    }
  },

  renderList: function () {
    if (this.state.data == '') {
      return (
        <View style={{marginTop:35,marginHorizontal:16,alignItems:'center',flex:1,flexDirection:'column'}}>
          <Text style={[DictStyle.fontSize,{color:'#c6d1d9'}]}>
            无符合条件的机构
          </Text>
        </View>
      )
    } else {
      return (
        <AlphabetListView
          data={this.state.data}
          cell={Cell}
          cellHeight={30}
          sectionListItem={SectionItem}
          sectionHeader={SectionHeader}
          sectionHeaderHeight={22.5}
          updateScrollState={true}
        />
      )
    }
  },

  render: function () {
    let {param}  = this.props;
    let title = param && param.isFromMarket ? '选择发布机构':'选择机构';
    return (
      <NavBarView navigator={this.props.navigator} title={title}>
        <SearchBar
          textChange={this.textChange}
        />
        <View style={{flexDirection: 'column', flex: 1}}>
          {this.rendSelectAll()}
          {this.renderList()}
        </View>
      </NavBarView>
    );
  }
});

let SectionHeader = React.createClass({
  render() {
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>{this.props.title}</Text>
      </View>
    );
  }
});

let SectionItem = React.createClass({
  render() {
    return (
      <Text style={{color: '#327efb'}}>{this.props.title}</Text>
    );
  }
});

let Cell = React.createClass({
  render() {
    return (
      <TouchableHighlight style={{backgroundColor: '#f7f7f7'}} activeOpacity={0.8} underlayColor='#f4f7fd'
                          onPress={()=>this.selectOrgItem(this.props.item)}
      >
        <View
          style={{height: 40, marginLeft: 20, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#ebeef7'}}>
          <Text style={{color: '#3b4549', textAlign: 'left'}}>{this.props.item.orgValue}</Text>
        </View>
      </TouchableHighlight>
    );
  },

  selectOrgItem: function (item) {
    that.props.callback({
      orgValue: item.orgValue,
      id: item.id
    });
    that.props.navigator.pop();
  }
});

let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  textStyle: {
    textAlign: 'left',
    marginLeft: 20,
    color: '#3b4549',
    fontWeight: '700',
    fontSize: 16
  },
  viewStyle: {
    backgroundColor: '#f0f0f0',
    marginTop: -1,
    height: 30,
    justifyContent: 'center',
    borderBottomColor: '#d8dae3',
    borderBottomWidth: 1
  }
});

module.exports = Register_selectOrg;
