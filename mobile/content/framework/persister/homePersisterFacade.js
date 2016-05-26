/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  HOMEPAGE,
  MARKETINFO
  } = require('./schemas');
let {SESSION_TYPE } = require('../../constants/dictIm');

let HomePersisterFacade = {
    createHomePageInfo: (msgList)=>_createHomePageInfo(msgList),
    queryAllHomePageInfo: () => _queryAll(),
    saveMarketInfo: (marketInfoList)=> _saveMarketInfo(marketInfoList),
    getMarketInfo: ()=> _getMarketInfo()
  };

let _createHomePageInfo = function (msgList) {
  _realm.write(() => {
    msgList.forEach((msg, index)=> {
      _realm.create(
        HOMEPAGE,
        {
          id: index + 1,
          seq: msg.seq,
          url: msg.url
        }, true);
    })

  });
};

let _queryAll = function () {
  let pages = _realm.objects(HOMEPAGE);
  let ret = [];
  pages.forEach((item)=> {
    let p = {
      id: item.id,
      seq: item.seq,
      url: item.url
    };
    if (item.url) {
      ret.push(p);
    }
  });
  if (ret.length == 0) {
    return [];
  }
  return ret;
};

let _saveMarketInfo = function (marketInfoList) {
  _realm.write(() => {
    marketInfoList.forEach((marketInfo)=> {
      _realm.create(
        MARKETINFO,
        {
          id: marketInfo.id,
          amount: marketInfo.amount,
          bizCategory: marketInfo.bizCategory,
          bizCategoryDesc: marketInfo.bizCategory,
          bizItem: marketInfo.bizItem,
          bizItemDesc: marketInfo.bizItemDesc,
          bizOrientation: marketInfo.bizOrientation,
          bizOrientationDesc: marketInfo.bizOrientationDesc,
          fileUrlList: JSON.stringify(marketInfo.fileUrlList),
          lastModifyDate: marketInfo.lastModifyDate,
          orgId: marketInfo.orgId,
          orgName: marketInfo.orgName,
          photoStoredFileUrl:marketInfo.photoStoredFileUrl,
          rate: marketInfo.rate,
          remark: marketInfo.remark,
          status: marketInfo.status,
          statusDesc: marketInfo.statusDesc,
          term: marketInfo.term,
          userId: marketInfo.userId,
          userName: marketInfo.userName
        }, true);
    })
  });
};

let _getMarketInfo = function(){
  let marketInfo = _realm.objects(MARKETINFO);
  return marketInfo;
};



module.exports = HomePersisterFacade;
