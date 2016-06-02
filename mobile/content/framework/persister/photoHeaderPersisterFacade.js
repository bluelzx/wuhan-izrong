/**
 * Created by baoyinghai on 4/20/16.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {
  HeaderPath
  } = require('./schemas');


let NewFriendNoticPersisterFacade = {
  getPathCache:()=>_getPathCache(),
  addPhotoHeader:(uri,localUri)=>_add(uri,localUri)

};

let _getPathCache = function() {
  let l = _realm.objects(HeaderPath);
  let ret = {};
  l.forEach((item)=>{
    ret[item.uri] = item.localUri;
  });
  return ret;
}

let _add = function(uri,localUri){
  _realm.write(()=>{
    _realm.create(HeaderPath,{uri:uri,localUri:localUri},true);
  });
}

module.exports = NewFriendNoticPersisterFacade;
