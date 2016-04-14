/**
 * Created by baoyinghai on 16/4/12.
 */

let msgType = require('../../constants/wsMsgType');
let contentType = require('../../constants/msgContentType');

let _getContact = function(){
  //我的群
  //联系人按群组分类
  return [
    {
      "orgName": "我的群组",
      "orgMembers": [
        {
          "groupId": 1,
          "type":'group',
          "groupName": "某群",
          "groupPhotoFileId":"test005"
        },
        {
          "groupId": 2,
          "type":'group',
          "groupName": "某群2",
          "groupPhotoFileId":"test005"
        }
      ]
    }
  ].concat(_getUsers());


}

let _getUsers = function() {

  return [
    {
      "orgName": "bank1",
      "orgMembers": [
        {
          "userId": 1,
           type:'user',
          "photoFileId": "test001",
          "userName": "A吴"
        },
        {
          "userId": 3,
          type:'user',
          "photoFileId": "test002",
          "userName": "A张"
        },
        {
          "userId": 4,
          type:'user',
          "photoFileId": "test004",
          "userName": "B张"
        },
        {
          "userId": 5,
          type:'user',
          "photoFileId": "test005",
          "userName": "B李"
        }
      ]
    },
    {
      "orgName": "bank2",
      "orgMembers": [
        {
          "userId": 2,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },{
          "userId": 6,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },{
          "userId": 7,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },{
          "userId": 8,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },{
          "userId": 9,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },
        {
          "userId": 10,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },{
          "userId": 11,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        },{
          "userId": 12,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
        }
      ]
    }
  ];
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
      groupOwnerId:3,   //群主
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

let _getUserInfoByUserId = function() {
  return {
    address:'苏州',
    realName:'user',
    email:'user@amarsoft.com',
    nameCardFileUrl:'http://',
    department:'资管',
    publicDepart:false,
    jobTitle:'研发',
    publicTitle:true,
    mobileNumber:'156937232',
    publicMobile:true,
    phoneNumber:'0512-42424',
    publicPhone:false,
    publicEmail:false,
    publicAddress:false,
    publicWeChat:false,
    photoFileUrl:'http://',
    qqNo:'932424',
    publicQQ:false,
    weChatNo:'4252624',
    userId:2,
    orgName:'xxxx银行'
  };
}

let _getGroupDetailById = function() {
  return {
    'groupId': 1,
    'groupName': 'bank1',
    'ownerId': 1,
    isMute:false,
    'members': [
      {
        "userId": 1,
        type:'user',
        "photoFileId": "test001",
        "userName": "A吴"
      },
      {
        "userId": 3,
        type:'user',
        "photoFileId": "test002",
        "userName": "A张"
      },
      {
        "userId": 4,
        type:'user',
        "photoFileId": "test004",
        "userName": "B张"
      },
      {
        "userId": 5,
        type:'user',
        "photoFileId": "test005",
        "userName": "B李"
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
          type:'user',
          "photoFileId": "test001",
          "userName": "A吴"
        },
        {
          "userId": 3,
          type:'user',
          "photoFileId": "test002",
          "userName": "A张"
        },
        {
          "userId": 4,
          type:'user',
          "photoFileId": "test004",
          "userName": "B张"
        },
        {
          "userId": 5,
          type:'user',
          "photoFileId": "test005",
          "userName": "B李"
        }
      ]
    },
    {
      "orgName": "bank2",
      "orgMembers": [
        {
          "userId": 2,
          type:'user',
          "photoFileId": "test003",
          "userName": "B吴"
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
};

module.exports = ContactStore;
