//let ImAction = require('../action/imAction');
let ImStore = require('../store/imStore');
let { MSG_TYPE, SESSION_TYPE, COMMAND_TYPE, UPDATE_GROUP_TYPE, NOTICE_TYPE } = require('../../constants/dictIm');
let KeyGenerator = require('../../comp/utils/keyGenerator');
let ContactSotre = require('../store/contactStore');
let AppStore = require('../store/appStore');
let NotificationModule = require('NativeModules').NotificationModule;

//let {Alert} = require('mx-artifacts');
let _dealMsg = function (message, socket) {
  let userInfo = ContactSotre.getUserInfo();
  let userId = userInfo.userId;
  let lastSyncTime = userInfo.lastSyncTime ? userInfo.lastSyncTime.getTime() : new Date().getTime();
  //console.log(message);
  switch (message.msgType) {
    case MSG_TYPE.EXCEPTION:
      console.log('[error] %s', message.errMsg);
      break;
    case MSG_TYPE.REC_P2P_MSG:
      ImStore.saveMsg({
        sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.USER, message.fromUid, userId),
        // sessionId: 'user:3',
        msgId: message.msgId,
        fromUId: message.fromUid,
        groupId: null,
        toId: null,
        type: SESSION_TYPE.USER,
        contentType: message.contentType,
        content: message.content,
        msgType: message.msgType,
        revTime: new Date(message.sendDate),
        isRead: Boolean(false),
        status: 'Seen'
      }, userId);
      break;
    case MSG_TYPE.SERVER_REC_CONFIRM:
      ImStore.ackMsg(message.msgId, message.toUid);
      break;
    case MSG_TYPE.GROUP_JOIN_INVITE:
      ImStore.saveMsg({
        sessionId:KeyGenerator.getSessionKey(NOTICE_TYPE.INVITE, message.groupId, userId),
        groupId:message.groupId,
        groupName:message.groupName,
        groupOwnerId:message.groupOwnerId,
        msgType:SESSION_TYPE.GROUP_NOTICE,
        revTime:new Date(),
        noticeType: NOTICE_TYPE.INVITE,
        groupInviterName: message.groupInviterName,
        groupInviterOrgValue: message.groupInviterOrgValue
      },userId);
      break;
    case MSG_TYPE.REC_GROUP_MSG:
      ImStore.saveMsg({
        sessionId: KeyGenerator.getSessionKey(SESSION_TYPE.GROUP, message.gid, userId),
        msgId: message.msgId,
        fromUId: message.fromUid,
        groupId: message.gid,
        toId: null,
        type: SESSION_TYPE.GROUP,
        content: message.content,
        contentType: message.contentType,
        msgType: message.msgType,
        revTime: new Date(message.sendDate),
        isRead: Boolean(false),
        status: 'Sean'
      }, userId);
      break;
    case MSG_TYPE.PLATFORM_INFO:
      if (lastSyncTime < message.createDate) {
        ImStore.createPlatFormInfo(message.infoId,
          message.title, message.content,
          new Date(message.createDate),userId);
        ContactSotre.syncReq(new Date(message.createDate));
        lastSyncTime = message.createDate;
      }
      break;
    case MSG_TYPE.HOME_PAGE:
      message.homePageList && ImStore.createHomePageInfo(message.homePageList);
      break;
    case MSG_TYPE.CONTANCT_INFO_UPDATE:
      ImStore.updateContactInfo(message);
      break;
    case MSG_TYPE.CONTANCT_INFO_DELETE:
      ImStore.deleteContactInfo(message.userIdList);
      break;
    case MSG_TYPE.GROUP_INFO_UPDATE:
      ContactSotre.createGroup(message.groupId, message.groupName, message.groupOwnerId, message.members, false);
      switch (message.action) {
        case UPDATE_GROUP_TYPE.CREATE_GROUP:
          ContactSotre.createGroup(message.groupId, message.groupName, message.groupOwnerId, message.members, false);
          break;
        case UPDATE_GROUP_TYPE.UPDATE_GROUP_NAME:
          ImStore.saveMsg({
            sessionId:KeyGenerator.getSessionKey(NOTICE_TYPE.UPDATE_GROUP_NAME, message.groupId, userId),
            groupId:message.groupId,
            groupName:message.groupName,
            groupOwnerId:message.groupOwnerId,
            msgType:SESSION_TYPE.GROUP_NOTICE,
            revTime:new Date(),
            noticeType: NOTICE_TYPE.UPDATE_GROUP_NAME
          },userId);
          break;
        case UPDATE_GROUP_TYPE.UPDATE_GROUP_IMAGE_URL:
          break;
        case UPDATE_GROUP_TYPE.ADD_GROUP_MEMBER:
          if (userId != message.userInfo.userId) {
            ImStore.saveMsg({
              sessionId:KeyGenerator.getSessionKey(NOTICE_TYPE.INVITED, message.groupId, userId),
              groupId:message.groupId,
              groupName:message.groupName,
              groupOwnerId:message.groupOwnerId,
              msgType:SESSION_TYPE.GROUP_NOTICE,
              revTime:new Date(),
              noticeType: NOTICE_TYPE.INVITED,
              realName: message.userInfo.realName,
              orgValue: message.userInfo.orgValue
            },userId);
          }
          break;
        case UPDATE_GROUP_TYPE.KICK_OUT_GROUP_MEMBER:
        case UPDATE_GROUP_TYPE.LEAVE_GROUP:
          //TODO 退出群组的处理...
          ImStore.saveMsg({
            sessionId:KeyGenerator.getSessionKey(NOTICE_TYPE.LEAVE_GROUP, message.groupId, userId),
            groupId:message.groupId,
            groupName:message.groupName,
            groupOwnerId:message.groupOwnerId,
            msgType:SESSION_TYPE.GROUP_NOTICE,
            revTime:new Date(),
            noticeType: NOTICE_TYPE.LEAVE_GROUP,
            userId: message.userInfo.userId
          },userId);
          break;
        default:
          console.log('None message type matched! [%s]', message.msgType);
          console.log(message);
          break;
      }
      break;
    case MSG_TYPE.GROUP_INFO_DELETE:
      //TODO 区分被踢和解散
      ContactSotre.leaveGroup(message.groupId);
      let group = ContactSotre.getGroupDetailById(message.groupId);
      ImStore.saveMsg({
        sessionId:KeyGenerator.getSessionKey(NOTICE_TYPE.DELETE_GROUP, message.groupId, userId),
        groupId:message.groupId,
        groupName:group.groupName,
        groupOwnerId:group.groupMasterUid,
        msgType:SESSION_TYPE.GROUP_NOTICE,
        revTime:new Date(),
        noticeType: NOTICE_TYPE.DELETE_GROUP,
        userId: group.groupMasterUid
      },userId);
      break;
    case MSG_TYPE.SYNC_REQ:
      //message.msgArray.forEach((item)=>{
      //  // console.log(JSON.parse(item));
      //  _dealMsg(JSON.parse(item), socket);
      //});
      socket.send({command: COMMAND_TYPE.SYNC_REQ, lastSyncTime: lastSyncTime});
      break;
    case MSG_TYPE.FORCE_LOGOUT:
      //强制登出
      ImStore.forceLogOut();
      break;
    case MSG_TYPE.SYNC_RES:
      message.msgArray.forEach((item)=> {
        _dealMsg(JSON.parse(item), socket);
      });
      ContactSotre.syncReq(new Date());
      break;
    case MSG_TYPE.CONTANCT_INFO_CERTIFY:
      if (message.userId == AppStore.getUserId()) {
        AppStore.updateUserInfo('certificated', message.isCertificated);
        if(Platform.OS == 'android'){
          NotificationModule.showNotification("系统提示","爱资融","您已通过系统管理员的认证");
        }
      } else {
        ImStore.updateContactInfo(message);
      }
      break;
    case MSG_TYPE.CONTANCT_INFO_UNCERTIFY:
      if (message.userId == AppStore.getUserId()) {
        AppStore.updateUserInfo('certificated', message.isCertificated);
        if(Platform.OS == 'android'){
          NotificationModule.showNotification("系统提示","爱资融","您已被系统管理员取消认证");
        }
      } else {
        ImStore.updateContactInfo(message);
      }
      break;
    case MSG_TYPE.CONTANCT_INFO_FREEZE:
      if (message.userId == AppStore.getUserId()) {
        if(Platform.OS == 'android'){
          NotificationModule.showNotification("系统提示","爱资融","您的帐户已被冻结,请联系系统管理员");
        }
        AppStore.forceLogout();
      }
      break;
    case MSG_TYPE.FRIEND_INVITE:
      ContactSotre.newFriendNotic(Object.assign({
        noticId: KeyGenerator.getSessionKey(SESSION_TYPE.NEWFRIEND,message.userInfo&&message.userInfo.userId, userId)
      }, message.userInfo), userId);
      break;
    case MSG_TYPE.FRIEND_PROMISE:
      console.log(message.uid + '同意加你为好友');
      break;
    case MSG_TYPE.ORG_INFO_UPDATE:
      AppStore.updateOrgInfo(message);
      break;
    default:
      console.log('None message type matched! [%s]', message.msgType);
      console.log(message);
  }
};


let Resolver = {
  deal: function (message, socket) {
    switch (message.type) {
      case 'message':
        this._dealMessage(JSON.parse(message.data), socket);
    }
  },
  _dealMessage: _dealMsg,

  solve: function (message) {
    let msgToSend = {};
    switch (message.msgType) {
      case COMMAND_TYPE.SEND_P2P_MSG:
        msgToSend = {
          toUid: message.toId,
          contentType: message.contentType,
          content: message.content,
          msgId: message.msgId,
          command: COMMAND_TYPE.SEND_P2P_MSG
        };
        break;
      case COMMAND_TYPE.SEND_GROUP_MSG:
        msgToSend = {
          toGid: message.groupId,
          // type: message.contentType,
          contentType: message.contentType,
          content: message.content,
          msgId: message.msgId,
          command: COMMAND_TYPE.SEND_GROUP_MSG
        };
        break;
      case COMMAND_TYPE.SYNC_REQ:
        msgToSend = message;
        break;
      case COMMAND_TYPE.KPI_APP:
        msgToSend = message;
        break;
      default:
        console.log('None message type matched! [%s]', message.msgType);
    }
    return msgToSend;
  }
};

module.exports = Resolver;
