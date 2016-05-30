let DeviceInfoDetail = require('./deviceInfo');
const _device_id = DeviceInfoDetail.getDeviceId();
let _ = require('lodash');
let _getSessionKey = (t, id, userId, targetId) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  let s = t + ':' + id + ':' + userId;
  if (targetId && !_.isEmpty(targetId)) {
    s = s + ':' + targetId;
  }
  return t + ':' + id + ':' + userId;
};

let _getMessageKey = (s, id) => {
  // return (f > t ? f + ':' + t : t + ':' + f) + ':' + new Date().getTime() + ':' + _device_id;
  return s + ':' + new Date().getTime() + ':' + _device_id + ':' + id;
};

let _getNewFriendKey = (t, id) => {
  return t + ':' + id;
};

let _getImgKey = (userId) => {
  return userId + '-' + new Date().getTime() + '-' + _device_id;
};

let KeyGenerator = {
  getSessionKey: (t, id, userId, targetId) => _getSessionKey(t, id, userId, targetId),
  getMessageKey: (s, id) => _getMessageKey(s, id),
  getNewFriendKey: (t, id) => _getNewFriendKey(t, id),
  getImgKey: (userId) => _getImgKey(userId)
};

module.exports = KeyGenerator;
