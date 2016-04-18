/**
 * Created by baoyinghai on 4/18/16.
 */
//var {BFetch, PFetch, UFetch, host, token} = require('../network/fetch');
//var async = require('async')
//var AppDispatcher = require('../dispatcher/appDispatcher');
//var Command = require('../../constants/command');
//var ActionTypes = Command.ActionTypes;
//var _ = require('lodash');
//var AppStore = require('../store/appStore');
//var pub = "/pub";
//var api = "/api"
var AppSotre = require('../store/appStore');
var CommonActions = {
  notificationRegister: (token)=>_notificationRegister(token),
  onNotification: (notification)=>_onNotification(notification),
  changeSwitch: (p, c)=>_changeSwitch(p, c)
}

var _changeSwitch = function (p, c) {
  //AppDispatcher.dispatch({
  //  type: ActionTypes.CHANGE_SWITCH,
  //  data: p,
  //  successHandle: c
  //})
}
var _notificationRegister = function (token) {

  AppSotre.saveApnsToken(token);

}

var _onNotification = function (notification) {
  //console.log('111111Basic  ' + AppStore.getToken());
  ////TODO: 未登录是可以收到市场动态的,由于后台没有修改,所以暂时无法实现
  //if (!!AppStore.getToken()) {
  //  BFetch(api + "/MessageSearch/getPushMsg", {}, function (data) {
  //    AppDispatcher.dispatch({
  //      type: ActionTypes.PUSH_NOTIFICATION,
  //      data: data,
  //    });
  //  }, null, {custLoading: true});
  //}
}

module.exports = CommonActions
