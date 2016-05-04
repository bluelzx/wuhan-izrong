/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  PLATFORMINFO,
  SESSION
  } = require('./schemas');
let { SESSION_TYPE , MSG_CONTENT_TYPE} = require('../../constants/dictIm');

let PlatFormInfoPersisterFacade = {
  createPlatFormInfo:(infoId, title, content, createDate)=>_createPlatFormInfo(infoId, title, content, createDate),
  queryAllPlatFormInfo: () => _queryAll(),
}

let _createPlatFormInfo = function(infoId, title, content, createDate) {
  _realm.write(() => {
    let platInfo = _realm.objects(SESSION).filtered("type = '" + SESSION_TYPE.PLATFORMINFO + "'");
    if(platInfo.length > 0){
      platInfo.badge  = platInfo.badge + 1;
      platInfo.title = title;
      platInfo.lastTime = createDate;
      platInfo.content = content;
    }else{
      _realm.create(SESSION,{
        sessionId: 'platinfo:global',
        type: SESSION_TYPE.PLATFORMINFO,
        badge:1,
        title: title,
        content:content,
        lastTime: createDate,
        contentType: MSG_CONTENT_TYPE.TEXT},true);
    }
    _realm.create(PLATFORMINFO, {infoId: infoId, title: title, content: content, createDate: createDate}, true);
  });
}

let _queryAll = function() {
  let platFormInfo = _realm.objects(PLATFORMINFO);
  let ret = [];
  platFormInfo.forEach((item) => {
    let p = {
      infoId:item.infoId,
      title:item.title,
      content:item.content,
      createDate:item.createDate
    }
    ret.push(ret);
  });
  return ret;
}


module.exports = PlatFormInfoPersisterFacade;
