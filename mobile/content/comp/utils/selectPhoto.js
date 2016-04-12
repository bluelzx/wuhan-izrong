/**
 * Created by vison on 16/4/11.
 */
'use strict';

let React = require('react-native');
let PhotoPicker = require('NativeModules').PhotoPickerModule;
let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;

let SelectPhoto = React.createClass({

  selectPhoto: function (desc,name,callback) {
    let uri = '';
    if (Platform.OS == 'android') {
      uri = this.selectAndroid();
    } else {
      uri = this.selectIOS('用户名片', 'nameCardFileUrl');
    }
    callback(uri);
  },

  selectIOS(desc){
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
        console.log('Response = ', response.uri);
        return response.uri.replace('file://', '');
      }
    });
  },

  selectAndroid: function () {
    // PhotoPicker.showImagePic(true,'nameCard',(response)=>console.log('Response = ', response));
    UserPhotoPicModule.showImagePic(true, 'nameCard',
      (response)=> {
        return response.uri;
        console.log('Response = ', response.uri);
      });
  },

  render: function(){

  }
});

module.exports = SelectPhoto;
