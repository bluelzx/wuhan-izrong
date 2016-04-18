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
    groupMasterUid: {type: 'int', optional: true},
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
    fromUId: {type: 'int', optional: true},
    groupId: {type: 'int', optional: true},
    toId: {type: 'int', optional: true},
    type: {type: 'string', optional: true},
    contentType: {type: 'string', optional: true},
    content: {type: 'string', optional: true},
    msgType: {type: 'string', optional: true},
    revTime: {type: 'date', optional: true},
    isRead: {type: 'bool', option: true}
  }
};

let MessageListSchema = {
  name: "messageList",
  primaryKey: 'sessionId',
  properties: {
    sessionId: {type: 'int', optional: true},
    type: {type: 'string', optional: true},
    badge:{type: 'int', optional: true},
    title: {type: 'string', optional: true},
    content:{type: 'string', optional: true},
    lastTime: {type: 'date', optional: true},
    contentType: {type: 'string', optional: true}
  }
};

//im用户信息
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

//登陆用户信息
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
    bizItemDesc: {type: 'string', optional: true}
  }
};

//两侧筛选器一级菜单
let FilterItemsSchema = {
  name: "filterItems",
  primaryKey: 'id',
  properties: {
    id: {type: 'int', optional: true},
    descrCode: {type: 'string', optional: true},
    descrName: {type: 'string', optional: true},
    displaySeq: {type: 'int', optional: true},
    options: {type: 'list', objectType: 'filterItem'}
  }
};

//两侧筛选器二级菜单
let FilterItemSchema = {
  name: "filterItem",
  primaryKey: 'id',
  properties: {
    id: {type: 'int', optional: true},
    displayName: {type: 'string', optional: true},
    displayCode: {type: 'string', optional: true},
    displaySeq: {type: 'int', optional: true},
    isSelected: {type: 'bool', optional: true}
  }
};

//筛选器中间部分,只有一级菜单
let OrderItemSchema = {
  name: "orderItem",
  primaryKey: 'id',
  properties: {
    id: {type: 'int', optional: true},
    fieldName: {type: 'string', optional: true},
    fieldDisplayName: {type: 'string', optional: true},
    fieldDisplayCode: {type: 'string', optional: true},
    displaySequence: {type: 'int', optional: true},
    filterId: {type: 'int', optional: true},
    selected: {type: 'bool', optional: true},
    asc: {type: 'bool', optional: true}
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
  FilterItemSchema:FilterItemSchema,
  FilterItemsSchema:FilterItemsSchema,
  OrderItemSchema:OrderItemSchema,
  MessageListSchema:MessageListSchema,
  DEVICE: 'device',
  GROUP: 'group',
  MESSAGE: 'message',
  IMUSERINFO: 'imUserInfo',
  LOGINUSERINFO: 'loginUserInfo',
  ORGBEAN: 'orgBean',
  BIZORDERCATEGORY: 'bizOrderCategory',
  BIZORDERITEM: 'bizOrderItem',
  FILTERITEMS:'filterItems',
  FILTERITEM:'filterItem',
  ORDERITEM:'orderItem',
  MESSAGELIST:'messageList'
};
