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
  saveHomeMarketList: (marketInfoList)=> _saveHomeMarketList(marketInfoList),
  getMarketInfo: ()=> _getMarketInfo(),
  shouldUpdate: ()=> _shouldUpdate()
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

let _saveHomeMarketList = function (marketInfoList) {
  _realm.write(() => {
    _realm.create(
      MARKETINFO,
      {
        id: 'homeList',
        syncTime: new Date().getDate(),
        homeMarketList: JSON.stringify(marketInfoList)
      }, true);
  });
};

let _shouldUpdate = function () {
  let marketInfo = _realm.objects(MARKETINFO);
  if (marketInfo && marketInfo[0] && (new Date().getDate() === marketInfo[0].syncTime)) {
    return false;
  }
  return true;
};

let _getMarketInfo = function () {
  let marketInfo = _realm.objects(MARKETINFO);
  return JSON.parse(marketInfo[0].homeMarketList);
};


module.exports = HomePersisterFacade;
