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

let _getCategory = function (filterItems) {

  if (filterItems == null) {
    return null;
  } else {
    let bizCategory = _getFilterOptions(filterItems, 'bizCategory');
    return bizCategory;
  }
};

let _getFilterOptions = function (filterItems, descrCode) {
  if (filterItems == null) {
    return null;
  } else {
    let item = {};
    filterItems.forEach(function (filterItem) {
      if (filterItem.descrCode == descrCode) {
        item = filterItem;
      }
    });
    return item;
  }
};

let _getUserInfoByUserId = function (userId) {
  let users = _realm.objects(IMUSERINFO).filtered('userId = ' + userId);
  if (users.length > 0) {
    return users[0];
  } else {
    return null;
  }
};

module.exports = MarketStore;
