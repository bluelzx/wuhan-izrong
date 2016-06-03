/**
 * Created by baoyinghai on 16/4/3.
 */

'use strict';

let React = require('react-native');
let {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  } = React;
let Icon = require('react-native-vector-icons/Ionicons');
let _ = require('lodash');
let NavBarView = require('../../framework/system/navBarView');
let Item = require('../../comp/utils/item');
let UserInfo = require('../../biz/personal/userInfo');
let AboutUs = require('./aboutUs');
let UserGuide = require('./userGuide');
let UserInfoAction = require('../../framework/action/userInfoAction');
let AppStore = require('../../framework/store/appStore');
let NameCircular = require('../im/nameCircular').NameCircular;
let {ORG_CHANGE,USER_CHANGE} = require('../../constants/dictEvent');
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');
let {ImageSize50} = require('../../../config');

let Personal = React.createClass({
  getStateFromStores: function () {
    let userInfo = UserInfoAction.getLoginUserInfo();
    let orgBean = UserInfoAction.getOrgById(userInfo.orgId);
    return {
      realName: userInfo.realName,
      orgName: orgBean.orgValue,
      photoFileUrl: userInfo.photoFileUrl,
      certificated: userInfo.certified
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange, USER_CHANGE);
    AppStore.addChangeListener(this._onChange, ORG_CHANGE);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange, USER_CHANGE);
    AppStore.removeChangeListener(this._onChange, ORG_CHANGE);
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name});
    }
  },

  returnImage: function () {
    if (!_.isEmpty(this.state.photoFileUrl)) {
      let uri = this.state.photoFileUrl + ImageSize50;
      if (this.state.certificated) {
        return (
          <View>
            <Image style={styles.head} resizeMode="cover" source={{uri: uri}}/>
            <Image style={[styles.certified,{position: 'absolute',bottom:5,left:40,right:40}]}
                   resizeMode="cover" source={require('../../image/user/certificated.png')}/>
          </View>
        );
      }
      return (
        <Image style={styles.head} resizeMode="cover" source={{uri: uri}}/>
      );
    } else {

      return (
        <View style={{marginLeft:20}}>
          <NameCircular name={this.state.realName} isV={this.state.certificated}/>
        </View>
      );

    }
  },

  render: function () {
    let {title} = this.props;
    return (
      <NavBarView navigator={this.props.navigator} title='个人中心' showBack={false}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
          <View style={{backgroundColor:PlainStyle.colorSet.content , height: 10}}/>
          <TouchableHighlight activeOpacity={0.8} underlayColor={PlainStyle.colorSet.content}
                              onPress={()=>this.toPage(UserInfo)}
          >
            <View style={[styles.layout,DictStyle.userInfoBorderBottom,DictStyle.userInfoBorderTop]}>
              {this.returnImage()}
              <View>
                <Text style={{fontSize: 18, color: PlainStyle.colorSet.personalRealName,width: 150}}
                      numberOfLines={1}>
                  {this.state.realName}
                </Text>
                <Text style={{fontSize: 18, color: PlainStyle.colorSet.personalOrgName, marginTop: 10, width: 150}}
                      numberOfLines={1}
                >
                  {this.state.orgName}
                </Text>
              </View>
              <Icon style={{marginRight:20}} name="ios-arrow-right" size={30} color={PlainStyle.colorSet.arrowColor}/>
            </View>
          </TouchableHighlight>
          <View style={{backgroundColor: PlainStyle.colorSet.content, height: 10}}/>
          <View style={DictStyle.userInfoBorderTop}>
            <Item desc="用户指导" img={false} func={() => this.toPage(UserGuide)}/>
            <Item desc="关于我们" img={false} func={() => this.toPage(AboutUs)}/>
          </View>
        </ScrollView>
      </NavBarView>
    );
  }
});

let styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 84,
    backgroundColor: PlainStyle.colorSet.personalItemColor
  },
  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginLeft: 20
  },
  headText: {
    color: '#FF0000',
    fontSize: 50,
    fontStyle: 'italic',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  certified: {
    width: 15,
    height: 15,
    marginLeft: 20
  }
});


module.exports = Personal;
