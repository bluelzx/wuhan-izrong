/**
 * Created by baoyinghai on 4/20/16.
 */
"use strict";
let PersisterFacade = require('../persister/persisterFacade');
let AppStore = require('./appStore');
let { IM_SESSION_LIST } = require('../../constants/dictEvent');

let _updateNotice = function(param){
  PersisterFacade.updateNotice(param);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _getNotificationMessage = function (param) {
  return PersisterFacade.getAllNotice(param);
}

let _deleteNotice = function (id) {
  PersisterFacade.deleteNotice(id);
  AppStore.emitChange(IM_SESSION_LIST);
}

let _updateInViteNotice = function (id) {
  PersisterFacade.updateInviteNotice(id);
  AppStore.emitChange(IM_SESSION_LIST);
}

let noticeStore = {
  updateNotice:_updateNotice,
  getNotificationMessage: (param) => _getNotificationMessage(param),
  deleteNotice: (id) => _deleteNotice(id),
  updateInViteNotice: (id) => _updateInViteNotice(id)
}

module.exports = noticeStore;
