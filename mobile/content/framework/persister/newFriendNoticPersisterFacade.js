/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  NEWFRIENDNOTIC
  } = require('./schemas');


let NewFriendNoticPersisterFacade = {
  createNewNotic:( noticId, userId, realName, orgName, photoFileUrl, certified,msgType, ownerId) => _createNewNotic( noticId, userId, realName, orgName, photoFileUrl,certified, msgType, ownerId),
  acceptNewNotic:(noticId, ownerId) => _acceptNewNotic(noticId, ownerId),
  deleteNewNotic:(noticId, ownerId)=>_deleteNewNotic(noticId, ownerId),
  queryAllNewNotic:(ownerId)=>_queryAllNewNotic(ownerId),
  getNewNoticById:(noticId, ownerId) => _getNewNoticById(noticId, ownerId)

};

let _queryAllNewNotic = function(ownerId){
  let result = _realm.objects(NEWFRIENDNOTIC).filtered('ownerId =' + ownerId ).sorted('recTime',true);
  let ret = [];
  result.forEach((item)=>{
    ret.push({
      noticId: item.noticId,
      userId: item.userId,
      realName: item.realName,
      orgName: item.orgName,
      photoFileUrl: item.photoFileUrl,
      ownerId: item.ownerId,
      certified:item.certified,
      isAccept:item.isAccept||false,
      msgType:item.msgType,
      recTime:item.recTime
    });
  });
  return ret;
}

let _deleteNewNotic = function(noticId, ownerId){
  _realm.write(()=>{
    let tag = _realm.objects(NEWFRIENDNOTIC).filtered('$0==noticId && ownerId==$1',noticId, ownerId );
    _realm.delete(tag);
  });
}

let _acceptNewNotic = function(noticId, ownerId){
  _realm.write(()=>{

    let tag = _realm.objects(NEWFRIENDNOTIC).filtered( '$0==noticId && ownerId==$1',noticId, ownerId);

    tag[0] && (tag[0].isAccept = true);
  });
}

let _getNewNoticById = function(noticId, ownerId){
  let tag = _realm.objects(NEWFRIENDNOTIC).filtered( '$0==noticId && ownerId==$1',noticId, ownerId);
  return tag[0];
}

let _createNewNotic = function( noticId, userId, realName, orgName, photoFileUrl,certified, msgType, ownerId) {
  let param = {
    noticId: noticId,
    userId: userId,
    realName: realName,
    orgName: orgName,
    photoFileUrl: photoFileUrl,
    ownerId: ownerId,
    certified:certified,
    isAccept:false,
    msgType:msgType,
    recTime:new Date()
  };

  _realm.write(()=>{
    _realm.create(NEWFRIENDNOTIC, param, true);
  });

}

module.exports = NewFriendNoticPersisterFacade;
