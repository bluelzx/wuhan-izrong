/**
 * Created by vison on 16/3/31.
 */


let UserSchema = {
    name: "friend",
    primaryKey: 'userId',
    properties: {
        userId: 'int',
        userName: 'string',
        photoFileId: 'string',
        orgName: 'string'
    }
};

let GroupSchema = {
    name: "group",
    primaryKey: 'groupId',
    properties: {
        groupId: 'int',
        groupName: 'string',
        groupMasterUname: 'string',
        memberNum: 'int',
        members:{type: 'list', objectType: 'int'}
    }
};

let SendMessageSchema = {
    name: "sendMessage",
    primaryKey: 'toUid',
    properties: {
        toUid: 'int',
        type: 'text',
        contentType: 'text',
        content: 'hello',
        msgId: 'uuid',
        msgType: 'p2pMsg',
        sendTime:'date'

    }
};
let RevMessageSchema = {
    name: "revMessage",
    primaryKey: 'toUid',
    properties: {
        toUid: 2,
        type: 'text',
        contentType: 'text',
        content: 'hello',
        msgId: 'uuid',
        msgType: 'p2pMsg',
        revTime:'date'
    }
};

module.exports = {
    UserSchema: UserSchema,
    GroupSchema:GroupSchema,
    SendMessageSchema:SendMessageSchema,
    RevMessageSchema:RevMessageSchema
};
