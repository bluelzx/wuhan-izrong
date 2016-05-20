/**
 * Created by baoyinghai on 4/20/16.
 */
"use strict";
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  NOTICE
  } = require('./schemas');
let { SESSION_TYPE } = require('../../constants/dictIm');
let SessionIdSplit = require('../../comp/utils/sessionIdSplitUtils');
let NoticePersisterFacade = {
  updateNotice: (param)=>_updateNotice(param),
  getAllNotice: (param) => _getAllNotice(param),
  deleteNotice: (id) => _deleteNotice(id),
  updateInviteNotice: (id) => _updateInviteNotice(id)
};

let _updateNotice = function (param) {
  _realm.write(()=> {
    _realm.create(NOTICE, param, true);
  });
};

let _getAllNotice = function (param) {
  let ret = [];
  let arr = _realm.objects(NOTICE).sorted('revTime', [true]);
  let currUserId = param;
  arr.forEach((item) => {
    let userId = SessionIdSplit.getUserIdFromSessionId(item.noticeId);
    if (userId == currUserId) {
      let p = {
        noticeId: item.noticeId,
        title: item.title,
        content: item.content,
        groupName: item.groupName,
        groupId: item.groupId,
        groupOwnerId: item.groupOwnerId,
        revTime: item.revTime,
        msgType: item.msgType,
        isInvited: item.isInvited
      }
      ret.push(p);
    }
  });
  return ret;
};

let _deleteNotice = function (id) {
  _realm.write(()=>{
    let item = _realm.objects(NOTICE).filtered('\'' + id + '\' =  noticeId');
    _realm.delete(item);
  });
}

let _updateInviteNotice = function(id){
  _realm.write(()=>{
    _realm.create(NOTICE,{noticeId:id, isInvited:true}, true);
  })
};

module.exports = NoticePersisterFacade;
