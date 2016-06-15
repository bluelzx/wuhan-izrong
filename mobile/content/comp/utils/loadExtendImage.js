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
  Platform,
  TouchableHighlight
  } = React;

let RNFS = require('react-native-fs');
let TimerMixin = require('react-timer-mixin');
let CacheDirPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath + '/fasCache/' : RNFS.DocumentDirectoryPath + '/fasCache/';
let jobId1 = -1, jobId2 = 1;
let ImAction = require('../../framework/action/imAction');
let Lightbox = require('../lightBox/Lightbox');
let ImagePicker = require('./imagePicker');
let {Device,Alert} = require('mx-artifacts');
let {ImageSizeOrigin} = require('../../../config');
let ShowLargeImg = require('./showLargeImg');
let TabView = require('../../framework/system/tabView');

let LoadExtendImage = React.createClass({
  mixins: [TimerMixin],
  propTypes: {
    jobMode: PropTypes.oneOf(['load', 'upload', 'select']).isRequired,
    source: PropTypes.object,
    uploadFileUri: PropTypes.object,
    isSelectUpload: PropTypes.bool,
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
      isSelectUpload: true
    };
  },

  getInitialState: function () {
    return {
      fileExisted: false,
      filePath: {uri: ''},
      loadEnd: true,
      status: 'loading',
      modalVisible: false
    };
  },

  componentWillMount: function () {
    this.mkdir();
  },

  componentDidMount: function () {

    if (this.props.jobMode === 'load') {

      if (!this.state.fileExisted) {
        //console.log("adfgsdfgdfgsdfgdfgsdfgdfsdfgsdfgdfg"+this.props.source.uri.toString());
        let imagePath = this.getStoragePath(this.props.source.uri).imagePath;
        RNFS.exists(imagePath).then((exists) => {
          if (!exists) {
            this.downloadFile(this.props.source.uri, imagePath);
          } else {
            this.setState({
              fileExisted: true,
              filePath: {uri: 'file://' + imagePath},
              status: 'success'
            })
          }
        });
      }

    } else if (this.props.jobMode === 'upload') {
      let imagePath = null;
      if (this.props.uploadFileUri && this.props.uploadFileUri.uri) {
        imagePath = this.props.uploadFileUri.uri;
        this.upLoadFile(imagePath);
      } else if (this.props.source && this.props.source.uri) {
        imagePath = this.getStoragePath(this.props.source.uri).imagePath;
        if (!this.state.fileExisted) {
          RNFS.exists(imagePath).then((exists) => {
            if (!exists) {
              this.downloadFile(this.props.source.uri, imagePath);
            } else {
              this.setState({
                fileExisted: true,
                filePath: {uri: 'file://' + imagePath},
                status: 'success'
              })
            }
          });
        }
      } else {
        this.setState({
          status: 'success'
        })
      }

    } else if (this.props.jobMode === 'select') {

      let imagePath = null;
      if (this.props.source && this.props.source.uri) {
        imagePath = this.getStoragePath(this.props.source.uri).imagePath;
        if (!this.state.fileExisted) {
          RNFS.exists(imagePath).then((exists) => {
            if (!exists) {
              this.downloadFile(this.props.source.uri, imagePath);
            } else {
              this.setState({
                fileExisted: true,
                filePath: {uri: 'file://' + imagePath},
                status: 'success'
              })
            }
          });
        }
      } else if (this.props.uploadFileUri && this.props.uploadFileUri.uri) {
        imagePath = this.props.uploadFileUri.uri;
        this.upLoadFile(imagePath);
      } else {
        this.setState({
          status: 'success'
        })
      }

    }
  },

  refreshComponent: function () {
    let imagePath = null;
    if (this.props.source) {
      imagePath = this.getStoragePath(this.props.source.uri).imagePath;
      this.setState({
        fileExisted: true,
        filePath: {uri: 'file://' + imagePath},
        status: 'success'
      });
    } else if (this.props.uploadFileUri) {
      imagePath = this.props.uploadFileUri.uri;
      this.upLoadFile(imagePath);
    }
  },

  getStoragePath: function (url) {

    let urlSuffix = url.split("http://img.izirong.com/").pop();
    let suffixArr = urlSuffix.split('?');

    let imageName = suffixArr[0];
    let qiniuSuffix = suffixArr[1] ? suffixArr[1] : null;

    let imageSuffix = imageName.split('.').pop();
    let imagePath = null;
    if (imageSuffix !== 'jpg') {
      imagePath = CacheDirPath + imageName + '.jpg';
    } else {
      imagePath = CacheDirPath + imageName;
    }

    return {
      imagePath: imagePath,
      qiniuSuffix: qiniuSuffix
    }
  },

  upLoadFile: function (uploadFileUri) {
    console.log('weisen compress' + uploadFileUri);
    if (this.props.startUpload) {
      this.props.startUpload(uploadFileUri);
    }

    let fileName = uploadFileUri.split("/").pop();

    this.setState({
      fileExisted: true,
      filePath: {uri: 'file://' + uploadFileUri},
      status: 'loading'
    });

    ImAction.uploadImage2(uploadFileUri, fileName)
      .then((response) => {
        if (this.props.uploadSuccess) {
          this.props.uploadSuccess(response.fileUrl);
        }

        this.setState({
          status: 'success'
        })
      }).catch((error) => {
      this.setState({
        status: 'fail'
      });
      if (this.props.uploadFailed) {
        this.props.uploadFailed(error);
      }
      this.errorHandle('uploadError:' + error);
      throw(error);
    });

  },

  mkdir: function () {
    return RNFS.mkdir(CacheDirPath).then(success => {
      var text = success.toString();
    }).catch(err => this.showError(err));
  },

  downloadFile: function (uri, path) {
    var progress1 = data => {
      var text = JSON.stringify(data);
    };

    var begin1 = res => {
      jobId1 = res.jobId;
    };

    this.setState({
      loadEnd: false
    });

    RNFS.downloadFile(uri, path, begin1, progress1)
      .then(res => {
        this.setState({
          fileExisted: true,
          filePath: {uri: 'file://' + path},
          status: 'success'
        })
      }).catch((error) => {
      this.setState({
        status: 'fail'
      });
      this.errorHandle('downloadError:' + error);
    });
  },

  _onSelected: function (uri) {
    if (this.props.isSelectUpload) {
      this.upLoadFile(uri);
    }
    else {
      if ((!this.props.source || !this.props.source.uri) && (!this.props.uploadFileUri || !this.props.uploadFileUri.uri)) {
        if (this.props.startUpload) {
          this.props.startUpload(uri);
        }
      }
    }

  },

  errorHandle: function (err) {
    this.props.occurError(err);
    console.log(err);
  },

  showError: function (err) {
    console.log(err);
  },

  renderLoading: function () {
    return (
      Platform.OS === 'android' ?
        <ProgressBarAndroid style={styles.loadStyle} styleAttr="Inverse" color="#44bcb2"/> :
        <ActivityIndicatorIOS style={styles.loadStyle} animating={true} size="large" color="#44bcb2"/>
    );

  },

  toPage: function (name, uri) {
    const { navigator } = this.props.navigator;
    if (navigator) {
      navigator.push({
        comp: name,
        param: {
          uri: uri,
          filePath: this.state.filePath
        }
      })
    }
  },


  render: function () {

    if (this.state.status == 'loading') {

      return (
        <Image style={[styles.imageStyle,this.props.style]}
               resizeMode="cover"
               source={this.state.filePath}
        >
          { this.props.isEnableLoading ? this.renderLoading() : null}
        </Image>
      );

    } else if (this.state.status == 'fail') {

      return (
        <Image style={[styles.imageStyle,this.props.style]}
               resizeMode="cover"
               source={this.state.filePath}
        >
          <Text style={{color:'red'}}> fail </Text>
        </Image>
      );

    } else if ((!this.props.source || !this.props.source.uri) && (!this.props.uploadFileUri || !this.props.uploadFileUri.uri)) {
      return (
        <ImagePicker style={[styles.imageStyle,this.props.style]}
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
          {this.props.children}
        </ImagePicker>
      );
    } else {
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
                   source={this.state.filePath}
                   resizeMode="cover"
            >
            </Image>
          </ImagePicker>
        );
      } else {
        return (
          <View>
            <TouchableHighlight onPress={()=>this.toPage(ShowLargeImg,this.props.source.uri)}
                                underlayColor={'#ffffff'}>
              <Image style={[styles.imageStyle,this.props.style]}
                     source={this.state.filePath}
                     resizeMode="cover"
              >
              </Image>
            </TouchableHighlight>
          </View>
        );
      }
    }

  }
});

//<Modal
//  visible={this.state.modalVisible}
//  animationType='fade'
//>
//  <View style={styles.viewStyle}>
//    <TouchableHighlight onPress={this.disMissModal}
//                        onLongPress={this.showSaveDialog}>
//      <Image style={styles.largeImageStyle}
//             source={this.state.filePath}
//             resizeMode="contain"
//      >
//      </Image>
//    </TouchableHighlight>
//  </View>
//</Modal>

let styles = StyleSheet.create({
  loadStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  },

  imageStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  viewStyle: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#000000"
  },

  largeImageStyle: {
    height: Device.height,
    width: Device.width
  }
});


module.exports = LoadExtendImage;
