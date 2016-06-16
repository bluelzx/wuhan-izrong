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
var ImSocket = require('../network/imSocket');
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
  console.log(' push  notification消息 :' , notification);
  //TODO:同步请求
  //ImSocket.sendSyncReq();
}

module.exports = CommonActions
