/**
 * Created by cui on 16/4/13.
 */
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var MarketStore = ({
  getMarketData: function () {
    return(
      [
        {
          "id": 1,
          "bizCategory": "MCA",
          "bizCategoryDesc": "资产交易",
          "bizItem": "MCA_ABS",
          "bizItemDesc": "资产支持证券",
          "bizOrientation": "IN",
          "bizOrientationDesc": "出",
          "term": 31,
          "amount": 1000000,
          "rate": 0.001,
          "status": "ACTIVE",
          "statusDesc": "已发布",
          "lastModifyDate": 1459385215667,
          "userId": 3,
          "userName": "lfzhu@amarsoft.com",
          "orgId": 1,
          "orgName": "天津银行苏州小分行虎丘支行"
        },
        {
          "id": 1,
          "bizCategory": "MCA",
          "bizCategoryDesc": "资产交易",
          "bizItem": "MCA_ABS",
          "bizItemDesc": "资产支持证券",
          "bizOrientation": "IN",
          "bizOrientationDesc": "收",
          "term": 31,
          "amount": 1000000,
          "rate": 0.001,
          "status": "ACTIVE",
          "statusDesc": "已发布",
          "lastModifyDate": 1459385215667,
          "userId": 3,
          "userName": "lfzhu@amarsoft.com",
          "orgId": 1,
          "orgName": "天津银行苏州小分行虎丘支行"
        },
        {
          "id": 1,
          "bizCategory": "MCA",
          "bizCategoryDesc": "资产交易",
          "bizItem": "MCA_ABS",
          "bizItemDesc": "资产支持证券",
          "bizOrientation": "IN",
          "bizOrientationDesc": "出",
          "term": 31,
          "amount": 1000000,
          "rate": 0.001,
          "status": "ACTIVE",
          "statusDesc": "已发布",
          "lastModifyDate": 1459385215667,
          "userId": 3,
          "userName": "lfzhu@amarsoft.com",
          "orgId": 1,
          "orgName": "天津银行苏州小分行虎丘支行"
        },
        {
          "id": 1,
          "bizCategory": "MCA",
          "bizCategoryDesc": "资产交易",
          "bizItem": "MCA_ABS",
          "bizItemDesc": "资产支持证券",
          "bizOrientation": "IN",
          "bizOrientationDesc": "收",
          "term": 31,
          "amount": 1000000,
          "rate": 0.001,
          "status": "ACTIVE",
          "statusDesc": "已发布",
          "lastModifyDate": 1459385215667,
          "userId": 3,
          "userName": "lfzhu@amarsoft.com",
          "orgId": 1,
          "orgName": "天津银行苏州小分行虎丘支行"
        },
        {
          "id": 1,
          "bizCategory": "MCA",
          "bizCategoryDesc": "资产交易",
          "bizItem": "MCA_ABS",
          "bizItemDesc": "资产支持证券",
          "bizOrientation": "IN",
          "bizOrientationDesc": "出",
          "term": 31,
          "amount": 1000000,
          "rate": 0.001,
          "status": "ACTIVE",
          "statusDesc": "已发布",
          "lastModifyDate": 1459385215667,
          "userId": 3,
          "userName": "lfzhu@amarsoft.com",
          "orgId": 1,
          "orgName": "天津银行苏州小分行虎丘支行"
        }
      ]
    )
  }

});

module.exports = MarketStore;
