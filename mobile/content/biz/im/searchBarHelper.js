/**
 * Created by baoyinghai on 4/21/16.
 *
 * help searchBar to filt data
 */
let _ = require('lodash');

let groupFilter = function(data, groupName,groupMembers,groupMembersName, keyWord, uid){
  let ret = [];
  //过滤规则
  // 1. groupName包括keyWord的
  // 2. groupMembers中的成员名字 包含keyWord的
  //字符串比较: 使用!!~indexOf()
  if(!keyWord || keyWord==''){
    if(!uid)
      return data;
    else{
      data.forEach((group)=>{
        let gName = group[groupName];

        let mem = [];
        group[groupMembers] && group[groupMembers].forEach((member)=> {
          if (uid && uid == member.userId);
          else
            mem.push(member);
        });
        if (mem.length > 0) {
          let tagGroup = {
            [groupName]: gName,
            [groupMembers]: mem
          };
          ret.push(tagGroup);
        }

      });
      return ret;
    }
  }
  data.forEach((group)=>{
    let gName = group[groupName];
    if(!!gName && gName.length && !!~gName.indexOf(keyWord)){
      if(group[groupMembers]&&group[groupMembers].length>0)
      ret.push(group);
    }else{
      let mem = [];
      group[groupMembers] && group[groupMembers].forEach((member)=>{
        let gMemName = member[groupMembersName];
        if(!!gMemName && gMemName.length && !!~gMemName.indexOf(keyWord)){
          if(uid && uid==member.userId);
          else
            mem.push(member);
        }
      });

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
let contactFilter = function(data, groupM,gN, groupName,groupMembers,groupMembersName, keyWord, uid){
  //return data;
  let ret = [];
  let group = data[0];
  let k = gFilter(group,groupM,gN, keyWord);
  if(k!=null){
    ret.push(k);
  }else{
    //ret.push([]);
  }
  console.log('k'+k);
  ret.push(...groupFilter(data.slice(1), groupName,groupMembers,groupMembersName, keyWord, uid));
  console.log(ret);
  return ret;
}

let sessionFilter = function(data,title,content,orgValue,keyWord){
  if(!keyWord || keyWord==''){
    return data;
  }
  let ret = [];
  data && data.forEach((item)=>{
    let t = item[title];
    let c = item[content];
    let d = item[orgValue];
    if((!!t && t.length && !!~t.indexOf(keyWord))||(!!c && c.length && !!~c.indexOf(keyWord))||(!!d && d.length && !!~d.indexOf(keyWord))){
      ret.push(item);
    }
  });

  return ret;
}

let userFilter = function(data,f1,f2,keyWord){
  let ret = [];
  data && data.forEach((item)=>{
    if(item[f1] && !!~item[f1].indexOf(keyWord)){
      ret.push(item);
    }else if(!!~item[f2].indexOf(keyWord)){
      ret.push(item);
    }
  });
  return ret;
}

module.exports = {groupFilter, contactFilter, sessionFilter, userFilter}

