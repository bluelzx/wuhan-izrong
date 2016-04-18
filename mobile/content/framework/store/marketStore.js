/**
 * Created by cui on 16/4/13.
 */
let assign = require('object-assign');
let EventEmitter = require('events').EventEmitter;

let MarketStore = ({
  bizDefaultSearch: function () {
    return (
    {
      "pageResult": {
        "pageIndex": 1,
        "itemsPerPage": 10,
        "totalPages": 1,
        "contentList": [
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
          }
        ],
        "totalItems": 1
      },
      "filterItems": [
        {
          "descrCode": "bizCategory",
          "descrName": "业务类型",
          "displaySeq": 1,
          "options": [
            {
              "id": 242,
              "displayName": "全部",
              "displayCode": "ALL",
              "displaySeq": 1,
              "isSelected": true
            },
            {
              "id": 243,
              "displayName": "资产交易",
              "displayCode": "MCA",
              "displaySeq": 2,
              "isSelected": false
            },
            {
              "id": 244,
              "displayName": "票据交易",
              "displayCode": "MBP",
              "displaySeq": 3,
              "isSelected": false
            },
            {
              "id": 245,
              "displayName": "资金业务",
              "displayCode": "MIB",
              "displaySeq": 4,
              "isSelected": false
            },
            {
              "id": 246,
              "displayName": "同业代理",
              "displayCode": "MCI",
              "displaySeq": 5,
              "isSelected": false
            },
            {
              "id": 247,
              "displayName": "公司与投行",
              "displayCode": "MIA",
              "displaySeq": 6,
              "isSelected": false
            }
          ]
        },
        {
          "descrCode": "bizItem",
          "descrName": "业务种类",
          "displaySeq": 2,
          "options": [
            {
              "id": 248,
              "displayName": "全部",
              "displayCode": "ALL",
              "displaySeq": 1,
              "isSelected": true
            },
            {
              "id": 249,
              "displayName": "同业理财",
              "displayCode": "MCA_IBO",
              "displaySeq": 2,
              "isSelected": false
            },
            {
              "id": 250,
              "displayName": "福费廷",
              "displayCode": "MCA_FFT",
              "displaySeq": 3,
              "isSelected": false
            },
            {
              "id": 251,
              "displayName": "资产支持证券",
              "displayCode": "MCA_ABS",
              "displaySeq": 4,
              "isSelected": false
            },
            {
              "id": 252,
              "displayName": "其他",
              "displayCode": "MCA_OTHER",
              "displaySeq": 5,
              "isSelected": false
            },
            {
              "id": 253,
              "displayName": "纸票交易",
              "displayCode": "MBP_PT",
              "displaySeq": 6,
              "isSelected": false
            },
            {
              "id": 254,
              "displayName": "电票交易",
              "displayCode": "MBP_ET",
              "displaySeq": 7,
              "isSelected": false
            },
            {
              "id": 255,
              "displayName": "纸票回购",
              "displayCode": "MBP_PB",
              "displaySeq": 8,
              "isSelected": false
            },
            {
              "id": 256,
              "displayName": "电票回购",
              "displayCode": "MBP_EB",
              "displaySeq": 9,
              "isSelected": false
            },
            {
              "id": 257,
              "displayName": "其他",
              "displayCode": "MBP_OTHER",
              "displaySeq": 10,
              "isSelected": false
            },
            {
              "id": 258,
              "displayName": "同业存款",
              "displayCode": "MIB_DEPOSIT",
              "displaySeq": 11,
              "isSelected": false
            },
            {
              "id": 259,
              "displayName": "同业拆借",
              "displayCode": "MIB_LEND",
              "displaySeq": 12,
              "isSelected": false
            },
            {
              "id": 260,
              "displayName": "债券回购",
              "displayCode": "MIB_BOND_REVERSE_BB",
              "displaySeq": 13,
              "isSelected": false
            },
            {
              "id": 261,
              "displayName": "存单",
              "displayCode": "MIB_DEPOSIT_CP",
              "displaySeq": 14,
              "isSelected": false
            },
            {
              "id": 262,
              "displayName": "其他",
              "displayCode": "MIB_OTHER",
              "displaySeq": 15,
              "isSelected": false
            },
            {
              "id": 263,
              "displayName": "代理开证/保函",
              "displayCode": "MCI_AGENT_SBLC_BG",
              "displaySeq": 16,
              "isSelected": false
            },
            {
              "id": 264,
              "displayName": "福费廷",
              "displayCode": "MCI_FFT",
              "displaySeq": 17,
              "isSelected": false
            },
            {
              "id": 265,
              "displayName": "其他",
              "displayCode": "MCI_OTHER",
              "displaySeq": 18,
              "isSelected": false
            },
            {
              "id": 266,
              "displayName": "债券承销",
              "displayCode": "MIA_BOND_UNDERWRITE",
              "displaySeq": 19,
              "isSelected": false
            },
            {
              "id": 267,
              "displayName": "北金所私募券",
              "displayCode": "MIA_BOND_PRIVATE_PK",
              "displaySeq": 20,
              "isSelected": false
            },
            {
              "id": 268,
              "displayName": "资产证券化",
              "displayCode": "MIA_ABS",
              "displaySeq": 21,
              "isSelected": false
            },
            {
              "id": 269,
              "displayName": "并购",
              "displayCode": "MIA_MERGER",
              "displaySeq": 22,
              "isSelected": false
            },
            {
              "id": 270,
              "displayName": "结构化融资",
              "displayCode": "MIA_STRUCTURED_FINANCE",
              "displaySeq": 23,
              "isSelected": false
            },
            {
              "id": 271,
              "displayName": "其他",
              "displayCode": "MIA_OTHER",
              "displaySeq": 24,
              "isSelected": false
            }
          ]
        },
        {
          "descrCode": "bizOrientation",
          "descrName": "业务方向",
          "displaySeq": 1,
          "options": [
            {
              "id": 272,
              "displayName": "全部",
              "displayCode": "ALL",
              "displaySeq": 1,
              "isSelected": true
            },
            {
              "id": 273,
              "displayName": "收",
              "displayCode": "IN",
              "displaySeq": 2,
              "isSelected": false
            },
            {
              "id": 274,
              "displayName": "出",
              "displayCode": "OUT",
              "displaySeq": 3,
              "isSelected": false
            }
          ]
        },
        {
          "descrCode": "term",
          "descrName": "期限",
          "displaySeq": 2,
          "options": [
            {
              "id": 275,
              "displayName": "全部",
              "displayCode": "ALL",
              "displaySeq": 1,
              "isSelected": true
            },
            {
              "id": 276,
              "displayName": "隔夜",
              "displayCode": "ONE_DAY",
              "displaySeq": 2,
              "isSelected": false
            },
            {
              "id": 277,
              "displayName": "1周",
              "displayCode": "ONE_WEEK",
              "displaySeq": 3,
              "isSelected": false
            },
            {
              "id": 278,
              "displayName": "2周",
              "displayCode": "TWO_WEEKS",
              "displaySeq": 4,
              "isSelected": false
            },
            {
              "id": 279,
              "displayName": "3周",
              "displayCode": "THREE_WEEKS",
              "displaySeq": 5,
              "isSelected": false
            },
            {
              "id": 280,
              "displayName": "1月",
              "displayCode": "ONE_MONTH",
              "displaySeq": 6,
              "isSelected": false
            },
            {
              "id": 281,
              "displayName": "2月",
              "displayCode": "TWO_MONTHS",
              "displaySeq": 7,
              "isSelected": false
            },
            {
              "id": 282,
              "displayName": "3月",
              "displayCode": "THREE_MONTHS",
              "displaySeq": 8,
              "isSelected": false
            },
            {
              "id": 283,
              "displayName": "半年",
              "displayCode": "SIX_MONTHS",
              "displaySeq": 9,
              "isSelected": false
            },
            {
              "id": 284,
              "displayName": "半年以上",
              "displayCode": "GREATE_SIXMONTHS",
              "displaySeq": 10,
              "isSelected": false
            }
          ]
        },
        {
          "descrCode": "amount",
          "descrName": "金额",
          "displaySeq": 3,
          "options": [
            {
              "id": 285,
              "displayName": "全部",
              "displayCode": "ALL",
              "displaySeq": 1,
              "isSelected": true
            },
            {
              "id": 286,
              "displayName": "3000万以内",
              "displayCode": "LESS_30M",
              "displaySeq": 2,
              "isSelected": false
            },
            {
              "id": 287,
              "displayName": "3000万-5000万",
              "displayCode": "BETWWEN_30M_50M",
              "displaySeq": 3,
              "isSelected": false
            },
            {
              "id": 288,
              "displayName": "5000万-1亿",
              "displayCode": "BETWWEN_50M_100M",
              "displaySeq": 4,
              "isSelected": false
            },
            {
              "id": 289,
              "displayName": "1亿以上",
              "displayCode": "GREATE_100M",
              "displaySeq": 5,
              "isSelected": false
            }
          ]
        }
      ],
      "orderItems": [
        {
          "id": null,
          "fieldName": "lastModifyDate",
          "fieldDisplayName": "最新发布",
          "fieldDisplayCode": "lastModifyDate",
          "displaySequence": 1,
          "filterId": 84,
          "selected": true,
          "asc": false
        },
        {
          "id": null,
          "fieldName": "amount",
          "fieldDisplayName": "金额最高",
          "fieldDisplayCode": "amount",
          "displaySequence": 2,
          "filterId": 84,
          "selected": false,
          "asc": false
        },
        {
          "id": null,
          "fieldName": "rate",
          "fieldDisplayName": "利率最低",
          "fieldDisplayCode": "rate",
          "displaySequence": 3,
          "filterId": 84,
          "selected": false,
          "asc": false
        }
      ],
      "subInfo": {},
      "request": {
        "filterList": [],
        "custFilterList": {},
        "pageIndex": 1,
        "itemsPerPage": 10,
        "orderField": "lastModifyDate",
        "orderType": "desc",
        "orderIndex": 0
      }
    }
    )
  },
  getMarketData: function () {
    return (
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
  },

  getCategoryAndItem: function (filterItems) {
    let bizCategory = filterItems[0];
    let bizItem = filterItems[1];
    console.log(bizCategory);
    console.log(bizItem);
    let totalArr = new Array();
    for (let category of bizCategory.options) {
      console.log(category);
      let itemArr = new Array();
      for (let item of bizItem.options) {
        if (item.displayCode.substring(0, 3) == category.displayCode) {
          itemArr.push(item);
        }
      }
      let categoryobj = {
        itemArr: itemArr,
        id: category.id,
        displayName: category.displayName,
        displayCode: category.displayCode,
        displaySeq: category.displaySeq,
        isSelected: category.isSelected
      };
      totalArr.push(categoryobj);
    }
    return (
      totalArr
    )
  },

  getFilterOptions: function (filterItems,descrCode) {
    for(let item of filterItems){
        if(item.descrCode == descrCode){
          return(
            item
          )
        }
    }
  },

});

module.exports = MarketStore;
