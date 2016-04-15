/**
 * Created by vison on 16/3/31.
 */



let DeviceSchema = {
  name: "device",
  primaryKey: 'id',
  properties: {
    id:{type: 'int', optional: true},
    deviceOS: {type: 'string',optional: true},
    APNSToken: {type: 'string', optional: true}
  }
};

let GroupSchema = {
  name: "group",
  primaryKey: 'groupId',
  properties: {
    groupId: {type: 'int', optional: true},
    groupName: {type: 'string', optional: true},
    groupMasterUid: {type: 'string', optional: true},
    memberNum: {type: 'int', optional: true},
    members: {type: 'list', objectType: 'imUserInfo'},
    mute: {type: 'bool', optional: true}
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
    revTime: {type: 'date', optional: true},
    isRead: {type: 'bool', option: true}
  }
};

let ImUserInfoSchema = {
  name: "imUserInfo",
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
    publicTitle: {type: 'bool', optional: true},
    publicMobile: {type: 'bool', optional: true},
    publicDepart: {type: 'bool', optional: true},
    publicPhone: {type: 'bool', optional: true},
    publicEmail: {type: 'bool', optional: true},
    publicAddress: {type: 'bool', optional: true},
    publicWeChat: {type: 'bool', optional: true},
    publicQQ: {type: 'bool', optional: true},
    orgBeanId: {type: 'int', optional: true},
    mute: {type: 'bool', optional: true}  //是否屏蔽该用户
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
    publicTitle: {type: 'bool', optional: true},
    publicMobile: {type: 'bool', optional: true},
    publicDepart: {type: 'bool', optional: true},
    publicPhone: {type: 'bool', optional: true},
    publicEmail: {type: 'bool', optional: true},
    publicAddress: {type: 'bool', optional: true},
    publicWeChat: {type: 'bool', optional: true},
    publicQQ: {type: 'bool', optional: true},
    orgBeanId: {type: 'int', optional: true},
    lastLoginTime:{type: 'date', optional: true},  //本地增加,用于多用户登陆排序
    token: {type: 'string', optional: true}
  }
};

let OrgBeanSchema = {
  name: "orgBean",
  primaryKey: 'id',
  properties: {
    id: {type: 'int', optional: true},
    corporationType: {type: 'string', optional: true},//公司类型, 'INDEPENDENT'
    lastUpdateDate: {type: 'date', optional: true},
    orgCategory: {type: 'string', optional: true},  //企业类型 'BANK'
    orgCode: {type: 'string', optional: true},
    orgValue: {type: 'string', optional: true},  //企业名称
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

let BizOrderCategorySchema = {
  name: "bizOrderCategory",
  primaryKey: 'displaySeq',
  properties: {
    displaySeq: {type: 'string', optional: true},
    bizCategory: {type: 'string', optional: true},
    bizCategoryDesc: {type: 'string', optional: true},
    bizOrderItemBeans: {type: 'list', objectType: 'bizOrderItem'}
  }
};

let BizOrderItemSchema = {
  name: "bizOrderItem",
  primaryKey: 'displaySeq',
  properties: {
    displaySeq: {type: 'string', optional: true},
    bizItem: {type: 'string', optional: true},
    bizItemDesc: {type: 'string', optional: true},
  }
};

let MarketInfoSchema = {
  name: "marketInfo",
  primaryKey: 'id',
  properties: {
    id: {type: 'int', optional: true},
    bizCategory: {type: 'string', optional: true},
    bizCategoryDesc: {type: 'string', optional: true},
    bizItem: {type: 'string', optional: true},
    bizItemDesc: {type: 'string', optional: true},
    bizOrientation: {type: 'string', optional: true},
    bizOrientationDesc: {type: 'string', optional: true},
    term: {type: 'int', optional: true},
    amount: {type: 'int', optional: true},
    rate: {type: 'double', optional: true},
    status: {type: 'string', optional: true},
    statusDesc: {type: 'string', optional: true},
    lastModifyDate: {type: 'date', optional: true},
    userId: {type: 'int', optional: true},
    userName: {type: 'string', optional: true},
    orgId: {type: 'int', optional: true},
    orgName: {type: 'string', optional: true}
  }
};


module.exports = {
  DeviceSchema: DeviceSchema,
  GroupSchema: GroupSchema,
  MessageSchema: MessageSchema,
  ImUserInfoSchema: ImUserInfoSchema,
  LoginUserInfoSchema: LoginUserInfoSchema,
  OrgBeanSchema: OrgBeanSchema,
  BizOrderCategorySchema: BizOrderCategorySchema,
  BizOrderItemSchema: BizOrderItemSchema,
  MarketInfoSchema: MarketInfoSchema,
  DEVICE: 'device',
  GROUP: 'group',
  MESSAGE: 'message',
  IMUSERINFO: 'imUserInfo',
  LOGINUSERINFO: 'loginUserInfo',
  ORGBEAN: 'orgBean',
  BIZORDERCATEGORY: 'bizOrderCategory',
  BIZORDERITEM: 'bizOrderItem',
  MARKETINFO: 'marketInfo'
};
