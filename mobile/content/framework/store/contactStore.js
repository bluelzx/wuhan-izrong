/**
 * Created by baoyinghai on 16/4/12.
 */
let msgType = require('../../constants/wsMsgType');
let contentType = require('../../constants/msgContentType');
let PersisterFacade = require('../persister/persisterFacade');

let _getContact = function(){
  //我的群  第一个元素必须为群组
  //联系人按群组分类
  let groups = PersisterFacade.getAllGroups();
  return [
    {
      orgMembers: groups
    }
  ].concat(_getUsers());
}

let _getUsers = function() {
  return PersisterFacade.getUsersGroupByOrg();
}

let _getIMNotificationMessage = function() {
  let platformInfo = {
    infoId:'i001',
    title:'new11',
    content:'new1',
    badge:1,
    createDate:new Date(),
    msgType:msgType.PLATFORM_INFO
  };
  //按照msgType 分两组, p2p 和 group, p2p 按照fromUid再分组,取组内最新的一条瓶装数据,并统计未读数量  ,最终结果再按照时间排序
  let MockData = [
    {
      fromUid: 'u001',
      badge:2,  //统计未读条数
      realName:'user', //用户名
      content: 'text message',
      contentType: contentType.TEXT,
      msgId: 'uuid',
      sendDate: new Date(),
      msgType: msgType.REC_P2P_MSG
    },
    {
      fromUid: 'u001',
      gid: 'g001',
      badge:3,//统计未读条数
      groupName:'group1', // 群组名字
      groupMasterUid:3,   //群主
      content: 'text',
      contentType: contentType.TEXT,
      msgId: 'uuid',
      sendDate: new Date(),
      msgType: msgType.REC_GROUP_MSG
    }
  ];
  return {
    platformInfo:platformInfo,  // 平台通知
    msg:MockData           // 用户和群组的通知
  };
}

let _getUserInfoByUserId = function(id) {
  return PersisterFacade.getUserInfoByUserId(id);
}

let _getGroupDetailById = function() {
  return {
    'groupId': 1,
    'groupName': 'bank1',
    'groupMasterUid': 1,
     isMute:true,
    'members': [
      {
        "userId": 2,
        "photoFileId": "test003",
        "realName": "B吴"
      },{
        "userId": 6,
        "photoFileId": "test003",
        "realName": "B吴"
      },{
        "userId": 7,
        "photoFileId": "test003",
        "realName": "B吴"
      }
      ,{
        "userId": 8,
        "photoFileId": "test003",
        "realName": "B吴"
      }
      ,{
        "userId": 9,
        "photoFileId": "test003",
        "realName": "B吴"
      },
      {
        "userId": 10,
        "photoFileId": "test003",
        "realName": "B吴"
      },{
        "userId": 11,
        "photoFileId": "test003",
        "realName": "B吴"
      },{
        "userId": 12,
        "photoFileId": "test003",
        "realName": "B吴"
      }
    ]
  };
}

let _getUsersExpress = function(groupId) {
  return [
    {
      "orgName": "bank1",
      "orgMembers": [
        {
          "userId": 1,
          "photoFileId": "test001",
          "realName": "A吴"
        },
        {
          "userId": 3,
          "photoFileId": "test002",
          "realName": "A张"
        },
        {
          "userId": 4,
          "photoFileId": "test004",
          "realName": "B张"
        },
        {
          "userId": 5,
          "photoFileId": "test005",
          "realName": "B李"
        }
      ]
    },
    {
      "orgName": "bank2",
      "orgMembers": [
        {
          "userId": 2,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 6,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 7,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 8,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 9,
          "photoFileId": "test003",
          "realName": "B吴"
        },
        {
          "userId": 10,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 11,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 12,
          "photoFileId": "test003",
          "realName": "B吴"
        }
      ]
    }
  ];
}

let _getUserInfo = function() {
  return {
    userId:3
  };
}

let _getUsersByGroupId = function (groupId) {
  return [
    {
      "orgName": "bank1",
      "orgMembers": [
        {
          "userId": 1,
          "photoFileId": "test001",
          "realName": "A吴"
        },
        {
          "userId": 3,
          "photoFileId": "test002",
          "realName": "A张"
        },
        {
          "userId": 4,
          "photoFileId": "test004",
          "realName": "B张"
        },
        {
          "userId": 5,
          "photoFileId": "test005",
          "realName": "B李"
        }
      ]
    },
    {
      "orgName": "bank2",
      "orgMembers": [
        {
          "userId": 2,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 6,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 7,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 8,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 9,
          "photoFileId": "test003",
          "realName": "B吴"
        },
        {
          "userId": 10,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 11,
          "photoFileId": "test003",
          "realName": "B吴"
        },{
          "userId": 12,
          "photoFileId": "test003",
          "realName": "B吴"
        }
      ]
    }
  ];
}

let ContactStore = {
  getContact:_getContact ,                 //获得联系人和群组信息
  getIMNotificationMessage:_getIMNotificationMessage,  //获得推送的通知消息
  getUsers:_getUsers,                             //获得所有用户
  getUserInfoByUserId:_getUserInfoByUserId,       // 根据userId获得用户信息
  getGroupDetailById:_getGroupDetailById,          //更具groupId获得群组信息
  getUsersExpress:_getUsersExpress,               //获得除了已存在groupId群组中的用户
  getUserInfo:_getUserInfo,                       // 获得当前用户信息
  getUsersByGroupId:_getUsersByGroupId            //获得群组成员
};

module.exports = ContactStore;
