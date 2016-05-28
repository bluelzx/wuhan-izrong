var Qs = require('qs');
var { Alert } = require('mx-artifacts');
var AppStore = require('../store/appStore');
var qiniu = require('./qiniu/index');
var MxFetch = require('./mxFetch');
var KeyGenerator = require('../../comp/utils/keyGenerator');
const { ImageHost, ImageBkt, ImageAk, ImageSk } = require('../../../config');
let {FINISH_LOADING} = require('../../constants/dictEvent');

var BFetch = function (url, param, callback, failure, options) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic  ' + AppStore.getToken()
  };

  return rawFetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(param)
  }, options);
};

var BFetch1 = function (url, param, callback, failure, options) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic  ' + AppStore.getToken()
  };

  return rawFetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(param)
  }, options);
};

var PFetch = function (url, param, callback, failure, options) {
  var headers = {
    'Accept': 'application/json',
    'Authorization': 'Basic  ' + AppStore.getToken()
  };

  return rawFetch(url + '?' + Qs.stringify(param), {
    method: 'POST',
    headers: headers
  }, options);
};

var UFetch = function (url, param) {
  return new Promise((resolve, reject) => {
    qiniu.conf.ACCESS_KEY = ImageAk;
    qiniu.conf.SECRET_KEY = ImageSk;
    let fileName = KeyGenerator.getImgKey(AppStore.getUserId());
    var putPolicy = new qiniu.auth.PutPolicy2(
      {scope: ImageBkt + ':' + fileName}
    );
    var uptoken = putPolicy.token();
    qiniu.rpc.uploadImage(param.uri, fileName, uptoken, function (resp) {
      if (resp.status === 200) {
        resolve({fileUrl: ImageHost + fileName});
      } else {
        reject(resp.status);
      }
      //console.log(JSON.stringify(resp));
    });
  });
};

var UFetchBak = function (url, param, callback, failure, options) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
    'Authorization': 'Basic  ' + AppStore.getToken()
  };

  var formdata = new FormData();
  formdata.append('file', param);
  return rawFetch(url, {
    method: 'POST',
    headers: headers,
    body: formdata
  }, options);
};


var rawFetch = function (url, param, callback, failure, option) {
  console.log('以下打印一次传出去的param:');
  console.log(param);
  console.log('请求地址:'+url);
  if (!option) option = {};
  //var _promise = Promise.race([fetch(url, param), new Promise(function (resolve, reject) {
  //  setTimeout(() => reject(new Error('链接超时')), 2000000);
  //})]);
 // process(fetch(url, param) ,callback,failure,option);
  var _promise = MxFetch.fetch(url, param, 6180);
  return process(_promise, option);
};

var process = function (_promise, option) {
  return new Promise((resolve, reject) => {
    if (AppStore.getNetWorkState()) {
      _promise.then((response) => response.text())
        .then((response) => {
          if (response == '') {
            resolve({});
          } else {
            var json = JSON.parse(response);
            if (json.msgContent || json.errMsg){
              reject(json);
            } else {
              resolve(json);
            }
            console.log('以下打印一次获取到的json:');
            console.log(response);
          }
        })
        .catch((errorData) => {
          console.log(errorData);
          reject(errorData);
        });
    } else {
      AppStore.emitChange(FINISH_LOADING);
      throw {message:'请检查网络链接'};
    }
  });

};

module.exports = {
  BFetch: BFetch,
  PFetch: PFetch,
  UFetch: UFetch,
  BFetch1: BFetch1
};
