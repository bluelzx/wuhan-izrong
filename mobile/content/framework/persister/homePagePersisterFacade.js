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
  createHomePageInfo:(seq, url)=>_createHomePageInfo(seq, url),
  queryAllHomePageInfo: () => _queryAll()
};

let _createHomePageInfo = function(seq, url) {
  _realm.write(() => {
    _realm.create(HOMEPAGE, {seq:seq,url:url}, true);
  });
};

let _queryAll = function() {
  let pages = _realm.objects(HOMEPAGE);
  let ret = [];
  pages.forEach((item)=>{
    let p = {
      req:item.req,
      url:item.url
    };
    ret.push(p);
  });
  return ret;
};

module.exports = HomePagePersisterFacade;
