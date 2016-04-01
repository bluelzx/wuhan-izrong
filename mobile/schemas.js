/**
 * Created by vison on 16/3/31.
 */


let UserSchema = {
  name: "friend",
  primaryKey: 'userId',
  properties: {
    userId: 'int',
    userName: {type: 'string', optional: true},
    photoFileId: {type: 'string', optional: true},
    orgName: {type: 'string', optional: true},
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
    members: {type: 'list', objectType: 'int'},
    isMute:{type: 'boolean', objectType: 'int'}
  }
};

let SendMessageSchema = {
  name: "sendMessage",
  primaryKey: 'toUid',
  properties: {
    toUid: 'int',
    type: {type: 'string', optional: true},
    contentType: {type: 'string', optional: true},
    content: {type: 'string', optional: true},
    msgId: {type: 'string', optional: true},
    msgType: {type: 'string', optional: true},
    sendTime: {type: 'date', optional: true},
  }
};
let RevMessageSchema = {
  name: "revMessage",
  primaryKey: 'fromUid',
  properties: {
    fromUid: 'int',
    type: {type: 'string', optional: true},
    contentType: {type: 'string', optional: true},
    content: {type: 'string', optional: true},
    msgId: {type: 'string', optional: true},
    msgType: {type: 'string', optional: true},
    revTime: {type: 'date', optional: true},
  }
};
let MessageSchema = {
  name: "message",
  primaryKey: 'msgId',
  properties: {
    msgId: 'id',
    fromUid: {type: 'int', optional: true},
    toUid: {type: 'int', optional: true},
    type: {type: 'string', optional: true},
    contentType: {type: 'string', optional: true},
    content: {type: 'string', optional: true},
    msgType: {type: 'string', optional: true},
    revTime: {type: 'date', optional: true}
  }
};

module.exports = {
  UserSchema: UserSchema,
  GroupSchema: GroupSchema,
  SendMessageSchema: SendMessageSchema,
  RevMessageSchema: RevMessageSchema,
  MessageSchema: MessageSchema
};
