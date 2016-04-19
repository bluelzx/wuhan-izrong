
let AppStore = require('../../framework/store/appStore');
const _device_id = AppStore.getDeviceId();
const _user_id = AppStore.getUserId();

let _getSessionKey = (t, id) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return t + ':' + id;
};

let _getMessageKey = (s) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return s + ':' + new Date().getTime() + ':' + _device_id;
};

let KeyGenerator = {
  getSessionKey: (t, id) => _getSessionKey(t, id),
  getMessageKey: (s) => _getMessageKey(s),
};

module.exports = KeyGenerator;
