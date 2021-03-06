/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Platform
  } = React;
let AppStore = require('../../framework/store/appStore');
let LoginAction = require('../../framework/action/loginAction');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let { Alert, Button, Device} = require('mx-artifacts');
let TabView = require('../../framework/system/tabView');
let ImagePicker = require('../../comp/utils/imagePicker');
let DictStyle = require('../../constants/dictStyle');
let CallPhone = require('../../comp/utils/callPhone');
let LoadExtendImage = require('../../comp/utils/loadExtendImage');

let Register_uploadNameCard = React.createClass({

  getStateFromStores() {
    let deviceModel = 'IOS';
    if (Platform.OS != 'ios') {
      deviceModel = AppStore.getDeviceModel();
    }
    return {
      disabled: true,
      nameCardFileUrl: '',
      deviceModel: deviceModel,
      APNSToken: AppStore.getAPNSToken()
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

  register: function () {
    if (this.state.nameCardFileUrl) {
      dismissKeyboard();
      this.props.exec(() => {
        return LoginAction.register({
          mobileNo: this.props.param.mobileNo,
          realName: this.props.param.realName,
          userName: this.props.param.email,
          referenceMobileNo: this.props.param.referenceMobileNo,
          orgId: this.props.param.orgId,
          nameCardFileUrl: this.state.nameCardFileUrl,
          deviceToken: this.state.APNSToken,
          deviceModel: this.state.deviceModel
        }).then((response) => {
          const { navigator } = this.props;
          if (navigator) {
              navigator.resetTo({comp: 'tabView'});
          }
        }).catch((errorData) => {
          throw errorData;
        });
      });
    }
  },

  uploadNameCard: function (uri) {
    this.setState({
      uri: uri,
      nameCardFileUrl: uri,
      disabled: false
    });
    //this.props.exec(() => {
    //  return LoginAction.uploadFile(uri, 'nameCardFile')
    //    .then((response) => {
    //      console.log(response);
    //      this.state.nameCardFileUrl = response.fileUrl;
    //      this.state.disabled = false;
    //    }).catch((errorData) => {
    //      throw errorData;
    //    });
    //});
  },

  returnImage: function () {
      return (

        <LoadExtendImage jobMode="select"
                         selectType="all"
                         source={{uri: this.state.uri}}
                         occurError={(error) => Alert(error)}
                         fileId="nameCard"
                         allowsEditing={true}
                         title="选择图片"
                         aspectX={5}
                         aspectY={3}
                         style={[styles.imageArea, styles.nameCard]}
                         uploadSuccess={(url)=>{this.uploadNameCard(url)}}
        >

          <Image style={{height:Platform.OS === 'android' ? 90 : 120,width:Platform.OS === 'android' ? 90 : 120,
                marginTop:Platform.OS === 'android' ? 1 : 20
              }}
                 resizeMode='cover'
                 source={require('../../image/login/nameCard.png')}
          />
          <Text
            style={[DictStyle.fontSize,DictStyle.fontColor,{marginBottom:Platform.OS === 'android' ? 1:30}]}>点击上传名片</Text>

        </LoadExtendImage>
      );


    //return (
    //  <LoadExtendImage jobMode="select"
    //                   source={{uri: this.state.uri}}
    //                   selectType="all"
    //                   occurError={(error) => Alert(error)}
    //                   fileId="nameCard"
    //                   allowsEditing={true}
    //                   title="选择图片"
    //                   aspectX = {5}
    //                   aspectY = {3}
    //                   style={[styles.imageArea, styles.nameCard]}
    //                   uploadSuccess={(url)=>{this.uploadNameCard(url)}}
    //  >
    //
    //  </LoadExtendImage>
    //);
    //return (
    //  <ImagePicker
    //    type="all"
    //    onSelected={(response) => this.uploadNameCard(response)}
    //    onError={(error) => Alert(error)}
    //    fileId="nameCard"
    //    allowsEditing={true}
    //    title="选择图片"
    //    aspectX = {5}
    //    aspectY = {3}
    //  >
    //    <Image
    //      style={{flexDirection: 'column',borderWidth: 1,borderColor: '#d4d6e0',borderRadius: 6,justifyContent: 'space-around', marginTop: 20,
    //       width: Platform.OS === 'android' ? Device.width-40:(Device.width-80),
    //      height:Platform.OS === 'android' ? (Device.width-40)*3/5:(Device.width-80) }}
    //      resizeMode='cover'
    //      source={{uri: this.state.uri, isStatic: true}}
    //    />
    //  </ImagePicker>
    //);
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title='上传名片'>
        <View style={{alignItems:'center'}}>
          {this.returnImage()}
        </View>

        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          <Text style={[DictStyle.fontSize,DictStyle.fontColor,{marginTop: 20}]} >
            注: 名片信息将辅助我们验证您的身份
          </Text>
          <Button
            containerStyle={{marginTop: 20}}
            style={{fontSize: 20, color: '#ffffff'}}
            disabledBackgroundColor = '#b3c7f5'
            enabledBackgroundColor = '#4b76df'
            disabled={this.state.disabled}
            onPress={()=>this.register()}
          >
            完成
          </Button>
        </View>
      </NavBarView>
    );
  }
//<View style={{position: 'absolute',bottom:20,left:50,right:50,flexDirection: 'column', marginTop: 30}}>
//  <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
//    <Text style={[DictStyle.fontSize,DictStyle.fontColor]}>联系客服: </Text>
//    <TouchableOpacity onPress={()=>{CallPhone.callPhone('022-28405347')}}>
//      <Text style={[DictStyle.fontSize,DictStyle.fontColor,{textDecorationLine: 'underline'}]}>022-28405347</Text>
//    </TouchableOpacity>
//  </View>
//</View>
});
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  nameCard: {
    borderWidth: 1,
    borderColor: '#d4d6e0',
    width: Platform.OS === 'android' ? Device.width - 24 : Device.width - 80,
    height: Platform.OS === 'android' ? (Device.width - 24) * 3 / 5 : Device.width - 80,
    marginTop: 20,
    borderRadius: 6
  },
  imageArea: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor:'#ffffff'

  }
});

module.exports = Register_uploadNameCard;
