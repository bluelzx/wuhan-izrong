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
let pub = "/pub";

let MarketActions ={

  bizOrderMarketSearchDefaultSearch: (url) => _bizOrderMarketSearchDefaultSearch(AppLinks.bizOrderMarketSearchDefaultSearch),
  bizOrderMarketSearchsearch: (url,p) => _bizOrderMarketSearchsearch(AppLinks.bizOrderMarketSearchsearch, p),
  getBizOrderInMarket: (url,p) =>_pfetchWithUrlAndP(AppLinks.getBizOrderInMarket, p),

  addBizOrder: (url,p) => _bfetchWithUrlAndP(AppLinks.addBizOrder, p),
  downselfBizOrder: (url,p) => _pfetchWithUrlAndP(AppLinks.downselfBizOrder, p),
  updateBizOrder: (url,p) => _bfetchWithUrlAndP(AppLinks.updateBizOrder, p),
  getBizOrderCategoryAndItem: (url) => _pfetch1WithUrl(AppLinks.getBizOrderCategoryAndItem)

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

let _bfetchWithUrl = function (url) {
  return new Promise((resolve, reject) => {
    BFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _bfetchWithUrlAndP = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _pfetchWithUrl = function (url) {
  return new Promise((resolve, reject) => {
    PFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _pfetchWithUrlAndP = function (url, p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

module.exports = MarketActions;
