'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  ActionSheetIOS,
  Text,
  View,
  } = React;
var Item = require('../../comp/utils/item');
var NavBarView = require('../../framework/system/navBarView');

var AboutUs = React.createClass({
  getInitialState(){
    return {
      phone: '021-35885888-2627',
      email: 'contacts@izirong.com',
      web: 'www.izirong.com',
      content: '       票易贴是安硕织信旗下的金融新产品，以“服务”为本，创新“互联网+票据”，坚定打造真正服务于中小微企业用户的票据贴现互联网平台，为企业票据融资提供渠道，切实帮助中小微企业解决资金短缺问题，助力企业发展。'
    }
  },

  render(){
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='关于我们' showBack={true} showBar={true}>
        <View style={{paddingBottom:24,backgroundColor:'#162a40'}}>
          <View style={{marginTop:20,flexDirection:'column',alignItems:'center',paddingHorizontal:16}}>
            <Image style={styles.logo} source={require('../../image/login/logo.png')}/>
            <Text style={styles.title}>环渤海银银合作平台</Text>
          </View>
          <Text style={styles.content}>
            {this.state.content}
          </Text>
        </View>
        <View style={[{backgroundColor:'white'}]}>
          <Item desc="客服热线:" img={false} icon={false} top={true} value={this.state.phone}/>
          <Item desc="网站邮箱:" img={false} icon={false} value={this.state.email}/>
          <Item desc="版本号:" img={false} icon={false} value={this.state.web}/>
        </View>
        <View style={{paddingTop:32,alignItems:'center'}}>
          <Text style={styles.font}>隐私政策</Text>
          <Text style={styles.font}>© 2015,all rights reserved.</Text>
        </View>
        <View style={[styles.borderBottom,{marginTop:6,marginHorizontal:12}]}/>
      </NavBarView>
    )
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
    color: '#ffffff',
    fontSize: 12
  },
  title: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 18
  },
  content: {
    fontSize: 13,
    color: '#ffffff',
    lineHeight: 23,
    paddingHorizontal: 16
  },
  logo: {
    marginTop: 30,
    height: 80,
    width: 160
  }
});
module.exports = AboutUs;
