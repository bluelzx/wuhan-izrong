'use strict';
let React = require('react-native');
let _ = require('lodash');
module.exports = {
  isPhone: function (data) {
    if (data.length == 0) {
      console.log('请输入手机号');
      return false;
    }
    let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    if (!reg.test(data)) {
      console.log("您输入的手机号码格式不对");
      return false;
    }
    return true;
  },
  isComp: function (data, desc) {
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if (!reg.test(data)) {
      console.log("请输入由数字和字母组成的" + desc);
      return false;
    }
    return true;
  },
  realName: function (data) {
    if (!_.isEmpty(data)) {
      if (data.length > 20) {
        console.log("姓名长度不能超过20，请重新输入");
        return false;
      }
      return true;
    }
    return true;
  },
  isTelephone: function (data) {
    if (!_.isEmpty(data)) {
      let re = /^0\d{2,3}-?\d{7,8}$/;
      if (!re.test(data)) {
        console.log("您输入的座机号有误，请重新输入");
        return false;
      }
      return true;
    }
    return true;
  },
  isQQ: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /[1-9][0-9]{4,}/;
      if (!reg.test(data)) {
        console.log("您输入的QQ号有误，请重新输入");
        return false;
      }
      return true;
    }
    return true;

  },
  isEmail: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (!reg.test(data)) {
        console.log("您输入的邮箱有误，请重新输入");
        return false;
      }
      return true;
    }
    return true;
  },
  notNull: function (data, desc) {
    if (!data) {
      console.log(desc + "为必填项，不能为空");
      return false;
    }
    return true;
  },
  isNull: function (data) {
    if (!data) {
      return true;
    }
    return false;
  },
  returnIsNull(valid, data){
    if (!valid) {
      return '';
    }
    return data;
  }
};
