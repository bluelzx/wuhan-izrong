/**
 * Created by baoyinghai on 4/21/16.
 *
 * help searchBar to filt data
 */
let _ = require('lodash');

let groupFilter = function(data, groupName,groupMembers,groupMembersName, keyWord){
  //过滤规则
  // 1. groupName包括keyWord的
  // 2. groupMembers中的成员名字 包含keyWord的
  //字符串比较: 使用!!~indexOf()
  if(!keyWord || keyWord==''){
    return data;
  }
  let ret = [];
  data.forEach((group)=>{
    let gName = group[groupName];
    if(!!gName && gName.length && !!~gName.indexOf(keyWord)){
      ret.push(group);
    }else{
      let mem = [];
      for(let member of group[groupMembers]){
        let gMemName = member[groupMembersName];
        if(!!gMemName && gMemName.length && !!~gMemName.indexOf(keyWord)){
          mem.push(member);
        }
      }
      if(mem.length > 0){
        let tagGroup = {
          [groupName]:gName,
          [groupMembers]:mem
        };
        ret.push(tagGroup);
      }
    }
  });
  return ret;
}

let gFilter = function (group ,groupMembers,gName, keyWord) {
  let ary = [];
  group[groupMembers].forEach((g)=>{
    let gn = g[gName] ;
    if(!!gn && gn.length && !!~gn.indexOf(keyWord)){
      ary.push(g);
    }
  });
  if(ary.length > 0){
    group[groupMembers] = ary;
    return group;
  }else{
    return null;
  }
}


/**
 * data是个引用
 * */
let contactFilter = function(data, groupM,gN, groupName,groupMembers,groupMembersName, keyWord){
  //return data;
  let ret = [];
  let group = data[0];
  let k = gFilter(group,groupM,gN, keyWord);
  if(k!=null){
    ret.push(k);
  }
  ret.push(...groupFilter(data.slice(1), groupName,groupMembers,groupMembersName, keyWord));
  return ret;
}

module.exports = {groupFilter, contactFilter}

