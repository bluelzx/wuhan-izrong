/**
 * Created by wen on 5/31/16.
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  PropTypes,
  Text,
  View,
  Image,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform
  } = React;

let RNFS = require('react-native-fs');
let TimerMixin = require('react-timer-mixin');

let CacheDirPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath + '/fasCache/' : RNFS.DocumentDirectoryPath + '/fasCache/';
let jobId1 = -1, jobId2 = 1;

let ImAction = require('../../framework/action/imAction');
let Lightbox = require('../lightBox/Lightbox');
let ImagePicker = require('./imagePicker');

let LoadExtendImage = React.createClass({
  mixins: [TimerMixin],

  propTypes: {
    jobMode: PropTypes.oneOf(['load', 'upload', 'select']).isRequired,
    source: PropTypes.object,
    uploadFileUri: PropTypes.string,
    isEnableLoading: PropTypes.bool,
    startUpload: PropTypes.func,
    uploadSuccess: PropTypes.func,
    uploadFailed: PropTypes.func,
    occurError: PropTypes.func,

    selectType: PropTypes.oneOf(['all', 'camera', 'library']),
    longPress: PropTypes.func,
    allowsEditing: PropTypes.bool,
    fileId: PropTypes.string,
    title: PropTypes.string,
    onError: PropTypes.func,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    aspectX: PropTypes.number,
    aspectY: PropTypes.number
  },

  getDefaultProps: function () {
    return {
      isEnableLoading: true,
      customUpload: () => {
      },
      startUpload: () => {
      },
      uploadSuccess: () => {
      },
      uploadFailed: () => {
      }
    };
  },

  getInitialState: function () {
    return {
      loadEnd: false,
      failed: false
    };
  },

  componentWillMount: function () {
    this.mkdir();
  },

  componentDidMount: function () {
    if (this.props.jobMode === 'load') {
      this.loadFunc(this.props.source);
    } else if (this.props.jobMode === 'upload') {
      this.upLoadFile(this.props.uploadFileUri);
    } else if (this.props.jobMode === 'select') {
      if (this.props.source) {
        this.loadFunc(this.props.source);
      } else if (this.props.uploadFileUri) {
        this.upLoadFile(this.props.uploadFileUri);
      }
    }
  },

  getFileName: function (url) {

    let urlSuffix = url.split("http://img.izirong.com/").pop();
    let suffixArr = urlSuffix.split('?');

    let imageName = suffixArr[0];
    let qiniuSuffix = suffixArr[1] ? suffixArr[1] : null;

    return {
      imageName: imageName,
      qiniuSuffix: qiniuSuffix
    }
  },

  loadFunc: function (source) {

    if (source) {

      let imageName = this.getFileName(source.uri).imageName;
      let imageSuffix = imageName.split('.').pop();
      let imagePath = null;
      if (imageSuffix !== 'jpg') {
        imagePath = CacheDirPath + imageName + '.jpg';
      } else {
        imagePath = CacheDirPath + imageName;
      }

      RNFS.exists(imagePath).then((exists) => {
        if (exists) {
          this.setState({
            imagePath: {uri: 'file://' + imagePath},
            loadEnd: true
          });
        } else {
          return this.downloadFile(source.uri, imagePath);
        }
      });
    }
  },

  upLoadFile: function (uploadFileUri) {

    if (uploadFileUri) {

      this.props.startUpload();
      let fileName = uploadFileUri.split("/").pop();
      this.setState({
        imagePath: {uri: uploadFileUri},
        loadEnd: false
      });

      ImAction.uploadImage2(uploadFileUri, fileName)
        .then((response) => {
          this.props.uploadSuccess(response.fileUrl);
          this.setState({loadEnd: true});
          console.log(response);
        }).catch((error) => {
        this.setState({
          loadEnd: true,
          failed: true
        });
        this.props.uploadFailed(error);
        this.errorHandle('uploadError:' + error);
      });
    }
  },

  mkdir: function () {
    return RNFS.mkdir(CacheDirPath).then(success => {
      var text = success.toString();
      this.setState({output: text});
    }).catch(err => this.showError(err));
  },

  downloadFile: function (uri, Path) {
    var progress1 = data => {
      var text = JSON.stringify(data);
      this.setState({output: text});
    };

    var begin1 = res => {
      jobId1 = res.jobId;
    };

    RNFS.downloadFile(uri, Path, begin1, progress1)
      .then(res => {
        this.setState({
          imagePath: {uri: 'file://' + Path},
          loadEnd: true
        });
      }).catch((error) => {
      this.setState({
        failed: true
      });
      this.errorHandle('downloadError:' + error);
    });
  },

  _onSelected: function (uri) {
    this.upLoadFile(uri);
  },

  errorHandle: function (err) {
    this.props.occurError(err);
    console.log(err);
  },

  //showError: function (err) {
  //  this.setState({
  //    failed: true
  //  });
  //  console.log(err);
  //},

  loadingHandle: function () {
    if (this.props.isEnableLoading && !this.state.loadEnd) {
      return (
        Platform.OS === 'android' ?
          <ProgressBarAndroid style={styles.loadStyle} styleAttr="Inverse" color="#44bcb2"/> :
          <ActivityIndicatorIOS style={styles.loadStyle} animating={true} size="large" color="#44bcb2"/>
      );
    } else {
      return null;
    }
  },

//{ this.props.isEnableLoading ? (this.state.loadEnd ? null : this.showLoading()) : null }

  render: function () {
    if (this.props.jobMode === 'select') {
      return (
        <ImagePicker
          selectType={this.props.selectType}
          onSelected={(res) => this._onSelected(res)}
          longPress={this.props.longPress}
          onError={(err) => this.errorHandle('selectPhoto:' + err)}
          title={this.props.title}
          fileId={this.props.fileId}
          allowsEditing={this.props.allowsEditing}
          maxWidth={this.props.maxWidth}
          maxHeight={this.props.maxHeight}
          aspectX={this.props.aspectX}
          aspectY={this.props.aspectY}
        >
          <Image style={[styles.imageStyle,this.props.style]}
                 source={this.state.imagePath}
                 onLayout={() => {}}
          >
            { this.loadingHandle() }
          </Image>
        </ImagePicker>
      );
    } else {
      return (
        <Image style={[styles.imageStyle,this.props.style]}
               source={this.state.imagePath}
               onLayout={() => {}}
        >
          { this.loadingHandle() }
        </Image>
      );
    }

  }
});

let styles = StyleSheet.create({
  loadStyle: {
    height: 50,
    width: 50
  },

  imageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});


module.exports = LoadExtendImage;
