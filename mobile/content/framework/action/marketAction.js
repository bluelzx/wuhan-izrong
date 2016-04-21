/**
 * Created by cui on 16/4/12.
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

let MarketActions ={

  bizOrderMarketSearchDefaultSearch: () => _bfetchWithUrl(AppLinks.bizOrderMarketSearchDefaultSearch),
  bizOrderMarketSearch: (p) => _bfetchWithUrlAndP(AppLinks.bizOrderMarketSearch, p),
  getBizOrderInMarket: (p) => _pfetchWithUrlAndP(AppLinks.getBizOrderInMarket, p),

  bizOrderAdminSearch: (p) => _bfetchWithUrlAndP(AppLinks.bizOrderAdminSearch, p),
  getBizOrderByCreator: (p) => _pfetchWithUrlAndP(AppLinks.getBizOrderByCreator, p),
  refreshBizOrder: (p) => _pfetchWithUrlAndP(AppLinks.refreshBizOrder, p),

  addBizOrder: (p) => _bfetchWithUrlAndP(AppLinks.addBizOrder, p),
  downselfBizOrder: (p) => _pfetchWithUrlAndP(AppLinks.downselfBizOrder, p),
  updateBizOrder: (p) => _bfetchWithUrlAndP(AppLinks.updateBizOrder, p),
  getBizOrderCategoryAndItem: () => _pfetch1WithUrl(AppLinks.getBizOrderCategoryAndItem)

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
