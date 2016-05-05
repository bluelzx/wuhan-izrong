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
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let AlphabetListView = require('react-native-alphabetlistview');
let {ORG_CHANGE} = require('../../constants/dictEvent');
let SearchBar = require('../im/searchBar');
var that;
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
    AppStore.addChangeListener(this._onChange,ORG_CHANGE);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange,ORG_CHANGE);
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

  rendSelectAll: function(){
    if(this.props.param.needAll){
      return(
        <TouchableHighlight style={{backgroundColor: '#162a40'}} activeOpacity={0.8} underlayColor='#18304b'
                            onPress={()=>{
                              that.props.callback({orgValue: '全部',id: 0});
                              that.props.navigator.pop();}
                             }>
          <View
            style={{height: 40, marginLeft: 20, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#122335'}}>
            <Text style={{color: '#FFFFFF', textAlign: 'left'}}>全部</Text>
          </View>
        </TouchableHighlight>
      );
    }
  },

  renderList: function(){
    if(this.state.data == ''){
      return(
        <View>
          <Text style={{color:'#ffffff'}}>您的机构不再平台的机构列表中。如有问题，请联系客服</Text>
        </View>
      )
    }else{
      return(
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
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='选择机构' showBack={true} showBar={true}
      >
        <View style={{marginVertical:5}}>
          <SearchBar
            textChange={this.textChange}
          />
        </View>
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
      <TouchableHighlight style={{backgroundColor: '#162a40'}} activeOpacity={0.8} underlayColor='#18304b'
                          onPress={()=>this.selectOrgItem(this.props.item)}
      >
        <View
          style={{height: 40, marginLeft: 20, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#122335'}}>
          <Text style={{color: '#FFFFFF', textAlign: 'left'}}>{this.props.item.orgValue}</Text>
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
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  viewStyle: {
    backgroundColor: '#244266',
    marginTop: -1,
    height: 30,
    justifyContent: 'center'
  }
});

module.exports = Register_selectOrg;
