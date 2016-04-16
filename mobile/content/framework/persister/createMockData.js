/**
 * Created by baoyinghai on 16/4/15.
 */


let user1 = {
  "userId": 1,
  "address": "1号街",
  "realName": "小涨",
  "weChatNo": "1111",
  "email": "111@qq.com",
  "nameCardFileUrl": "url",
  "qqNo": "234598123",
  "department": "ziguan",
  "mobileNumber": "15250059031",
  "jobTitle": "manager",
  "phoneNumber": "11112222333",
  "photoFileUrl": "url",
  "publicTitle": true,
  "publicMobile": true,
  "publicDepart": true,
  "publicPhone": true,
  "publicEmail": true,
  "publicAddress": true,
  "publicWeChat": true,
  "publicQQ": true,
  "orgBeanId": 1,
  "mute": false
};

let user2= {
  "userId": 2,
  "address": "2号街",
  "realName": "小er",
  "weChatNo": "1111",
  "email": "111@qq.com",
  "nameCardFileUrl": "url",
  "qqNo": "234598123",
  "department": "ziguan",
  "mobileNumber": "15250059031",
  "jobTitle": "manager",
  "phoneNumber": "11112222333",
  "photoFileUrl": "url",
  "publicTitle": true,
  "publicMobile": true,
  "publicDepart": true,
  "publicPhone": true,
  "publicEmail": true,
  "publicAddress": true,
  "publicWeChat": true,
  "publicQQ": true,
  "orgBeanId": 1,
  "mute": false
}

let user3 = {
  "userId": 3,
  "address": "3号街",
  "realName": "3涨",
  "weChatNo": "1111",
  "email": "111@qq.com",
  "nameCardFileUrl": "url",
  "qqNo": "234598123",
  "department": "ziguan",
  "mobileNumber": "15250059031",
  "jobTitle": "manager",
  "phoneNumber": "11112222333",
  "photoFileUrl": "url",
  "publicTitle": true,
  "publicMobile": true,
  "publicDepart": true,
  "publicPhone": true,
  "publicEmail": true,
  "publicAddress": true,
  "publicWeChat": true,
  "publicQQ": true,
  "orgBeanId": 1,
  "mute": false
}

let user4 ={
  "userId": 4,
  "address": "4号街",
  "realName": "si涨",
  "weChatNo": "1111",
  "email": "111@qq.com",
  "nameCardFileUrl": "url",
  "qqNo": "234598123",
  "department": "ziguan",
  "mobileNumber": "15250059031",
  "jobTitle": "manager",
  "phoneNumber": "11112222333",
  "photoFileUrl": "url",
  "publicTitle": true,
  "publicMobile": true,
  "publicDepart": true,
  "publicPhone": true,
  "publicEmail": true,
  "publicAddress": true,
  "publicWeChat": true,
  "publicQQ": true,
  "orgBeanId": 2,
  "mute": false
}

let user5 = {
  "userId": 5,
  "address": "1号街",
  "realName": "小涨5",
  "weChatNo": "1111",
  "email": "111@qq.com",
  "nameCardFileUrl": "url",
  "qqNo": "234598123",
  "department": "ziguan",
  "mobileNumber": "15250059031",
  "jobTitle": "manager",
  "phoneNumber": "11112222333",
  "photoFileUrl": "url",
  "publicTitle": true,
  "publicMobile": true,
  "publicDepart": true,
  "publicPhone": true,
  "publicEmail": true,
  "publicAddress": true,
  "publicWeChat": true,
  "publicQQ": true,
  "orgBeanId": 2,
  "mute": false
}

let user6 = {
  "userId": 6,
  "address": "6号街",
  "realName": "小涨6",
  "weChatNo": "1111",
  "email": "111@qq.com",
  "nameCardFileUrl": "url",
  "qqNo": "234598123",
  "department": "ziguan",
  "mobileNumber": "15250059031",
  "jobTitle": "manager",
  "phoneNumber": "11112222333",
  "photoFileUrl": "url",
  "publicTitle": true,
  "publicMobile": true,
  "publicDepart": true,
  "publicPhone": true,
  "publicEmail": true,
  "publicAddress": true,
  "publicWeChat": true,
  "publicQQ": true,
  "orgBeanId": 2,
  "mute": false
}




let org1 = {
  id: 1,
  corporationType: 'type',
  lastUpdateDate: new Date(),
  orgCategory: 'category',
  orgCode: '111',
  orgValue: '天津',
  orgValueAlias: '天津',
  isDisabled:false,
  creator: 'yhbao',
  creatorDate: new Date(),
  lastUpdateBy: 'yhbao',
  isNeedAudit: true,
  totalQuota: 10,
  occupiedQuota: 10,
  isDeleted: false,
  isApply: true,
  remark: ' '
}


let org2 = {
  id: 2,
  corporationType: 'type',
  lastUpdateDate: new Date(),
  orgCategory: 'category',
  orgCode: '112',
  orgValue: '武汉',
  orgValueAlias: '武汉',
  isDisabled:false,
  creator: 'yhbao',
  creatorDate: new Date(),
  lastUpdateBy: 'yhbao',
  isNeedAudit: true,
  totalQuota: 10,
  occupiedQuota: 10,
  isDeleted: false,
  isApply: true,
  remark: ' '
}


let group1 = {
  groupId: 1,
  groupName: 'group A',
  groupMasterUid: '001',
  memberNum: 10,
  members: [user1,user2,user3],
  mute: false
}

let group2 = {
  groupId: 2,
  groupName: 'group B',
  groupMasterUid: '001',
  memberNum: 10,
  members: [user4,user5],
  mute: false
}


module.exports = {
  users: [
    user1, user2, user3, user4, user5, user6
  ],
  orgs: [
    org1, org2
  ],
  groups:[
    group1,
    group2
  ]
}



