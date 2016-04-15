/**
 * Created by baoyinghai on 16/4/12.
 */
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
};

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
};

let _getIMNotificationMessage = function() {
  let SpreadData = {
    badge: 1,
    title: '环渤海银银合作平台',
    recTime: new Date(),
    content: '尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'
  };
  let MockData = [
    {
      type: 'user',
      userId: 2,
      badge: 1,
      title: '张缪缪',
      recTime: new Date(),
      content: '尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'
    },
    {
      type: 'user',
      userId: 3,
      badge: 2,
      title: '吴某某',
      recTime: new Date(),
      content: '尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'
    },
    {
      type: 'group',
      groupId: 4,
      ownerId: 0,
      badge: 99,
      title: '某群',
      recTime: new Date(),
      content: '尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!尊敬的用户您好!'
    }
  ];
  return {
    spreadNotice:SpreadData,  // 平台通知
    notice:MockData           // 用户和群组的通知
  };
};

let _getUserInfoByUserId = function() {
  return {
    "userId": 2,
    type:'user',
    "photoFileId": "test003",
    "userName": "B吴"
  };
};

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
};

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
};

let ContactStore = {
  getContact:_getContact ,                 //获得联系人和群组信息
  getIMNotificationMessage:_getIMNotificationMessage,  //获得推送的通知消息
  getUsers:_getUsers,                             //获得所有用户
  getUserInfoByUserId:_getUserInfoByUserId,       // 根据userId获得用户信息
  getGroupDetailById:_getGroupDetailById,          //更具groupId获得群组信息
  getUsersExpress:_getUsersExpress             //获得除了已存在groupId群组中的用户
};

module.exports = ContactStore;
