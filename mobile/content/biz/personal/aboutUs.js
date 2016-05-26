'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  ActionSheetIOS,
  TouchableHighlight,
  Platform,
  ScrollView,
  Text,
  View,
  Dimensions
  } = React;
var Item = require('../../comp/utils/item');
var NavBarView = require('../../framework/system/navBarView');
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');
let PrivacyPolicy = require('../../biz/personal/privacyPolicy');
let AppInfoModule = require('NativeModules').AppInfoModule;
let deviceInfo = require('react-native-device-info');

var AboutUs = React.createClass({
  getInitialState(){
    return {
      versionName: deviceInfo.getVersion(),
      buildNumber: deviceInfo.getBuildNumber(),
    };
  },

  statics: {
    email: 'zr@izirong.com',
    content: '     爱资融APP是武汉安硕织信为广大银行同业交易从业人员推出的银行同业业务撮合及社交类软件。爱资融秉承“透明公开，服务为先” ' +
    '的原则，立志为广大的银行同业交易员提供一个纯净高效的同业交流环境。'
  },

  componentDidMount() {
  },

  render(){
    return (
      <NavBarView navigator={this.props.navigator} title='关于我们' showBack={true}>
        <ScrollView automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    backgroundColor={PlainStyle.colorSet.content}
        >
          <View style={{paddingBottom: 24, backgroundColor: PlainStyle.colorSet.content}}>
            <View style={{marginTop: 20, flexDirection: 'column', alignItems: 'center', paddingHorizontal: 16}}>
              <Image style={styles.logo} source={require('../../image/login/logo.png')}/>
              <Text style={styles.title}>爱资融同业平台</Text>
            </View>
            <Text style={styles.content}>
              {this.statics.content}
            </Text>
          </View>
          <View>
            <Item desc="网站邮箱:" img={false} icon={false} hiddenArrow={true} value={this.statics.email}/>
            <Item desc="版本号:" img={false} icon={false} hiddenArrow={true} value={Platform.OS === 'ios' ? this.state.versionName + '.' + this.state.buildNumber : this.state.versionName}/>
          </View>

          <View style={{marginTop:60,flexDirection: 'column'}}>
            <View style={{paddingTop:32, alignItems: 'center'}}>
              <TouchableHighlight activeOpacity={0.8} underlayColor={PlainStyle.colorSet.content}
                                  onPress={()=>{
                                  const { navigator } = this.props;
                                  if (navigator) {
                                      navigator.push({comp: PrivacyPolicy});
                                  }
                                }}>
                <Text style={{ color: '#000000',fontSize: 16}}>隐私政策</Text>
              </TouchableHighlight>

              <Text style={[styles.font,{marginTop:10}]}>武汉安硕织信网络科技有限公司 版权所有</Text>
              <Text style={styles.font}>Copyright © 2016 All Rights Reserved.</Text>
            </View>
            <View style={[styles.borderBottom, {marginTop:6, marginHorizontal:12}]}/>
          </View>
        </ScrollView>
      </NavBarView>
    );
  }
});
var styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderColor: '#c8c7cc'
  },
  font: {
    color: PlainStyle.colorSet.aboutUsTextColor,
    fontSize: 12
  },
  title: {
    fontSize: 20,
    color: PlainStyle.colorSet.aboutUsTextColor
  },
  content: {
    marginTop: 10,
    fontSize: 13,
    color: PlainStyle.colorSet.aboutUsTextColor,
    lineHeight: 23,
    marginHorizontal: 16
  },
  logo: {
    marginTop: 10,
    height: 110,
    width: 100
  }
});
module.exports = AboutUs;
