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
  TouchableOpacity,
  Image,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform
  } = React;

let RNFS = require('react-native-fs');
let TimerMixin = require('react-timer-mixin');
let _ = require('lodash');

let CacheDirPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath + '/fasCache/' : RNFS.DocumentDirectoryPath + '/fasCache/';
let jobId1 = -1, jobId2 = 1;

let ImAction = require('../../framework/action/imAction');
let Lightbox = require('../lightBox/Lightbox');

let LoadExtendImage = React.createClass({
  mixins: [TimerMixin],

  propTypes: {
    jobMode: PropTypes.oneOf(['load', 'upload']).isRequired,
    source: PropTypes.object,
    isEnableLoading: PropTypes.bool,
    localPath: PropTypes.string,
    upLoadURL: PropTypes.string,
    customUpload: PropTypes.func,
    startUpload: PropTypes.func,
    uploadSuccess: PropTypes.func,
    uploadFailed: PropTypes.func
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
      downloadProgress: 0,
      loadSuccess: false,
      failed: false
    };
  },

  componentWillMount: function () {
    this.mkdir();
  },

  componentDidMount: function () {
    if (this.props.jobMode === 'load') {
      this.loadFunc();
    } else {
      this.upLoadFile();
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

  loadFunc: function () {
    if (this.props.source) {

      let imageName = this.getFileName(this.props.source.uri).imageName;
      let imageSuffix = imageName.split('.').pop();
      let imagePath = null;
      if (imageSuffix !== 'jpg') {
        imagePath = CacheDirPath + imageName + '.jpg';
      } else {
        imagePath = CacheDirPath + imageName;
      }

      RNFS.exists(imagePath).then((exists) => {
        if (exists) {
          return RNFS.stat(imagePath).then(info => {
            if (info.size > 50) {
              this.setState({
                imagePath: {uri: 'file://' + imagePath},
                loadSuccess: true
              });
            } else {
              return this.downloadFile(this.props.source.uri, imagePath);
            }
          });
        } else {
          return this.downloadFile(this.props.source.uri, imagePath);
        }
      });
    }
  },

  upLoadFile: function () {
    this.props.startUpload();
    let fileName = this.props.localPath.split("/").pop();


    if (this.props.localPath) {
      this.setState({
        imagePath: {uri: this.props.localPath},
        loadSuccess: false
      });
      ImAction.uploadImage2(this.props.localPath, fileName)
        .then((response) => {

          this.props.uploadSuccess(response);
          this.setState({loadSuccess: true});
          console.log(response);

        }).catch((error) => {

        this.setState({
          loadSuccess: true,
          failed: true
        });
        this.props.uploadFailed(error);
      });
    } else {

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
          loadSuccess: true
        });
      }).catch(err => this.showError(err));
  },

  showError: function (err) {

    this.setState({
      failed: true
    });
    console.log(err);
  },

  showLoading: function () {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid style={styles.loadStyle}
                            styleAttr="Inverse"
                            color="#fff"
        />
      );
    } else {
      return (
        <ActivityIndicatorIOS style={styles.loadStyle}
                              animating={true}
                              size="large"
                              color="#fff"
        />
      );
    }
  },

  _onPress: function () {
    if (this.props.jobMode === 'load') {

      if (this.state.failed) {
        //this.loadFunc();
      }

    } else {

      if (this.state.failed) {
        //this.upLoadFile();
      }

    }
  },

  render: function () {
    console.log(this.state.imagePath)
    return (
      <View style={[{backgroundColor:'#eee'},this.props.style]}
            onLayout={() => {}}
      >
          <Image style={[styles.imageStyle]}
                 source={this.state.imagePath}
                 onLayout={() => {}}
          >
            { this.props.isEnableLoading ? (this.state.loadSuccess ? null : this.showLoading()) : null }
          </Image>
      </View>
    );
  }
});

let styles = StyleSheet.create({
  loadStyle: {
    height: 50,
    width: 50
  },

  imageStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});


module.exports = LoadExtendImage;
