/**
 * Created by baoyinghai on 6/12/16.
 */
let EventEmitter = require('events').EventEmitter;
let _ = require('lodash');

module.exports = _.assign({},EventEmitter.prototype,{
  listen: function ( event ,cb) {
    this.on(event, cb);
  },
  remove: function ( event ,cb) {
    this.removeListener(event, cb);
  },
  trigger: function (event ,arg) {
    this.emit(event, arg);
  },
});
//
//var Events = (function(){
//  var listen,  trigger, remove;
//  var obj = {};
//  var self = this;
//  listen = function(key, fn){
//    if(!obj[key]){
//      obj[key] = [];
//    }
//    obj[key].push(fn);
//  };
//
//
//  trigger = function(key,arg){
//    console.log('trigger');
//    return obj[key] && obj[key].forEach(function(item){
//        item&&item.call(this,arg)
//      });
//  };
//
//  remove = function(key, arg){
//    //obj[key] && obj[key].forEach(function(item, index){
//    //  if(item == arg){
//    //    obj[key][index] = null;
//    //  }
//    //})
//    console.log('remove arg' + arg);
//    var funcAry
//    if(funcAry = obj[key]){
//      for(var i=0; i < funcAry.length;i++){
//        if(funcAry[i] == arg){
//          console.log('remove tag');
//          obj[key].splice(i,1);
//          continue;
//        }
//      }
//    }
//  }
//
//  return {
//    listen:listen,
//    trigger:trigger,
//    remove:remove
//  }
//})();
//
//module.exports = Events;

