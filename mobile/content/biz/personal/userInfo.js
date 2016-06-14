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
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
  } = React;

let _ = require('lodash');
let NavBarView = require('../../framework/system/navBarView');
let Item = require('../../comp/utils/item');
let Icon = require('react-native-vector-icons/Ionicons');
let TextEdit = require('./textEdit');
let { Alert } = require('mx-artifacts');
let UserInfoAction = require('../../framework/action/userInfoAction');
let LoginAction = require('../../framework/action/loginAction');
let ImagePicker = require('../../comp/utils/imagePicker');
let AppStore = require('../../framework/store/appStore');
let NameCircular = require('../im/nameCircular').NameCircular;
let {ORG_CHANGE,USER_CHANGE,MYBIZ_CHANGE} = require('../../constants/dictEvent');
let PlainStyle = require('../../constants/dictStyle');
let DictStyle = require('../../constants/dictStyle');
let Login = require('../../biz/login/login');
let {ImageSize50} = require('../../../config');
let LoadExtendImage = require('../../comp/utils/loadExtendImage');

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
        phoneNumber: userInfo.phoneNumber == '' || !userInfo.phoneNumber ? '未填写' : userInfo.phoneNumber,
        publicPhone: userInfo.publicPhone,
        qqNo: userInfo.qqNo == '' || !userInfo.qqNo ? '未填写' : userInfo.qqNo,
        publicQQ: userInfo.publicQQ,
        weChatNo: userInfo.weChatNo == '' || !userInfo.weChatNo ? '未填写' : userInfo.weChatNo,
        publicWeChat: userInfo.publicWeChat,
        email: userInfo.email,
        publicEmail: userInfo.publicEmail,
        orgBeanName: orgBean.orgValue,
        department: userInfo.department == '' || !userInfo.department ? '未填写' : userInfo.department,
        publicDepart: userInfo.publicDepart,
        jobTitle: userInfo.jobTitle == '' || !userInfo.jobTitle ? '未填写' : userInfo.jobTitle,
        publicTitle: userInfo.publicTitle,
        address: userInfo.address,
        publicAddress: userInfo.publicAddress,
        nameCardFileUrl: userInfo.nameCardFileUrl,
        certificated: userInfo.certified,
        certificatedValue: userInfo.certified ? '(已认证)' : '(未认证)'
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

    updateUserPoto: function (url) {
      this.props.exec(() => {
        return UserInfoAction.updateUserInfo([{
          column: 'photoStoredFileUrl',
          value: url
        }]).then(
          ()=> {
            AppStore.updateUserInfo('photoFileUrl', url);
          }
        ).catch((errorData) => {
          throw errorData;
        });
      });
    },

    returnImage: function () {
      let uri = this.state.photoFileUrl;
      if (!this.state.certificated) {
         uri = uri + ImageSize50;
      }
      return (
        <View style={{marginLeft:20}}>
        <LoadExtendImage jobMode="select"
                         source={{uri: uri}}
                         selectType="all"
                         occurError={(error) => Alert(error)}
                         title="选择图片"
                         fileId="userPhoto"
                         allowsEditing={true}
                         style={styles.head}
                         uploadSuccess={(url)=>{this.updateUserPoto(url)}}
        >
          <NameCircular name={this.state.realName} isV={this.state.certificated}/>
        </LoadExtendImage>
          {()=>{
            if(this.state.certificated && this.state.photoFileUrl)
            return (
                    <Image style={[styles.certified,{position: 'absolute',bottom:5,left:40,right:40}]}
                           resizeMode="cover" source={require('../../image/user/certificated.png')}/>
            );
          }}
          </View>
      );


        //if (this.state.certificated) {
        //  return (
        //    <View style={{marginLeft: 20,paddingRight:20}}>
        //      <LoadExtendImage jobMode="select"
        //                       source={{uri: this.state.photoFileUrl}}
        //                       selectType="all"
        //                       occurError={(error) => Alert(error)}
        //                       title="选择图片"
        //                       fileId="userPhoto"
        //                       allowsEditing={true}
        //                       style={styles.head}
        //                       uploadSuccess={(url)=>{this.updateUserPoto(url)}}
        //      >
        //      <NameCircular name={this.state.realName} isV={this.state.certificated}/>
        //      <Image style={[styles.certified,{position: 'absolute',bottom:5,left:40,right:40}]}
        //             resizeMode="cover" source={require('../../image/user/certificated.png')}/>
        //        </LoadExtendImage>
        //    </View>
        //  );
        //}
        //let uri = this.state.photoFileUrl + ImageSize50;
        //return (
        //  //<Image style={styles.head} resizeMode="cover" source={{uri: uri}}/>
        //  <View style={{marginLeft: 20,paddingRight:20}}>
        //    <LoadExtendImage jobMode="select"
        //                     source={{uri: this.state.photoFileUrl}}
        //                     selectType="all"
        //                     occurError={(error) => Alert(error)}
        //                     title="选择图片"
        //                     fileId="userPhoto"
        //                     allowsEditing={true}
        //                     style={styles.head}
        //                     uploadSuccess={(url)=>{this.updateUserPoto(url)}}
        //    >
        //      <NameCircular name={this.state.realName} isV={this.state.certificated}/>
        //    </LoadExtendImage>
        //  </View>
        //);
        //




    },
//<Image style={styles.head} resizeMode="cover" source={{uri: this.state.photoFileUrl}}/>

//<ImagePicker
//  type="all"
//  onSelected={(response) => this.uploadUserPoto(response)}
//  onError={(error) => Alert(error)}
//  title="选择图片"
//  fileId="userPhoto"
//  allowsEditing={true}
//  style={{marginLeft: 20,paddingRight:20}}
//>
//  </ImagePicker>

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
    }
    ,

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
    }
    ,

    renderRow: function (desc, imagePath, name, value, pubName, pubValue, type, maxLength, needEdit, needPublic, hiddenArrow) {

      let showValue = '';
      if (value === null || value == '未填写') {
        showValue = '未填写';
      } else {
        if (pubValue) {
          showValue = value + '(公开)';
          if (name == 'email') {
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
    }
    ,

    render: function () {
      let {title} = this.props;
      return (
        <NavBarView navigator={this.props.navigator} foolor='#ffffff'
                    contentBackgroundColor={PlainStyle.colorSet.content} title='个人信息' showBack={true} showBar={true}
                    actionButton={this.renderLogout}>
          <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}
                      backgroundColor={PlainStyle.colorSet.content}>

            <View style={[styles.layout,DictStyle.userInfoBorderTop,DictStyle.userInfoBorderBottom]}>


              {this.returnImage()}


              <TouchableOpacity
                style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}
                onPress={()=>this.toEdit('真实姓名', 'realName', this.state.realName, 'isPublicRealName', true, 'default', 10, true, false)}
              >
                <Text style={[DictStyle.userInfoValueItem,{ marginRight: 20,width: 150}]}
                      numberOfLines={1}
                >
                  {this.state.realName}
                </Text>
                <Icon style={{marginRight: 20}} name="ios-arrow-right" size={30} color={PlainStyle.colorSet.arrowColor}/>
              </TouchableOpacity>
            </View>

            {this.renderRow('手机号', require('../../image/user/mobileNo.png'), 'mobileNumber', this.state.mobileNumber,
              'isPublicMobile', this.state.publicMobile, 'number-pad', 11, false, true, false)}

            {this.renderRow('座机号', require('../../image/user/telephoneNo.png'), 'phoneNumber', this.state.phoneNumber, 'isPublicPhone',
              this.state.publicPhone, 'number-pad', 11, true, true, false)}

            {/*this.renderRow('QQ', require('../../image/user/qqNo.png'), 'qqNo', this.state.qqNo, 'isPublicQq',
             this.state.publicQQ, 'number-pad', 20, true, true, false)*/}

            {/*this.renderRow('微信', require('../../image/user/wechatNo.png'), 'weChatNo', this.state.weChatNo, 'isPublicWeChat',
             this.state.publicWeChat, 'default', 40, true, true, false)*/}

            <TouchableHighlight activeOpacity={0.8} underlayColor={PlainStyle.colorSet.content} onPress={()=>{}}>
              <View style={[styles.listLayout,DictStyle.userInfoBorderBottom,{alignItems:'center'}]}>
                <View
                  style={{flexDirection:'row',backgroundColor:PlainStyle.colorSet.personalItemColor,width:Dimensions.get('window').width/5,alignItems:'center'}}>
                  <Image style={styles.circle} source={require('../../image/user/email.png')}/>
                  <Text style={styles.title}>邮箱</Text>
                </View>
                <View
                  style={{flexDirection:'row',alignItems:'center',marginRight:20,width:Dimensions.get('window').width/5*3,
                  backgroundColor:PlainStyle.colorSet.personalItemColor,justifyContent: 'space-between'}}>
                  <Text style={[DictStyle.userInfoValueItem,{flex:1}]}
                        numberOfLines={2}>
                    {this.state.email}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>

            <View style={[{marginTop: 10},DictStyle.userInfoBorderTop]}>
              <TouchableHighlight activeOpacity={0.8} underlayColor={PlainStyle.colorSet.content} onPress={()=>{}}>
                <View>
                  <View style={[styles.listLayout,{alignItems:'center'}]}>
                    <View
                      style={{flexDirection:'row',backgroundColor:PlainStyle.colorSet.personalItemColor,width:Dimensions.get('window').width/5,alignItems:'center'}}>
                      <Image style={styles.circle} source={require('../../image/user/comp.png')}/>
                      <Text style={styles.title}>机构</Text>
                    </View>
                    <View
                      style={{flexDirection:'row',alignItems:'center',marginRight:20,width:Dimensions.get('window').width/5*3,
                    backgroundColor:PlainStyle.colorSet.personalItemColor,justifyContent: 'space-between'}}>
                      <Text style={[DictStyle.userInfoValueItem,{flex:1}]}
                            numberOfLines={2}>
                        {this.state.orgBeanName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bottomStyle}/>
                </View>
              </TouchableHighlight>

              {this.renderRow('部门', require('../../image/user/department.png'), 'department', this.state.department, 'isPublicDepart',
                this.state.publicDepart, 'default', 20, true, true, false)}

              {this.renderRow('职位', require('../../image/user/jobTitle.png'), 'jobTitle', this.state.jobTitle, 'isPublicTitle',
                this.state.publicTitle, 'default', 20, true, true, false)}
            </View>
          </ScrollView>
        </NavBarView>
      );
    }
    ,

    renderLogout: function () {
      return (
        <TouchableOpacity style={{marginLeft: -20,padding:10}} onPress={()=>this.logout()}>
          <Text style={{color: '#ffffff'}}>退出</Text>
        </TouchableOpacity>
      );
    }
  })
  ;

let styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 84,
    borderBottomWidth: 0.5,
    borderBottomColor: '#0a1926',
    backgroundColor: PlainStyle.colorSet.personalItemColor
  },

  head: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#cccccc',
    borderWidth: 1
  },
  certified: {
    width: 15,
    height: 15
  },
  headText: {
    color: '#FF0000',
    fontSize: 50,
    fontStyle: 'italic',
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  borderTop: {
    borderTopWidth: 1
  },
  listLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 51,
    paddingLeft: 16,
    backgroundColor: PlainStyle.colorSet.personalItemColor
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 1,
    marginRight: 16
  },
  title: {
    fontSize: 18
  },
  bottomStyle: {
    height: 1,
    backgroundColor: PlainStyle.colorSet.userInfoBorderColor
  }
});


module.exports = UserInfo;
