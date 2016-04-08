/**
 * Created by vison on 16/4/8.
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
  }=React;
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation')
let Item = require('../../comp/utils/item');
let Icon = require('react-native-vector-icons/Ionicons');
let TextEdit = require('./textEdit')

let UserInfo = React.createClass({
  getInitialState: function () {
    return {
      userName: "用户名",
      mobile: '未设置',
      telephoneNo: '未设置',
      qqNo: '未设置',
      wechatNo: '未设置',
      email: '未设置',
      organization: '未设置',
      depart: '未设置',
      jobTitle: '未设置'
    }
  },
  componentDidMount() {

  },

  componentWillUnmount: function () {

  },


  selectPhoto: function () {

  },

  toEdit: function (title, name, value, type, maxLength, valid) {
    if (value == '未设置') {
      value = ''
    }
    let {navigator} = this.props;
    if (navigator) {
      navigator.push({
        comp: TextEdit,
        param: {
          title: title,
          name: name,
          value: value,
          type: type,
          maxLength: maxLength,
          valid: valid
        },
        callBack: this.callBack
      })
    }
  },

  render: function () {
    let {title}  = this.props;
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='个人信息' showBack={true} showBar={true}>
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false} backgroundColor='#18304b'>

          <TouchableHighlight style={{backgroundColor:'#162a40'}} activeOpacity={0.8} underlayColor='#18304b'
                              onPress={()=>this.selectPhoto()}>
            <View style={styles.layout}>
              <Image style={styles.head} resizeMode="cover" source={require('../../image/user/head.png')}/>
              <Text style={{color:'#ffffff',fontSize:18}}>{this.state.userName}</Text>
              <Icon style={{marginRight:20}} name="ios-arrow-right" size={30} color={'#ffffff'}/>
            </View>
          </TouchableHighlight>

          <Item desc="手机号:" imgPath={require('../../image/user/mobileNo.png')} value={this.state.realName}
                func={() => this.toEdit("手机号", 'mobile', this.state.mobile, 'name', 20, Validation.realName)}/>

          <Item desc="座机号:" imgPath={require('../../image/user/telephoneNo.png')}
                value={this.state.telephoneNo}
                func={() => this.toEdit("座机号", 'telephoneNo', this.state.telephoneNo, 'telephone', 13, Validation.isTelephone)}/>

          <Item desc="QQ:" imgPath={require('../../image/user/qqNo.png')} value={this.state.qqNo}
                func={() => this.toEdit("QQ", 'qqNo', this.state.qqNo, 'number', 20, Validation.isQQ)}/>

          <Item desc="微信:" imgPath={require('../../image/user/wechatNo.png')}
                value={this.state.wechatNo}
                func={() => this.toEdit("微信", 'wechatNo', this.state.wechatNo, '', 40, '')}/>

          <Item desc="电子邮箱:" imgPath={require('../../image/user/email.png')} value={this.state.email}
                func={() => this.toEdit("邮箱", 'email', this.state.email, '', 60, Validation.isEmail)}/>

          <Item style={{marginTop:20}} desc="机构:" imgPath={require('../../image/user/jobTitle.png')}
                value={this.state.jobTitle}
                func={() => this.toEdit("机构", 'organization', this.state.jobTitle, 'name', 20, '')}/>

          <Item desc="部门:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.jobTitle}
                func={() => this.toEdit("部门", 'depart', this.state.jobTitle, 'name', 20, '')}/>

          <Item desc="职位:" imgPath={require('../../image/user/jobTitle.png')} value={this.state.jobTitle}
                func={() => this.toEdit("职位", 'jobTitle', this.state.jobTitle, 'name', 20, '')}/>

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
    borderBottomWidth: 0.5,
    borderBottomColor: '#0a1926'
  },
  img: {
    width: 63,
    height: 63,
    borderRadius: 5,
    marginTop: 18,
    borderColor: '#7f7f7f',
    borderWidth: 1
  },
  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginLeft: 20
  },
});


module.exports = UserInfo;
