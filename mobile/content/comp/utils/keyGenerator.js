let DeviceInfoDetail = require('./deviceInfo');
const _device_id = DeviceInfoDetail.getDeviceId();

let _getSessionKey = (t, id) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return t + ':' + id;
};

let _getMessageKey = (s, id) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return s + ':' + new Date().getTime() + ':' + _device_id + ':' + id;
};

let KeyGenerator = {
  getSessionKey: (t, id) => _getSessionKey(t, id),
  getMessageKey: (s, id) => _getMessageKey(s, id),
};

module.exports = KeyGenerator;
