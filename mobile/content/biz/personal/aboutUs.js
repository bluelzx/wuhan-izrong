'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  ActionSheetIOS,
  ScrollView,
  Text,
  View,
  } = React;
var Item = require('../../comp/utils/item');
var NavBarView = require('../../framework/system/navBarView');
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');

var AboutUs = React.createClass({
  getInitialState(){
    return {
      phone: '022-28405347',
      email: 'bbcp.bankoftianjin.com',
      versionNo: '0.0.0.1',
      content: '     平台秉着“平等、互利、开放、合作、务实、创新”的原则，推动成员行在流动性互助、金融功能互助、投资业务互助、信贷业务互助和信息政策互助方面加强合作'
    };
  },

  render(){
    return (
      <NavBarView navigator={this.props.navigator} title='关于我们' showBack={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false} backgroundColor={PlainStyle.colorSet.content}>
          <View style={{paddingBottom: 24, backgroundColor: PlainStyle.colorSet.content}}>
            <View style={{marginTop: 20, flexDirection: 'column', alignItems: 'center', paddingHorizontal: 16}}>
              <Image style={styles.logo} source={require('../../image/login/logo.png')}/>
              <Text style={styles.title}>爱资融同业平台</Text>
            </View>
            <Text style={styles.content}>
              {this.state.content}
            </Text>
          </View>
          <View>
            <Item desc="客服热线:" img={false} icon={false} top={true} hiddenArrow={true} value={this.state.phone}/>
            <Item desc="网站邮箱:" img={false} icon={false} hiddenArrow={true} value={this.state.email}/>
            <Item desc="版本号:" img={false} icon={false} hiddenArrow={true} value={this.state.versionNo}/>
          </View>


        </ScrollView>
        <View style={{position: 'absolute',bottom:20,left:50,right:50,flexDirection: 'column'}}>
          <View style={{paddingTop:32, alignItems: 'center'}}>
            <Text style={styles.font}>隐私政策</Text>
            <Text style={styles.font}>© 2015,all rights reserved.</Text>
          </View>
          <View style={[styles.borderBottom, {marginTop:6, marginHorizontal:12}]}/>
        </View>
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
    color:  PlainStyle.colorSet.aboutUsTextColor,
  },
  content: {
    marginTop: 10,
    fontSize: 13,
    color: PlainStyle.colorSet.aboutUsTextColor,
    lineHeight: 23,
    marginHorizontal:16
  },
  logo: {
    marginTop: 10,
    height: 110,
    width: 100
  }
});
module.exports = AboutUs;
