/**
 * Created by baoyinghai on 4/20/16.
 */
let PersisterFacade = require('../persister/persisterFacade');

let _deleteInvite = function(noticId, userId) {
  PersisterFacade.deleteNewNotic(noticId, userId);
}

let _modifyInviteState = function(noticId, userId) {
  PersisterFacade.acceptNewNotic(noticId, userId);
}

let _queryAllNewNotic = function (userId){
  return PersisterFacade.queryAllNewNotic(userId)
}

let NewFriendStore = {
  deleteFriendInvite:(noticId, userId)=>_deleteInvite(noticId, userId),
  modifyInviteState:(noticId, userId)=>_modifyInviteState(noticId, userId),
  queryAllNewNotic:(userId) => _queryAllNewNotic( userId)
}

module.exports = NewFriendStore;
