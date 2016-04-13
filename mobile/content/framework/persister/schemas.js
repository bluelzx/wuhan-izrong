/**
 * Created by vison on 16/3/31.
 */



let DeviceSchema = {
  name: 'device',
  primaryKey: 'deviceOS',
  properties: {
    deviceOS: {type: 'string'},
    APNSToken: {type: 'string', optional: true}
  }
};

let GroupSchema = {
  name: "group",
  primaryKey: 'groupId',
  properties: {
    groupId: 'int',
    groupName: {type: 'string', optional: true},
    groupMasterUname: {type: 'string', optional: true},
    memberNum: {type: 'int', optional: true},
    members: {type: 'list', objectType: 'userInfo'},
    isMute: {type: 'bool', optional: true}
  }
};

let MessageSchema = {
  name: "message",
  primaryKey: 'sessionId',
  properties: {
    sessionId: {type: 'int', optional: true},
    msgId: {type: 'int', optional: true},
    fromUid: {type: 'int', optional: true},
    toUid: {type: 'int', optional: true},
    type: {type: 'string', optional: true},
    contentType: {type: 'string', optional: true},
    content: {type: 'string', optional: true},
    msgType: {type: 'string', optional: true},
    revTime: {type: 'date', optional: true}
  }
};


let UserInfoSchema = {
  name: "userInfo",
  primaryKey: 'userId',
  properties: {
    userId: {type: 'int', optional: true},
    address: {type: 'string', optional: true},
    realName: {type: 'string', optional: true},
    weChatNo: {type: 'string', optional: true},
    email: {type: 'string', optional: true},
    nameCardFileUrl: {type: 'string', optional: true},
    qqNo: {type: 'string', optional: true},
    department: {type: 'string', optional: true},
    mobileNumber: {type: 'string', optional: true},
    jobTitle: {type: 'string', optional: true},
    phoneNumber: {type: 'string', optional: true},
    photoFileUrl: {type: 'string', optional: true},
    publicTitle: {type: 'string', optional: true},
    publicMobile: {type: 'string', optional: true},
    publicDepart: {type: 'string', optional: true},
    publicPhone: {type: 'string', optional: true},
    publicEmail: {type: 'string', optional: true},
    publicAddress: {type: 'string', optional: true},
    publicWeChat: {type: 'string', optional: true},
    publicQQ: {type: 'string', optional: true},
    orgId: {type: 'int', optional: true}
  }
};

let LoginUserInfoSchema = {
  name: "loginUserInfo",
  primaryKey: 'userId',
  properties: {
    userId: {type: 'int', optional: true},
    address: {type: 'string', optional: true},
    realName: {type: 'string', optional: true},
    weChatNo: {type: 'string', optional: true},
    email: {type: 'string', optional: true},
    nameCardFileUrl: {type: 'string', optional: true},
    qqNo: {type: 'string', optional: true},
    department: {type: 'string', optional: true},
    mobileNumber: {type: 'string', optional: true},
    jobTitle: {type: 'string', optional: true},
    phoneNumber: {type: 'string', optional: true},
    photoFileUrl: {type: 'string', optional: true},
    publicTitle: {type: 'string', optional: true},
    publicMobile: {type: 'string', optional: true},
    publicDepart: {type: 'string', optional: true},
    publicPhone: {type: 'string', optional: true},
    publicEmail: {type: 'string', optional: true},
    publicAddress: {type: 'string', optional: true},
    publicWeChat: {type: 'string', optional: true},
    publicQQ: {type: 'string', optional: true},
    orgId: {type: 'int', optional: true},
    token: {type: 'string', optional: true}
  }
};
let OrgBeanSchema = {
  name: "orgBean",
  primaryKey: 'id',
  properties: {
    id: {type: 'int', optional: true},
    corporationType: {type: 'string', optional: true},
    lastUpdateDate: {type: 'date', optional: true},
    corporationType: {type: 'string', optional: true},
    lastUpdateDate: {type: 'string', optional: true},
    orgCategory: {type: 'string', optional: true},
    orgCode: {type: 'string', optional: true},
    orgValue: {type: 'string', optional: true},
    orgValueAlias: {type: 'string', optional: true},
    isDisabled: {type: 'bool', optional: true},
    creator: {type: 'string', optional: true},
    creatorDate: {type: 'date', optional: true},
    lastUpdateBy: {type: 'string', optional: true},
    isNeedAudit: {type: 'bool', optional: true},
    totalQuota: {type: 'int', optional: true},
    occupiedQuota: {type: 'int', optional: true},
    isDeleted: {type: 'bool', optional: true},
    isApply: {type: 'bool', optional: true},
    remark: {type: 'string', optional: true}

  }
};


module.exports = {
  DeviceSchema: DeviceSchema,
  GroupSchema: GroupSchema,
  MessageSchema: MessageSchema,
  UserInfoSchema: UserInfoSchema,
  LoginUserInfoSchema:LoginUserInfoSchema,
  OrgBeanSchema: OrgBeanSchema

};
