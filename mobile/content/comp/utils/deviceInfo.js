/**
 * Created by baoyinghai on 4/22/16.
 */

let DeviceInfo = require('react-native-device-info');
let _device = {
  id: DeviceInfo.getUniqueID()
};

let DeviceInfoDetail = {
  getDeviceId: function() {
    return _device.id;
  }
}

module.exports = DeviceInfoDetail;
