/**
 * Created by vison on 16/4/11.
 */
'use strict';

let React = require('react-native');
let {
  Platform,
  TouchableOpacity,
  Dimensions
  } = React;

let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
let dismissKeyboard = require('react-native-dismiss-keyboard');
let KeyGenerator = require('./keyGenerator');
let AppStore = require('../../framework/store/appStore');

let ImagePicker = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['all', 'camera', 'library']),
    onSelected: React.PropTypes.func.isRequired,
    allowsEditing: React.PropTypes.bool,
    onError: React.PropTypes.func,
    fileId: React.PropTypes.string,
    title: React.PropTypes.string,
    maxWidth: React.PropTypes.number,
    maxHeight: React.PropTypes.number,
    aspectX: React.PropTypes.number,
    aspectY: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      type: 'all',
      allowsEditing: false,
      title: '',
      maxWidth: Platform.OS === 'android' ? 600 : 480,
      maxHeight: Platform.OS === 'android' ? 300 : 960,
      aspectX: 1,
      aspectY: 1
    };
  },

  _selectIOS(desc) {
    var options = {
      title: this.props.title, // specify null or empty string to remove the title
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: '图库', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      maxWidth: this.props.maxWidth, // photos only
      maxHeight: this.props.maxHeight, // photos only
      aspectX: this.props.aspectX, // aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: this.props.aspectY, // aspectX:aspectY, the cropping image's ratio of width to height
      quality: 1.0, // photos only
      allowsEditing: this.props.allowsEditing, // Built in iOS functionality to resize/reposition the image
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'fasCache' // will save image at /Documents/images rather than the root
      },
      language: 'Chinese'
    };

    let onResponse = (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('UIImagePickerManager Error: ', response.error);
        if (this.props.onError) {
          this.props.onError(response.error);
        }
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('Response = ', response.uri);
        this.props.onSelected(response.uri.replace('file://', ''));
      }
    };

    switch (this.props.type) {
      case 'camera':
        UIImagePickerManager.launchCamera(options, (response) => onResponse(response));
        break;
      case 'library':
        UIImagePickerManager.launchImageLibrary(options, (response) => onResponse(response));
        break;
      case 'all':
      default:
        UIImagePickerManager.showImagePicker(options, (response) => onResponse(response));
    }
  },

  _selectAndroid: function () {
    let fileName = KeyGenerator.getImgKey(AppStore.getUserId());
    let cropSquare = true;
    if(this.props.aspectX != this.props.aspectY){
      cropSquare = false
    }
    UserPhotoPicModule.showImagePic(this.props.type, this.props.allowsEditing, fileName, cropSquare,
      (response) => {
        console.log('Response = ', response.uri);
        this.props.onSelected(response.uri);
      });
  },

  _selectPhoto() {
    dismissKeyboard();
    if (Platform.OS === 'android') {
      this._selectAndroid();
    } else {
      this._selectIOS();
    }
  },

  render: function () {
    return (
      <TouchableOpacity
        onLongPress={this.props.longPress}
        style={this.props.style}
        onPress={this._selectPhoto}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
});

module.exports = ImagePicker;
