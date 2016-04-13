/**
 * Created by baoyinghai on 16/4/12.
 */
let {
  BFetch,
  PFetch,
  UFetch
  } = require('../network/fetch');
let { Host } = require('../../../config');
let AppStore = require('../store/appStore');
let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');
let pub = "/pub";

let _createGroup = function() {
  //return or callback
  return 0;
}

let ContactAction = {
  createGroup:_createGroup,
};

module.exports = ContactAction;
