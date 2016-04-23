/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  PLATFORMINFO
  } = require('./schemas');

let PlatFormInfoPersisterFacade = {
  createPlatFormInfo:(infoId, title, content, createDate)=>_createPlatFormInfo(infoId, title, content, createDate),
  queryAll: () => _queryAll(),
}

let _createPlatFormInfo = function(infoId, title, content, createDate) {
  _realm.write(() => {
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
