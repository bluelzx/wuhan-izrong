var Qs = require('qs');
var { Alert } = require('mx-artifacts');
var AppStore = require('../store/appStore');
var { Host } = require('../../../config');

var BFetch = function (url, param, callback, failure, options) {
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic  ' + AppStore.getToken()
  };

  return rawFetch(Host + url, {
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

  return rawFetch(Host + url + '?' + Qs.stringify(param), {
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
  return rawFetch(Host + url, {
    method: 'POST',
    headers: headers,
    body: formdata,
  }, { custLoading: true });
};


var rawFetch = function (url, param, callback, failure, option) {
  console.log('以下打印一次传出去的param:');
  console.log(param);

  if (!option) option = {};
  var _promise = Promise.race([fetch(url, param), new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('链接超时')), 5000);
  })]);
  //process(fetch(url, param) ,callback,failure,option);
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
                var action;
                if (option.isLogout) {
                  AppStore.logout();
                } else {
                  AppStore.forceLogout();
                }
              } else {
                reject(json);
              }
            } else {
              resolve(json);
            }

            console.log('以下打印一次获取到的json:');
            console.log(json);
          }
        })
        .catch((errorData) => {
          console.log(errorData);
          reject({
            msgContent: '系统异常'
          });
        });
    } else {
      reject({
        msgContent: '网络异常'
      });
      console.log('网络异常');
    }
  });

};

module.exports = {
  BFetch: BFetch,
  PFetch: PFetch,
  UFetch: UFetch
};
