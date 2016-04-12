/**
 * Created by vison on 16/4/5.
 */
'use strict';

let React = require('react-native');
let {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  Image,
  Platform
  } = React;
let AppStore = require('../../framework/store/appStore');
//let UserStore = require('../../framework/store/userStore');
let LoginAction = require('../../framework/action/loginAction');
//let Register_checkPhone = require('./register_checkPhone');
//let Forget_checkPhone = require('./forget_checkPhone');
let NavBarView = require('../../framework/system/navBarView');
let dismissKeyboard = require('react-native-dismiss-keyboard');
let Input = require('../../comp/utils/input');
let { Alert, Button } = require('mx-artifacts');
let PhotoPicker = require('NativeModules').PhotoPickerModule;
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;
let TabView = require('../../framework/system/tabView');
let SelectPhoto = require('../../comp/utils/selectPhoto');

let Register_uploadNameCard = React.createClass({
  getStateFromStores() {
    return {
      url: '',
      uploaded: true,
      nameCardFileUrl:''

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

  toPage: function (name) {
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({comp: name})
    }
  },

  register: function () {
    if (this.state.uploaded) {
      dismissKeyboard();
      this.props.exec(() => {
        return LoginAction.register({
          mobileNo: this.props.mobileNo,
          realName: this.props.realName,
          userName: this.props.userName,
          orgId: this.props.orgId,
          nameCardFileUrl: this.props.url
        }).then((response) => {
          const { navigator } = this.props;
          if (navigator) {
            if (!this.state.checked) {
              navigator.push(
                {
                  comp: TabView
                });
            }
          }
        }).catch((errorData) => {
          //Alert(msg.msgContent);
          throw errorData;
        });
      });
    }
  },

  selectIOS(desc,name){
    var options = {
      title: desc, // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '图库', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 1, // aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
      quality: 1, // photos only
      allowsEditing: true, // Built in iOS functionality to resize/reposition the image
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
      }
    };

    UIImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('UIImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source = response.uri.replace('file://', '');
        this.setState({
          [name]: source
        });
        this.uploadNameCard(name);
      }
    });
  },
  selectAndroid: function (desc,name) {
    // PhotoPicker.showImagePic(true,'nameCard',(response)=>console.log('Response = ', response));
    UserPhotoPicModule.showImagePic(true, name,
      (response)=> {
        console.log('Response = ', response);
        this.setState({
          nameCardFileUrl: response.uri
        });
        this.uploadNameCard(name);
      });
  },

  selectPhoto: function(){
    if (Platform.OS == 'android') {
      this.selectAndroid('用户名片','nameCardFileUrl');
    } else {
      this.selectIOS('用户名片','nameCardFileUrl');
    }
   // SelectPhoto.selectPhoto('用户名片','nameCardFileUrl',(uri)=>{console.log(uri)});
  },

  uploadNameCard: function(fileFieldName){
      this.props.exec(() => {
        return LoginAction.uploadNameCard(fileFieldName,{
        [fileFieldName]: this.state.nameCardFileUrl
        }).then((response) => {
          console.log(response);
        }).catch((errorData) => {
          //Alert(msg.msgContent);
          throw errorData;
        });
      });
  },

  returnImage: function () {
    if (this.state.nameCardFileUrl == '') {
      return (
        <TouchableHighlight style={[styles.nameCard,{backgroundColor: '#0a1926'}]} activeOpacity={0.8} underlayColor='#18304b'
                            onPress={()=>this.selectPhoto()}>
          <View style={styles.imageArea}>
            <Image
              resizeMode='cover'
              source={require("../../image/login/nameCard.png")}/>
            <Text style={{color:'#ffffff'}}>点击上传名片</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight style={styles.nameCard} activeOpacity={0.8} underlayColor='#18304b'
                            onPress={()=>this.selectPhoto()}>
          <Image style={{flexDirection:'column',flex:1,alignItems:'center',justifyContent:'space-around'}}
                 resizeMode='cover'
                 source={{uri:this.state.nameCardFileUrl}}
          />
        </TouchableHighlight>
      );
    }
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} fontColor='#ffffff' backgroundColor='#1151B1'
                  contentBackgroundColor='#18304D' title='上传名片' showBack={true} showBar={true}>
        <View style={[{flexDirection: 'column'}, styles.paddingLR]}>
          {this.returnImage()}
          <Button
            containerStyle={{marginTop:20,backgroundColor:'#1151B1'}}
            style={{fontSize: 20, color: '#ffffff'}}
            styleDisabled={{color: 'red'}}
            onPress={()=>this.register()}>
            完成
          </Button>
        </View>
      </NavBarView>
    )
  }
});
let styles = StyleSheet.create({
  paddingLR: {
    paddingLeft: 12,
    paddingRight: 12
  },
  nameCard: {
    borderWidth: 1,
    borderColor: '#1151B1',
    height: 200,
    marginTop: 20,
    borderRadius: 6
  },
  imageArea: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

module.exports = Register_uploadNameCard;
