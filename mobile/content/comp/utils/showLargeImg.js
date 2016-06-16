/**
 * Created by wen on 6/12/16.
 */
'use strict';

let React = require('react-native');
let {Image,
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  Platform,
  ActionSheetIOS,
  CameraRoll,
  ProgressBarAndroid,
  ActivityIndicatorIOS
  } = React;
let jobId1 = -1, jobId2 = 1;
let RNFS = require('react-native-fs');
let {ImageSizeOrigin} = require('../../../config');
let {Device,Alert} = require('mx-artifacts');
let UserPhotoPicModule = require('NativeModules').UserPhotoPicModule;
let SaveFileModule = require('NativeModules').SaveFileModule;
let LoadExtendImage = require('./loadExtendImage');
let CacheDirPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath + '/fasCache/' : RNFS.DocumentDirectoryPath + '/fasCache/';
let LargeImg = React.createClass({
  getInitialState(){
    return {
      littleUri: this.props.param.uri,
      uri: this.props.param.uri.split('?')[0] + ImageSizeOrigin,
      showLoading: true,
      fileExisted: false,
      filePath: {uri: ''},
      littleFilePath: {uri: this.props.param.filePath.uri},
      status: 'loading'
    }
  },
  componentDidMount() {
    if (!this.state.fileExisted) {
      let imagePath = this.getStoragePath(this.state.uri).imagePath;
      RNFS.exists(imagePath).then((exists) => {
        if (!exists) {
          console.log("down load");
          this.downloadFile(this.state.uri, imagePath);
        } else {
          this.setState({
            fileExisted: true,
            filePath: {uri: 'file://' + imagePath},
            status: 'success'
          })
        }
      });
    }
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
      console.log("下载失败:"+'file://' + path);
      RNFS.unlink(path);
      this.setState({
        status: 'fail',
        fileExisted:false
      });
      //this.errorHandle('downloadError:' + error);
      //console.log("下载失败:"+this.state.filePath.uri);
    });
  },
  getStoragePath: function (url) {
    let urlSuffix = url.split("http://img.izirong.com/").pop();
    let suffixArr = urlSuffix.split('?');
    let imageName = suffixArr[0] + 'B';
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

  closeLargeImg: function () {
    const { navigator } = this.props;
    if (navigator) {
      navigator.pop();
    }
  },

  moreHandle: function () {
    if (Platform.OS === 'ios') {
      let options = ['保存图片', '返回'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: '更多操作',
          options: options,
          cancelButtonIndex: 1
        },
        (buttonIndex) => {
          if (buttonIndex == 0) {
            this.saveImg();
          } else if (buttonIndex == 1) {
            this.closeLargeImg();
          }
        });
    } else {
      UserPhotoPicModule.showImgDialog(
        () => {
          this.saveImg();
        }
      );
    }
  },

  saveImg: function () {
    if (Platform.OS === 'ios') {
      CameraRoll.saveImageWithTag(this.state.uri).then(
        (data) => {
          console.log(data);
          Alert('保存成功');
        },
        (err) => {
          console.log('CameraRoll,err' + err);
          Alert('保存失败');
        });
    } else {
      SaveFileModule.saveFile(this.state.uri,
        (index)=> {
          switch (index) {
            case 0:
              Alert('保存失败');
              break;
            case 1:
              Alert('成功保存至/fas-wuhan文件夹');
              break;
            default:
              break;
          }
        });
    }
  },

  renderLoading: function () {
    if (this.state.showLoading) {
      return (
        Platform.OS === 'android' ?
          <ProgressBarAndroid style={styles.loadStyle} styleAttr="Inverse" color="#44bcb2"/> :
          <ActivityIndicatorIOS style={styles.loadStyle} animating={true} size="large" color="#44bcb2"/>
      );
    } else {
      return null;
    }
  },
refresh:function(){
  this.setState({
    status:'loading'
  });
  this.componentDidMount();
},
  render(){
    if (this.state.status == 'loading') {
      console.log("loading");
      return (
        <TouchableHighlight onPress={this.closeLargeImg}
                            style={styles.viewStyle}>
          <View style={styles.viewStyle}>
          <Image style={styles.largeImageStyle}
                 resizeMode="contain"
                 source={this.state.littleFilePath}
          >
            {this.renderLoading()}
          </Image>
          </View>
        </TouchableHighlight>
      )
    } else if(this.state.status == 'fail'){
      return(
        <TouchableHighlight onPress={this.closeLargeImg}
                            style={styles.viewStyle}>
          <View style={styles.viewStyle}>
          <Image style={styles.largeImageStyle}
                 resizeMode="contain"
                 source={this.state.littleFilePath}
          >
          </Image>
            <Text style={{color:'#ffffff'}}>原图加载失败</Text>
          </View>
        </TouchableHighlight>
      )
    }
    else if(this.state.status == 'success'){
      console.log("大图路径:"+this.state.filePath.uri)
      return (
        <TouchableHighlight onPress={this.closeLargeImg}
                            onLongPress={this.moreHandle}
                            style={styles.viewStyle}>
          <Image style={styles.largeImageStyle}
                 resizeMode="contain"
                 source={this.state.filePath}
          >
          </Image>
        </TouchableHighlight>
      )
    }
  }
});

let styles = StyleSheet.create({

  viewStyle: {
    flex: 1,
    height: Device.height,
    width: Device.width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#000000"
  },

  largeImageStyle: {
    flex: 1,
    height: Device.height,
    width: Device.width,
    justifyContent: 'center',
    alignItems: 'center'
  },

  loadStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  }
});

module.exports = LargeImg;

