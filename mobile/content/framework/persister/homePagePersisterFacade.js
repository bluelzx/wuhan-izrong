/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  HOMEPAGE
  } = require('./schemas');
let {SESSION_TYPE } = require('../../constants/dictIm');

let HomePagePersisterFacade = {
  createHomePageInfo:(msgList)=>_createHomePageInfo(msgList),
  queryAllHomePageInfo: () => _queryAll()
};

let _createHomePageInfo = function(msgList) {
  _realm.write(() => {
    msgList.forEach((msg,index)=>{
      _realm.create(
        HOMEPAGE,
        {
          id:index+1,
          seq:msg.seq,
          url:msg.url
        }, true);
    })

  });
};

let _queryAll = function() {
  let pages = _realm.objects(HOMEPAGE);
  let ret = [];
  pages.forEach((item)=>{
    let p = {
      id:item.id,
      seq:item.seq,
      url:item.url
    };
    if(item.url){
      ret.push(p);
    }
  });
  if(ret.length == 0){
    return [];
  }
  return ret;
};

module.exports = HomePagePersisterFacade;
