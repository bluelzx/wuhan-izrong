/**
 * Created by baoyinghai on 16/4/15.
 */

let msgType = require('../../constants/wsMsgType');
let contentType = require('../../constants/msgContentType');
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


let session1 = {
  sessionId: 1,
  type: msgType.PLATFORM_INFO,
  badge: 1,
  title: 'new11',
  content: 'new1',
  lastTime: new Date(),
  contentType: contentType.TEXT
}


let session2 = {
  sessionId: 2,
  type: msgType.REC_P2P_MSG,
  badge:2,
  title: 'user',
  content:'text message',
  lastTime: new Date(),
  contentType: contentType.TEXT
}



let session3 = {
  sessionId: 3,
  type: msgType.REC_GROUP_MSG,
  badge:3,
  title: 'group1',
  content:'text',
  lastTime: new Date(),
  contentType: contentType.TEXT
}

let message1 = {
  sessionId: 2,
  msgId: 1,
  fromUid: 2,
  groupId: 0,
  toId: 3,
  type: msgType.REC_P2P_MSG,
  contentType: contentType.TEXT,
  content: 'haha',
  msgType: msgType.REC_P2P_MSG,
  revTime: new Date(),
  isRead: false
}

let message2 = {
  sessionId: 3,
  msgId: 1,
  fromUid: 2,
  groupId: 1,
  toId: 3,
  type: msgType.REC_GROUP_MSG,
  contentType: contentType.TEXT,
  content: 'haha',
  msgType: msgType.REC_GROUP_MSG,
  revTime: new Date(),
  isRead: false
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
  ],
  sessionList:[session1, session2, session3],
  message:[message1, message2]
}



