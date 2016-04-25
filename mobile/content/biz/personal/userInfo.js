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
  TouchableOpacity
  } = React;
let _ = require('lodash');
let NavBarView = require('../../framework/system/navBarView');
let Validation = require('../../comp/utils/validation');
let Item = require('../../comp/utils/item');
let Icon = require('react-native-vector-icons/Ionicons');
let TextEdit = require('./textEdit');
let { Alert } = require('mx-artifacts');
let UserInfoAction = require('../../framework/action/userInfoAction');
let LoginAction = require('../../framework/action/loginAction');
let Login = require('../../biz/login/login');
let ImagePicker = require('../../comp/utils/imagePicker');
let AppStore = require('../../framework/store/appStore');


let UserInfo = React.createClass({

  getStateFromStores: function () {
    let userInfo = UserInfoAction.getLoginUserInfo();
    let orgBean = UserInfoAction.getOrgById(userInfo.orgId);
    return {
      photoFileUrl: userInfo.photoFileUrl,
      realName: userInfo.realName,
      userId: userInfo.userId,
      mobileNumber: userInfo.mobileNumber,
      publicMobile: userInfo.publicMobile,
      phoneNumber: userInfo.phoneNumber,
      publicPhone: userInfo.publicPhone,
      qqNo: userInfo.qqNo,
      publicQQ: userInfo.publicQQ,
      weChatNo: userInfo.weChatNo,
      publicWeChat: userInfo.publicWeChat,
      email: userInfo.email,
      publicEmail: userInfo.publicEmail,
      orgBeanName: orgBean.orgValue,
      department: userInfo.department,
      publicDepart: userInfo.publicDepart,
      jobTitle: userInfo.jobTitle,
      publicTitle: userInfo.publicTitle,
      address: userInfo.address,
      publicAddress: userInfo.publicAddress,
      nameCardFileUrl: userInfo.nameCardFileUrl
    };
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  uploadUserPoto: function (response) {
    console.log(response);
    this.setState({uri: response});
    this.props.exec(() => {
      return LoginAction.uploadFile(response, 'photoFileUrl')
        .then((response) => {
          console.log(response);
          AppStore.updateUserInfo('photoFileUrl', response.fileUrl);
        }).catch((errorData) => {
          throw errorData;
        });
    });
  },

  returnImg: function () {
    let url = require('../../image/user/head.png');
    if (!_.isEmpty(this.state.photoFileUrl)) {
      url = {uri: this.state.photoFileUrl};
      return url;
    }
    return url;
  },

  toEdit: function (title, name, value, publicName, publicValue, type, maxLength, valid) {
    if (value == '未设置') {
      value = '';
    }
    let {navigator} = this.props;
    if (navigator) {
      navigator.push({
        comp: TextEdit,
        param: {
          title: title,
          name: name,
          value: value,
          publicName: publicName,
          publicValue: publicValue,
          type: type,
          maxLength: maxLength,
          valid: valid
        },
        callBack: this.callBack
      });
    }
  },

  logout: function () {
    Alert('确认退出当前账号？', ()=>{
      this.props.exec(() => {
      return LoginAction.logout(this.state.userId)
        .then((response) => {
          const { navigator } = this.props;
          navigator.resetTo({comp: Login});
        }).catch((errorData) => {
          if(errorData.toString().startsWith('{')){
            Alert(errorData.msgContent);
          }else{
            Alert('网络异常');
          }
        });
    });
    }, ()=>{});
  },

  renderRow: function (desc, imagePath, name, value, pubName, pubValue, type, maxLength, valid) {

    let showValue = '';
    if (value === null || value == '未填写') {
      showValue = '未填写';
    } else {
      if (pubValue) {
        showValue = value + '(公开)';
      } else {
        showValue = value + '(不公开)';
      }
    }
    return (
      <Item desc={desc} imgPath={imagePath} value={showValue}
            func={() => this.toEdit(desc, name, value, pubName, pubValue, type, maxLength, valid)}
      />
    );
  },

  render: function () {
    let {title} = this.props;
    return (
      <NavBarView navigator={this.props.navigator} foolor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='个人信息' showBack={true} showBar={true}
                  actionButton={this.renderLogout}
      >
        <ScrollView automaticallyAdjustContentInsets={false} horizontal={false} backgroundColor='#18304b'>

          <ImagePicker
            type="all"
            onSelected={(response) => this.uploadUserPoto(response)}
            onError={(error) => Alert(error)}
            title="选择图片"
            style={styles.layout}
          >
            <View style={{flex: 1}}>
              <Image style={styles.head} resizeMode="cover" source={this.returnImg()}/>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
              <Text
                style={{color: '#ffffff', fontSize: 18, textAlign: 'right', marginRight: 20}}
              >{this.state.realName}</Text>
              <Icon style={{marginRight: 20}} name="ios-arrow-right" size={30} color={'#ffffff'}/>
            </View>
          </ImagePicker>

          {this.renderRow('手机号', require('../../image/user/mobileNo.png'), 'mobileNumber', this.state.mobileNumber, 'publicMobile',
            this.state.publicMobile, 'number-pad', 11, Validation.isPhone)}

          {this.renderRow('座机号', require('../../image/user/telephoneNo.png'), 'phoneNumber', this.state.phoneNumber, 'publicPhone',
            this.state.publicPhone, 'number-pad', 11, Validation.isTelephone)}

          {this.renderRow('QQ', require('../../image/user/qqNo.png'), 'qqNo', this.state.qqNo, 'publicQQ',
            this.state.publicQQ, 'number-pad', 20, Validation.isQQ)}

          {this.renderRow('微信', require('../../image/user/wechatNo.png'), 'weChatNo', this.state.weChatNo, 'publicWeChat',
            this.state.publicWeChat, 'ascii-capable', 20, '')}

          {this.renderRow('邮箱', require('../../image/user/email.png'), 'email', this.state.email, 'publicEmail',
            this.state.publicEmail, 'email-address', 60, Validation.isEmail)}
          <View style = {{marginTop: 5}}>
            {this.renderRow('机构', require('../../image/user/comp.png'), 'organization', this.state.orgBeanName, '',
              'ascii-capable', 'ascii-capable', 20, '')}

            {this.renderRow('部门', require('../../image/user/department.png'), 'department', this.state.department, 'publicDepart',
              this.state.publicDepart, 'ascii-capable', 20, '')}

            {this.renderRow('职位', require('../../image/user/jobTitle.png'), 'jobTitle', this.state.jobTitle, 'publicTitle',
              this.state.publicTitle, 'ascii-capable', 20, '')}
          </View>
        </ScrollView>
      </NavBarView>
    );
  },

  renderLogout: function () {
    return (
      <TouchableOpacity style={{width: 150, marginLeft: -20}} onPress={()=>this.logout()}>
        <Text style={{color: '#ffffff'}}>退出登陆</Text>
      </TouchableOpacity>
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
    borderBottomColor: '#0a1926',
    backgroundColor: '#162a40'
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
  }
});


module.exports = UserInfo;
