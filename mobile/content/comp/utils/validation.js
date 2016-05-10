'use strict';
let React = require('react-native');
let _ = require('lodash');
module.exports = {
  isMobile: function (data) {
    if (!_.isEmpty(data)) {
      let re = /^[1]\d{10}$/;
      if (!re.test(data)) {
        return false;
      }
      return true;
    }
    return true;
  },
  isComp: function (data, desc) {
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if (!reg.test(data)) {
      return false;
    }
    return true;
  },
  realName: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[\u4e00-\u9fa5a-zA-Z]+$/;
      if (!reg.test(data)) {
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
        return false;
      }
      return true;
    }
    return true;
  },
  //4位以上数字
  isQQ: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[1-9][0-9]{1,20}$/;
      if (!reg.test(data)) {
        console.log("您输入的QQ号有误，请重新输入");
        return false;
      }
      return true;
    }
    return true;

  },
  //中文和英文:职务
  isChineseAndEnglish: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[\u4e00-\u9fa5a-zA-Z]+$/;
      if (!reg.test(data)) {
        return false;
      }
      return true;
    }
    return true;
  },
  //中文和英文:微信
  isWechat: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[a-zA-Z0-9_]{1,40}$/;
      if (!reg.test(data)) {
        return false;
      }
      return true;
    }
    return true;

  },
  //是否包含中文
  hasChinese: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /[\u4e00-\u9fa5]+/;
      if (!reg.test(data)) {
        return false;
      }
      return true;
    }
    return true;
  },

  isRealName: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[\u4e00-\u9fa5_a-zA-Z]{1,10}$/;
      if (!reg.test(data)) {
        console.log("您输入的真实姓名号有误，请重新输入");
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
  isAmount: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[0-9]+(\.[0-9]+)?$/;
      if (!reg.test(data)) {
        console.log('格式不合法：请输入整数');
        return false;
      }
      return true;
    }
    return true;
  },
  isTerm: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^[1-9][0-9]{0,2}$/;
      if (!reg.test(data)) {
        console.log('格式不合法：请输入整数');
        return false;
      }
      return true;
    }
    return true;
  },
  isRate: function (data) {
    if (!_.isEmpty(data)) {
      let reg = /^(?=.*[0-9])\d{0,2}(?:\.\d{0,2})?$/;
      if (!reg.test(data)) {
        console.log('格式不合法：请输入0-99.99之间的小数');
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
