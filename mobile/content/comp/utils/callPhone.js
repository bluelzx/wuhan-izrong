/**
 * Created by vison on 16/5/13.
 */

'use strict';
let { Alert, Communications} = require('mx-artifacts');
module.exports = {
  callPhone: function (phoneNumber) {
    Alert('是否拨打电话?', ()=> {
      Communications.phonecall(phoneNumber, false);
    }, ()=> {
    });

  }
};
