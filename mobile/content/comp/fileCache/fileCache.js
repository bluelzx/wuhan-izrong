/**
 * Created by baoyinghai on 5/31/16.
 */
'use strict';

var RNFS = require('react-native-fs');

var cacheDirPath =  RNFS.DocumentDirectoryPath + '/cache';

var  Persister = require('../../framework/persister/persisterFacade');

let fileUri = {};

let loadMap = function(){
  fileUri = Persister.getPathCache();
}

let createPath = function() {
  return RNFS.mkdir(cacheDirPath).then(success => {
    var text = success.toString();
    console.log(text);
    loadMap();
  }).catch(err => this.showError(err));
}

createPath();

let downloadFile = function(uri,name,cb) {
  fileUri[uri] = 'downloading';
  var progress = data => {
  };
  name = uri&&uri.split("/").pop();
  let imgPath = cacheDirPath+'/'+name+'.jpeg';
  RNFS.downloadFile(uri, imgPath, progress, progress).then(res => {
    fileUri[uri] = 'file://' + imgPath;
    Persister.addPhotoHeader(uri, fileUri[uri]);
  }).catch(err => this.showError(err));
}

var RNFSApp = {

  getCache:function(opt,id){
    let uri = opt;
    if(!uri){
      return null;
    }
    if(!fileUri[uri]){
      downloadFile(uri,id);
      return null;
    }
    if(fileUri[uri] == 'downloading'){
      return null;
    }
    return fileUri[uri];
  }

}


module.exports = RNFSApp;
