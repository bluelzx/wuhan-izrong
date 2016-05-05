/**
 * Created by cui on 16/4/13.
 */
let assign = require('object-assign');
let _realm = require('../persister/realmManager');
let EventEmitter = require('events').EventEmitter;

const {
  IMUSERINFO
  } = require('../persister/schemas');

let MarketStore = ({
  getCategoryAndItem: (filterItems) => _getCategoryAndItem(filterItems),
  getFilterOptions: (filterItems, descrCode) => _getFilterOptions(filterItems, descrCode),
  getUserInfoByUserId: (userId) => _getUserInfoByUserId(userId)
});

let _getCategoryAndItem = function (filterItems) {

  let bizCategory = _getFilterOptions(filterItems, 'bizCategory');
  let bizItem = _getFilterOptions(filterItems, 'bizItem');
  console.log(bizCategory);
  console.log(bizItem);
  let totalArr = [];
  if (bizCategory.options) {
    bizCategory.options.forEach(function (category) {
      console.log(category);
      let itemArr = [];
      bizItem.options.forEach(function (item) {
        if (item.displayCode.substring(0, 3) == category.displayCode) {
          itemArr.push(item);
        }
      });
      let categoryobj = {
        itemArr: itemArr,
        id: category.id,
        displayName: category.displayName,
        displayCode: category.displayCode,
        displaySeq: category.displaySeq,
        isSelected: category.isSelected
      };
      totalArr.push(categoryobj);
    });
  }
  return totalArr;
};

let _getFilterOptions = function (filterItems, descrCode) {
  let item = {};
  filterItems.forEach(function (filterItem) {
    if (filterItem.descrCode == descrCode) {
      item = filterItem;
    }
  });
  return item;
};

let _getUserInfoByUserId = function (userId) {
  let users = _realm.objects(IMUSERINFO).filtered('userId = ' + userId);
  if(users.length > 0){
    return users[0];
  }else{
    return null;
  }
};

module.exports = MarketStore;
