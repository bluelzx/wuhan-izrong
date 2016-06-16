/**
 * Created by baoyinghai on 6/12/16.
 */

var Events = function(){
  var listen,  trigger;
  var obj = {};
  var self = this;
  listen = function(key, fn){
    if(!obj[key]){
      obj[key] = [];
    }
    obj[key].push(fn);
  };


  trigger = function(key,arg){
    return obj[key] && obj[key].forEach(function(item){
        item(this,arg)
      })
  };

  return {
    listen:listen,
    trigger:trigger
  }
}

module.exports = Events;

