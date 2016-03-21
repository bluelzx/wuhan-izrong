let keyMirror = require('keymirror');

let ActionTypes = keyMirror({
  SAVE_APNS_TOKEN: null,
  APP_INIT: null,
  LOGIN: null,
  LOGOUT: null,
  FORCE_LOGOUT: null,
  REQUEST_START: null,
  REQUEST_END: null,
  UPDATE_USERINFO: null,
  UPDATE_COMPBASEINFO: null,
  CANCLE_BILL_DISCOUNT: null,
  CREATE_BILL_DISCOUNT: null,
  GIVEUP_BILL_DISCOUNT: null,
  CLEAR_MESSAGEDETAIL: null,
  PUSH_NOTIFICATION: null,
  DEMO_FLAG: null
});

module.exports = ActionTypes;
