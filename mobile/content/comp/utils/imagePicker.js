/**
 * Created by vison on 16/4/11.
 */
'use strict';

let React = require('react-native');
let {
  Platform,
  TouchableOpacity
  } = React;

let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

let ImagePicker = React.createClass({

  propTypes: {
    type: React.PropTypes.oneOf(['all', 'camera', 'library']),
    onSelected: React.PropTypes.func.isRequired,
    allowsEditing: React.PropTypes.bool,
    onError: React.PropTypes.func,
    fileId: React.PropTypes.string,
    title: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      type: 'all',
      allowsEditing: false,
      title: ''
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
    // PhotoPicker.showImagePic(true,'nameCard',(response)=>console.log('Response = ', response));
    UserPhotoPicModule.showImagePic(true, this.props.fileId,
      (response) => {
        console.log('Response = ', response.uri);
        this.props.onSelected(response.uri);
      });
  },

  _selectPhoto() {
    if (Platform.OS === 'android') {
      this._selectAndroid();
    } else {
      this._selectIOS();
    }
  },

  render: function () {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={this._selectPhoto}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
});

module.exports = ImagePicker;
