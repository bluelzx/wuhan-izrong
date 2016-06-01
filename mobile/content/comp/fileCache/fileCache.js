/**
 * Created by baoyinghai on 5/31/16.
 */
'use strict';

var React = require('react-native');


var RNFS = require('react-native-fs');

var cacheDirPath =  RNFS.DocumentDirectoryPath + '/cache';
let createPath = function() {
  return RNFS.mkdir(cacheDirPath).then(success => {
    var text = success.toString();
    console.log(text);
  }).catch(err => this.showError(err));
}

createPath();

let downloadFile = function(uri,name,cb) {
  var progress = data => {
  };

  let imgPath = cacheDirPath+'/'+name+'.jpeg';
  RNFS.downloadFile(uri, imgPath, progress, progress).then(res => {
    fileUri[uri] = 'file://' + imgPath;
    //console.log();
    cb&&cb({ imagePath: { uri: fileUri[uri]} });
  }).catch(err => this.showError(err));
}


let fileUri = {};

var RNFSApp = {

  getCache:function(opt,id){
    let uri = opt.uri;
    if(!fileUri[uri]){
      downloadFile(uri,id);
      return opt;
    }
    return {uri:fileUri[uri]};
  }

}


module.exports = RNFSApp;
