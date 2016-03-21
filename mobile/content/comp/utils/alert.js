let React, {
  AlertIOS,
  Alert,
  Platform
} = require('react-native');
let _ = require('lodash');

let FasAlert = (title, _ok, _cancel) => {
  let btnAry = new Array();
  if (_ok) {
    if (typeof _ok === 'function') {
      btnAry.push({
        text: '确定',
        onPress: () => _ok()
      });
    } else {
      btnAry.push(_ok);
    }

    if (_cancel) {
      if (typeof _cancel === 'function') {
        btnAry.push({
          text: '取消',
          onPress: () => _cancel()
        });
      } else {
        btnAry.push(_cancel);
      }
    }
  }

  switch (btnAry.length) {
    case 0:
      btnAry.push({
        text: '确定',
        onPress: null
      });
      break;
    case 2:
      _.reverse(btnAry);
      break;
    default:
  }

  if (Platform.OS === 'ios') {
    AlertIOS.alert(title, null, btnAry);
  } else {
    Alert.alert(title, null, btnAry);
  }
};

module.exports = FasAlert;
