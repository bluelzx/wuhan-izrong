/**
 * Created by baoyinghai on 4/20/16.
 */
let PersisterFacade = require('../persister/persisterFacade');
let AppStore = require('./appStore');
let { NEW_FRIEND , IM_SESSION_LIST} = require('../../constants/dictEvent');

let _queryAllNewNotic = function (userId){
  return PersisterFacade.queryAllNewNotic(userId);
}

let _deleteInvite = function(noticId, userId) {
  PersisterFacade.deleteNewNotic(noticId, userId);
  AppStore.emitChange(NEW_FRIEND);
  let r = _queryAllNewNotic(userId);
  if(!r || r.length == 0){
    PersisterFacade.deleteSession('newfriend:new:'+userId);
    AppStore.emitChange(IM_SESSION_LIST);
  }
}

let _modifyInviteState = function(noticId, userId) {
  PersisterFacade.acceptNewNotic(noticId, userId);
  AppStore.emitChange(NEW_FRIEND);
}



let NewFriendStore = {
  deleteFriendInvite:(noticId, userId)=>_deleteInvite(noticId, userId),
  modifyInviteState:(noticId, userId)=>_modifyInviteState(noticId, userId),
  queryAllNewNotic:(userId) => _queryAllNewNotic( userId)
}

module.exports = NewFriendStore;
