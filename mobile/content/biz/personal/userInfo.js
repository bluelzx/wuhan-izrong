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
let PhoneNumber = require('../../comp/utils/numberHelper').phoneNumber;
let NameCircular = require('../im/nameCircular').NameCircular;
let {ORG_CHANGE,USER_CHANGE} = require('../../constants/dictEvent');

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
      phoneNumber: userInfo.phoneNumber == '' || !userInfo.phoneNumber ? '未填写':userInfo.phoneNumber,
      publicPhone: userInfo.publicPhone,
      qqNo: userInfo.qqNo == '' || !userInfo.qqNo ? '未填写':userInfo.qqNo,
      publicQQ: userInfo.publicQQ,
      weChatNo: userInfo.weChatNo == '' || !userInfo.weChatNo ? '未填写':userInfo.weChatNo,
      publicWeChat: userInfo.publicWeChat,
      email: userInfo.email,
      publicEmail: userInfo.publicEmail,
      orgBeanName: orgBean.orgValue,
      department: userInfo.department == '' || !userInfo.department ? '未填写':userInfo.department,
      publicDepart: userInfo.publicDepart,
      jobTitle: userInfo.jobTitle == '' || !userInfo.jobTitle ? '未填写': userInfo.jobTitle,
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
    AppStore.addChangeListener(this._onChange,USER_CHANGE);
    AppStore.addChangeListener(this._onChange,ORG_CHANGE);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange,USER_CHANGE);
    AppStore.removeChangeListener(this._onChange,ORG_CHANGE);
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
          return UserInfoAction.updateUserInfo([{
            column: 'photoStoredFileUrl',
            value: response.fileUrl
          }]).then(
            ()=> {
              AppStore.updateUserInfo('photoFileUrl', response.fileUrl);
            }
          ).catch((errorData) => {
            throw errorData;
          });
        }).catch((errorData) => {
          throw errorData;
        });
    });
  },

  returnImage: function () {
    if (!_.isEmpty(this.state.photoFileUrl)) {
      return (
        <Image style={styles.head} resizeMode="cover" source={{uri: this.state.photoFileUrl}}/>
      );
    }
    return (
      <NameCircular name={this.state.realName}/>
    );
  },

  toEdit: function (title, name, value, publicName, publicValue, type, maxLength, needEdit, needPublic) {
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
          needEdit: needEdit,
          needPublic: needPublic
        }
      });
    }
  },

  logout: function () {
    Alert('确认退出当前账号？', ()=> {
      this.props.exec(() => {
        return LoginAction.logout(this.state.userId)
          .then((response) => {
            const { navigator } = this.props;
            navigator.resetTo({comp: Login});
          }).catch((errorData) => {
            throw errorData;
          });
      });
    }, ()=> {
    });
  },

  renderRow: function (desc, imagePath, name, value, pubName, pubValue, type, maxLength, needEdit, needPublic, hiddenArrow) {

    let showValue = '';
    if (value === null || value == '未填写') {
      showValue = '未填写';
    } else {
      if (pubValue) {
        showValue = value + '(公开)';
        if(name == 'email'){
          showValue = value;
        }
      } else {
        showValue = value + '(不公开)';
      }
    }
    if (hiddenArrow) {
      return (
        <Item desc={desc} imgPath={imagePath} value={showValue} hiddenArrow={true}
              func={() => {}}
        />);
    }
    return (
      <Item desc={desc} imgPath={imagePath} value={showValue}
            func={() => this.toEdit(desc, name, value, pubName, pubValue, type, maxLength, needEdit, needPublic)}
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
          <View style={styles.layout}>
            <ImagePicker
              type="all"
              onSelected={(response) => this.uploadUserPoto(response)}
              onError={(error) => Alert(error)}
              title="选择图片"
              fileId="userPhoto"
              allowsEditing={true}
              style={{marginLeft: 20}}
            >
              {this.returnImage()}
            </ImagePicker>
            <TouchableOpacity
              style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}
              onPress={()=>this.toEdit('真实姓名', 'realName', this.state.realName, 'publicRealName', true, 'default', 20, true, false)}
            >
              <Text style={{color: '#ffffff', fontSize: 18, textAlign: 'right', marginRight: 20,width: 150}}
                    numberOfLines={1}
              >
                {this.state.realName}
              </Text>
              <Icon style={{marginRight: 20}} name="ios-arrow-right" size={30} color={'#ffffff'}/>
            </TouchableOpacity>
          </View>

          {this.renderRow('手机号', require('../../image/user/mobileNo.png'), 'mobileNumber', this.state.mobileNumber,
            'publicMobile', this.state.publicMobile, 'number-pad', 11, false, true, false)}

          {this.renderRow('座机号', require('../../image/user/telephoneNo.png'), 'phoneNumber', this.state.phoneNumber, 'publicPhone',
            this.state.publicPhone, 'number-pad', 11, true, true, false)}

          {this.renderRow('QQ', require('../../image/user/qqNo.png'), 'qqNo', this.state.qqNo, 'publicQq',
            this.state.publicQQ, 'number-pad', 20, true, true, false)}

          {this.renderRow('微信', require('../../image/user/wechatNo.png'), 'weChatNo', this.state.weChatNo, 'publicWeChat',
            this.state.publicWeChat, 'default', 40, true, true, false)}

          {this.renderRow('邮箱', require('../../image/user/email.png'), 'email', this.state.email, 'publicEmail',
            this.state.publicEmail, 'email-address', 60, false, false, true)}

          <View style={{marginTop: 5}}>
            {this.renderRow('机构', require('../../image/user/comp.png'), 'organization', this.state.orgBeanName, '',
              'ascii-capable', 'default', 20, false, false, true)}

            {this.renderRow('部门', require('../../image/user/department.png'), 'department', this.state.department, 'publicDepart',
              this.state.publicDepart, 'default', 20, true, true, false)}

            {this.renderRow('职位', require('../../image/user/jobTitle.png'), 'jobTitle', this.state.jobTitle, 'publicTitle',
              this.state.publicTitle, 'default', 20, true, true, false)}
          </View>
        </ScrollView>
      </NavBarView>
    );
  },

  renderLogout: function () {
    return (
      <TouchableOpacity style={{width: 150, marginLeft: -20}} onPress={()=>this.logout()}>
        <Text style={{color: '#ffffff'}}>退出登录</Text>
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
    borderWidth: 1
  },
  headText: {
    color: '#FF0000',
    fontSize: 50,
    fontStyle: 'italic',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});


module.exports = UserInfo;
