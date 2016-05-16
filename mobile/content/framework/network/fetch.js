var Qs = require('qs');
var { Alert } = require('mx-artifacts');
var AppStore = require('../store/appStore');

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

var UFetch = function (url, param, callback, failure, options) {
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
  //Alert(param);
  if (!option) option = {};
  //var _promise = Promise.race([fetch(url, param), new Promise(function (resolve, reject) {
  //  setTimeout(() => reject(new Error('链接超时')), 2000000);
  //})]);
 // process(fetch(url, param) ,callback,failure,option);
  var _promise = fetch(url, param);
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
            if (json.msgContent) {
              if (json.msgCode == 'SYS_TOKEN_INVALID') {
                if (option.isLogout) {
                  AppStore.logout();
                } else {
                  AppStore.forceLogout();
                }
              } else {
                reject(json);
              }
            }else if(json.errMsg){
              reject(json.errMsg);
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
      Alert('网络异常')
    }
  });

};

module.exports = {
  BFetch: BFetch,
  PFetch: PFetch,
  UFetch: UFetch,
  BFetch1: BFetch1
};
