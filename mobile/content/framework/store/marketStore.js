/**
 * Created by cui on 16/4/13.
 */
let assign = require('object-assign');
let EventEmitter = require('events').EventEmitter;

let MarketStore = ({

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
