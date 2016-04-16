/**
 * Created by cui on 16/4/12.
 */
let {
  BFetch,
  PFetch,
  UFetch,
  BFetch1,
  } = require('../network/fetch');
let { Host } = require('../../../config');
let AppStore = require('../store/appStore');
let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');
var pub = "/pub";

var MarketActions ={

  bizOrderMarketSearchDefaultSearch: (p, c, f) => _bizOrderMarketSearchDefaultSearch(AppLinks.bizOrderMarketSearchDefaultSearch, p, c, f),
  bizOrderMarketSearchsearch: (p, c, f) => _bizOrderMarketSearchsearch(AppLinks.bizOrderMarketSearchsearch, p, c, f),
  getBizOrderInMarket: (p, c, f) => _getBizOrderInMarket(AppLinks.getBizOrderInMarket, p, c, f)

};

let _bizOrderMarketSearchDefaultSearch = function (url) {
  return new Promise((resolve, reject) => {
    BFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _bizOrderMarketSearchsearch = function (url,p) {
  return new Promise((resolve, reject) => {
    BFetch(url,p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _getBizOrderInMarket = function (url,p) {
  return new Promise((resolve, reject) => {
    PFetch(url,p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

module.exports = MarketActions;
