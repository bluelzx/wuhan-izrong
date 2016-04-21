/**
 * Created by cui on 16/4/13.
 */
let assign = require('object-assign');
let EventEmitter = require('events').EventEmitter;

let MarketStore = ({
  getCategoryAndItem: function (filterItems) {

    let bizCategory = this.getFilterOptions(filterItems, 'bizCategory');
    let bizItem = this.getFilterOptions(filterItems, 'bizItem');
    console.log(bizCategory);
    console.log(bizItem);
    let totalArr = new Array();
    bizCategory.options.forEach(function (category) {
      console.log(category);
      let itemArr = new Array();
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
    return totalArr;
  },

  getFilterOptions: function (filterItems, descrCode) {
    let item = {};
    filterItems.forEach(function (filterItem) {
      if (filterItem.descrCode == descrCode) {
        item = filterItem;
      }
    });
    return item;
  }

});

module.exports = MarketStore;
