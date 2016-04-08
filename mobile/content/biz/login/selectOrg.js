/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Component
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button ,Device} = require('mx-artifacts');
var AlphabetListView = require('react-native-alphabetlistview');

class SectionHeader extends Component {
  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      textAlign:'left',
      marginLeft:20,
      color:'#fff',
      fontWeight:'700',
      fontSize:16
    };

    var viewStyle = {
      backgroundColor: '#244266',
      marginTop:-1,
      height:30,
      justifyContent:"center"
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

class SectionItem extends Component {
  render() {
    return (
      <Text style={{color:"#327efb"}}>{this.props.title}</Text>
    );
  }
}

class Cell extends Component {
  render() {
    return (
      <View style={{height:40,marginLeft:20,justifyContent:"center",borderBottomWidth:1,borderBottomColor:'#122335'}}>
        <Text style={{color:"#FFFFFF",textAlign:"left"}}>{this.props.item}</Text>
      </View>
    );
  }
}

let Register_selectOrg = React.createClass({
  getStateFromStores() {
    //let user = UserStore.getUserInfoBean();
    let deviceModel = 'IOS';
    if (Platform.OS != 'ios') {
      deviceModel = 'ANDROID';
    }
    return {
      loaded: false,
      checked: true,
      userName: '',
      password: '',
      verify: '',
      active: false,
      deviceModel: deviceModel,
      data: {
        A: ['some', 'entries', 'are here'],
        B: ['some', 'entries', 'are here'],
        C: ['some', 'entries', 'are here'],
        D: ['some', 'entries', 'are here'],
        E: ['some', 'entries', 'are here'],
        F: ['some', 'entries', 'are here'],
        G: ['some', 'entries', 'are here'],
        H: ['some', 'entries', 'are here'],
        I: ['some', 'entries', 'are here'],
        J: ['some', 'entries', 'are here'],
        K: ['some', 'entries', 'are here'],
        L: ['some', 'entries', 'are here'],
        M: ['some', 'entries', 'are here'],
        N: ['some', 'entries', 'are here'],
        O: ['some', 'entries', 'are here'],
        P: ['some', 'entries', 'are here'],
        Q: ['some', 'entries', 'are here'],
        R: ['some', 'entries', 'are here'],
        S: ['some', 'entries', 'are here'],
        T: ['some', 'entries', 'are here'],
        U: ['some', 'entries', 'are here'],
        V: ['some', 'entries', 'are here'],
        X: ['some', 'entries', 'are here'],
        Y: ['some', 'entries', 'are here'],
        Z: ['some', 'entries', 'are here']
      }
    };
  },
  getInitialState: function () {
    return this.getStateFromStores();
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },
  _onChange: function () {

  },
  renderSectionHeader: function(){
    return (
      <View style={styles.viewStyle}>
        <Text style={styles.textStyle}>{this.state.title}</Text>
      </View>
    );
  },
  renderSectionItem: function(){
    return (
      <Text style={{color:'#f00'}}>{this.props.title}</Text>
    );
  },
  renderCell: function() {
    return (
      <View style={{height:30}}>
        <Text>{this.props.item}</Text>
      </View>
    );
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='选择机构' showBack={true} showBar={true}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <AlphabetListView
            data={this.state.data}
            cell={Cell}
            cellHeight={30}
            sectionListItem={SectionItem}
            sectionHeader={SectionHeader}
            sectionHeaderHeight={22.5}
          />
        </View>
      </NavBarView>
    )
  }
});
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12, paddingRight: 12,
  },
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },

  viewStyle: {
    backgroundColor: '#ccc'
  }
});

module.exports = Register_selectOrg;
