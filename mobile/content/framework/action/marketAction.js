/**
 * Created by cui on 16/4/12.
 */
let {
  BFetch,
  PFetch,
  UFetch
  } = require('../network/fetch');
let {Host} = require('../../../config');
let AppStore = require('../store/appStore');
let _ = require('lodash');
let AppLinks = require('../../constants/appLinks');
let pub = '/pub';

let MarketActions = {
  bizOrderMarketSearch: (p) => _bizOrderMarketSearch(AppLinks.bizOrderMarketSearch, p),
  getBizOrderInMarket: (p) => _getBizOrderInMarket(AppLinks.getBizOrderInMarket, p),

  bizOrderAdminSearch: (p) => _bizOrderAdminSearch(AppLinks.bizOrderAdminSearch, p),
  getBizOrderByCreator: (p) => _getBizOrderByCreator(AppLinks.getBizOrderByCreator, p),
  refreshBizOrder: (p) => _refreshBizOrder(AppLinks.refreshBizOrder, p),

  addBizOrder: (p) => _addBizOrder(AppLinks.addBizOrder, p),
  downselfBizOrder: (p) => _downselfBizOrder(AppLinks.downselfBizOrder, p),
  updateBizOrder: (p) => _updateBizOrder(AppLinks.updateBizOrder, p),
  getBizOrderCategoryAndItem: () => _getBizOrderCategoryAndItem(AppLinks.getBizOrderCategoryAndItem),
  getTop15BizOrderListByCategory: (p) => _getTop15BizOrderListByCategory(AppLinks.getTop15BizOrderListByCategory,p)
};

let _bizOrderMarketSearch = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _getBizOrderInMarket = function (url, p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _bizOrderAdminSearch = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _getBizOrderByCreator = function (url, p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _refreshBizOrder = function (url, p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _addBizOrder = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _downselfBizOrder = function (url, p) {
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _updateBizOrder = function (url, p) {
  return new Promise((resolve, reject) => {
    BFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _getBizOrderCategoryAndItem = function (url) {
  return new Promise((resolve, reject) => {
    PFetch(url).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

let _getTop15BizOrderListByCategory = function(url,p){
  return new Promise((resolve, reject) => {
    PFetch(url, p).then((response) => {
      resolve(response);
    }).catch((errorData) => {
      reject(errorData);
    });
  });
};

module.exports = MarketActions;
