/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  NEWFRIENDNOTIC
  } = require('./schemas');


let NewFriendNoticPersisterFacade = {
  createNewNotic:( noticId, userId, realName, orgName, photoFileUrl, certified, ownerId) => _createNewNotic( noticId, userId, realName, orgName, photoFileUrl,certified,  ownerId),
  acceptNewNotic:(noticId, ownerId) => _acceptNewNotic(noticId, ownerId),
  deleteNewNotic:(noticId, ownerId)=>_deleteNewNotic(noticId, ownerId),
  queryAllNewNotic:(ownerId)=>_queryAllNewNotic(ownerId)

};

let _queryAllNewNotic = function(ownerId){
  let ret = _realm.objects(NEWFRIENDNOTIC).filtered('ownerId =' + ownerId );
  return ret;
}

let _deleteNewNotic = function(noticId, ownerId){
  _realm.write(()=>{
    let tag = _realm.objects(NEWFRIENDNOTIC).filtered('noticId == \'' + noticId + '\' && ownerId ==' + ownerId );
    _realm.delete(tag);
  });
}

let _acceptNewNotic = function(noticId, ownerId){
  _realm.write(()=>{

    let tag = _realm.objects(NEWFRIENDNOTIC).filtered( '$0==noticId && ownerId==$1',noticId, ownerId);

    tag[0] && (tag[0].isAccept = true);
  });
}

let _createNewNotic = function( noticId, userId, realName, orgName, photoFileUrl,certified, ownerId) {
  let param = {
    noticId: noticId,
    userId: userId,
    realName: realName,
    orgName: orgName,
    photoFileUrl: photoFileUrl,
    ownerId: ownerId,
    certified:certified,
    isAccept:false
  };

  _realm.write(()=>{
    _realm.create(NEWFRIENDNOTIC, param, true);
  });

}

module.exports = NewFriendNoticPersisterFacade;
