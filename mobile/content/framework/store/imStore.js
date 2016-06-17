let _ = require('lodash');
let EventEmitter = require('events').EventEmitter;

let { SESSION_TYPE, NOTICE_TYPE, DELETE_TYPE } = require('../../constants/dictIm');
let DictEvent = require('../../constants/dictEvent');
let { IM_CONTACT,HOMEPAGE_CHANGE ,IM_SESSION_LIST} = require('../../constants/dictEvent');
let Persister = require('../persister/persisterFacade');
let SessionAction = require('../action/sessionAction');
let AppStore = require('./appStore');
let ContactStore = require('./contactStore');
let NoticeAction = require('../action/noticeAction');
let ContactAction = require('../action/contactAction');
let _info = {
  initLoadingState: true,
  netWorkState: false,
  isLogout: false,
  isForceLogout: false
};

let _data = {
  toId: '',
  sessionId: '',
  page: 1,
  userId: '',
  userPhotoFileUrl: {uri: 'https://facebook.github.io/react/img/logo_og.png'},
  messages: []
};

let ImStore = _.assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback, event = DictEvent.IM_CHANGE) {
      this.on(event, callback);
    },
    removeChangeListener: function (callback, event = DictEvent.IM_CHANGE) {
      this.removeListener(event, callback);
    },
    emitChange: function (event = DictEvent.IM_CHANGE, data = {}) {
      this.emit(event, data);
    },

    imInit: () => _imInit(),
    sessionInit: (data) => _sessionInit(data),
    getMessages: () => _data.messages,
    saveMsg: (message, userId) => _saveMsg(message, userId),
    ackMsg: (msgId, toUid, isMute, isNetErr) => _ackMsg(msgId, toUid, isMute, isNetErr),
    getEarlier: () => _getEarlier(),
    createHomePageInfo: (msgList)=> {
      Persister.createHomePageInfo(msgList);
      AppStore.emitChange(HOMEPAGE_CHANGE);
    },
    createPlatFormInfo: (infoId, title, content, createDate, userId)=> {
      Persister.createPlatFormInfo(infoId, title, content, createDate, userId);
      AppStore.emitChange(IM_SESSION_LIST);
    },
    deleteContactInfo: (userId)=> {
      Persister.deleteContactInfo(userId);
      AppStore.emitChange(IM_CONTACT);
    },
    updateContactInfo: (message) => {
      Persister.updateContactInfo(message);
      AppStore.emitChange(IM_CONTACT);
    },
    isInGroupById: (id, userId) => {
      return Persister.isInGroupById(id, userId);
    },
    modifyImgUrl: (msgId, url) => _modifyImgUrl(msgId, url),
    modifyMsgState:(msgId, status)=>_modifyMsgState(msgId, status)
  }
);

let _modifyImgUrl = function(msgId, url) {
  Persister.modifyImgUrl(msgId, url);
  _data.messages.forEach((obj)=>{
    if(obj.msgId == msgId){
      obj.content = url;
    }
  });
  ImStore.emitChange(DictEvent.IM_SESSION);
}

let _modifyMsgState = function(msgId, status){
  Persister.modifyMsgState(msgId, status);
  _data.messages.forEach((obj)=>{
    if(obj.msgId == msgId){
      obj.status = status;
    }
  });
  ImStore.emitChange(DictEvent.IM_SESSION);
}


// Private Functions
let _imInit = () => {

};

let _isInGroupById = function(id, userId) {
  return Persister.isInGroupById(id, userId);
}

let _resovleMessages = (bInit = false) => {
  let savedMessages = Persister.getMessageBySessionId(_data.sessionId, _data.page, _data.userId);
  // sort
 //savedMessages.reverse();
  let tmpMessages = [];
  let tmpMessage = {};
  let name = _data.hisName;
  //if(_data.)
  savedMessages.forEach((object, index, collection) => {

    if (object.fromUId) { // Received
      let userInfo = ContactStore.getUserInfoByUserId(object.fromUId);
      let name = userInfo.realName;
      tmpMessage = {
        msgId: object.msgId,
        contentType: object.contentType,
        content: object.content,
        name: name,
        image: userInfo.photoFileUrl,
        position: 'left',
        date: object.revTime,
        certified:userInfo.certified,
        messageType:_data.messageType ,
        orgValue:ContactStore.getOrgValueByOrgId(userInfo.orgId),
      };
    } else { // Sent
      //let userInfo = ContactStore.getUserInfoByUserId(_data.userId);//本人
      let userInfo = ContactStore.getUserInfo();//本人
      tmpMessage = {
        msgId: object.msgId,
        contentType: object.contentType,
        content: object.content,
        //name: _data.userId,
        name: _data.myName,
        image: _data.userPhotoFileUrl,
        position: 'right',
        date: object.revTime,
        status: object.status === 'Sending'?'ErrorButton':object.status,
        certified:userInfo.certified,
        messageType:_data.messageType ,
        orgValue:ContactStore.getOrgValueByOrgId(userInfo.orgId),
      };
    }

    bInit ? null : tmpMessages.unshift(tmpMessage);
    _data.messages.unshift(tmpMessage);
  });

  if (bInit) {
    ImStore.emitChange(DictEvent.IM_SESSION);
  } else {
  return tmpMessages.reverse();
}
};

let _sessionInit = (data) => {
  _data.toId = data.toId;
  _data.sessionId = data.sessionId;
  _data.page = 1;
  _data.messages = [];
  _data.userId = data.userId,
  _data.myName=data.myName,
    _data.certified = data.certified,
  _data.userPhotoFileUrl = data.photoFileUrl;
  _data.messageType = data.messageType;
  _resovleMessages(true);
  ImStore.emitChange(DictEvent.IM_SESSION);
};

let _saveMsg = (message, userId) => {

  console.log('saveMsg' , message);
  //TODO 还有INVITED和有人退出群组消息的情况需要处理
  if(message.msgType == SESSION_TYPE.GROUP_NOTICE){
    //TODO 这种情况考虑换个地方处理,群通知在会话中只有一个所以是覆盖前一个群通知会话
    SessionAction.updateSession(message.msgType, message.sessionId, message.groupName,'群邀请',message.revTime,message.contentType, userId, {noticeType:message.noticeType, notAdd:true});
    //TODO: 根据noticeType区分是什么类型的群通知
    let title = '';
    let content = '';
    if (message.noticeType == NOTICE_TYPE.LEAVE_GROUP) {
      title = message.groupName;
      let userInfo = ContactStore.getUserInfoByUserId(message.userId);
      content = userInfo.realName + '-' + userInfo.orgValue + '离开了群聊';
    } else if (message.noticeType == NOTICE_TYPE.INVITED){
      title = message.groupName;
      content = message.realName + '-' + message.orgValue + '加入了群聊';
    } else if (message.noticeType == DELETE_TYPE.DELETE_GROUP) {
      title = message.groupName;
      let userInfo = ContactStore.getUserInfoByUserId(message.groupOwnerId);
      content = '群主' + userInfo.realName + '解散了' + message.groupName + '群聊';
    }else if (message.noticeType == DELETE_TYPE.KICK_OUT) {
      title = message.groupName;
      content = '群主将你请出了' + message.groupName + '群聊';
    } else if (message.noticeType == NOTICE_TYPE.UPDATE_GROUP_NAME) {
      title = message.groupName;
      content = '群主已将群名称修改为' + message.groupName;
    }else {
      title = message.groupInviterName + '-' + message.groupInviterOrgValue;
      content = '邀请您加入'+ message.groupName;
    }

    NoticeAction.updateNotice(message.noticeType, message.sessionId, message.groupName, message.revTime, title, content,  message.groupId, message.groupOwnerId);
    return ;
  }
  if(message.type == SESSION_TYPE.USER){

    let notAdd = false;
    //let group = ContactStore.getGroupDetailById(message.groupId);
    let n = AppStore.getNavigator();
    if(n){
      let routs = n.getCurrentRoutes();
      if(routs){
        let len = routs.length;
        if(len) {
          let cur = routs[len - 1];
          if(cur.comp && cur.param){
            //当前会话
            //p2p
            if(cur.comp.displayName == 'Chat' && cur.param.chatType =='user' && cur.param.userId == (message.toId || message.fromUId)){
              // 不加1
              notAdd = true;
            }else if(cur.comp.displayName == 'ImUserInfo' && cur.param.userId==(message.toId || message.fromUId)){
                notAdd = true;
            }else if(cur.comp.displayName == 'Publish' && cur.param.userId==(message.toId || message.fromUId)){
              notAdd = true;
            }
          }
        }
      }
    }


    let user = {};
    try{
      user = ContactStore.getUserInfoByUserId(message.toId || message.fromUId);
    }catch(err){
      ContactAction.getUserInfoFromServer(message.toId || message.fromUId).then(()=>{
        _saveMsg(message, userId);
      }).catch((err)=>{
        console.log('##########getUsrInfoByUserId is null##############');
      });
      return;
    }
    SessionAction.updateSession(message.type, message.sessionId,user.realName ,message.content,message.revTime,message.contentType, userId, {notAdd:notAdd});
  }else if(message.type == SESSION_TYPE.GROUP){
    let user;
    if(message.fromUId == null){
      user = ContactStore.getUserInfo(userId);
      let orgValue = ContactStore.getOrgValueByOrgId(user.orgId);
      user.orgValue = orgValue;
    } else {
      user = ContactStore.getUserInfoByUserId(message.fromUId);
    }
    let content = user.realName + '-' + user.orgValue + ':::' + message.content;
    let notAdd = false;
    //let group = ContactStore.getGroupDetailById(message.groupId);
    let n = AppStore.getNavigator();
    if(n){
      let routs = n.getCurrentRoutes();
      if(routs){
        let len = routs.length;
        if(len) {
          let cur = routs[len - 1];
          if(cur.comp && cur.param){
            //当前会话
            //p2g
            if(cur.comp.displayName == 'Chat' && cur.param.chatType =='group' && cur.param.groupId == message.groupId) {
              //不加1
              notAdd = true;
            }else if(cur.comp.displayName == 'EditGroup' && cur.param.groupId == message.groupId){
              notAdd = true;
            }else if(cur.comp.displayName == 'EditGroupMaster' && cur.param.groupId == message.groupId){
              notAdd = true;
            }else if(cur.comp.displayName == 'Publish' && cur.param.groupId == message.groupId){
              notAdd = true;
            }
          }
        }
      }
    }

    let group = ContactStore.getGroupDetailById(message.groupId);
    SessionAction.updateSession(message.type, message.sessionId,group.groupName,content,message.revTime,message.contentType, userId, {notAdd:notAdd});
  }

  if (message.sessionId === _data.sessionId) {
    if (message.fromUId) { // Received
      // TODO. Get user info by id.
      let userInfo = ContactStore.getUserInfoByUserId(message.fromUId);
      let name = userInfo.realName;
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        name: name,
        image: userInfo.photoFileUrl,
        position: 'left',
        date: message.revTime,
        certified:userInfo.certified,
        messageType:_data.messageType ,
        orgValue:ContactStore.getOrgValueByOrgId(userInfo.orgId),

      });
    } else if (message.fromUId == -1) {
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        position: 'middle',
        date: message.revTime,
      });
    }else { // Send
     // let userInfo = ContactStore.getUserInfoByUserId(_data.userId);//本人
      let userInfo = ContactStore.getUserInfo();//本人
      _data.messages.push({
        msgId: message.msgId,
        contentType: message.contentType,
        content: message.content,
        name: _data.myName,
        image: _data.userPhotoFileUrl,
        position: 'right',
        date: message.revTime,
        status: message.status,
        certified:_data.certified,
        messageType:_data.messageType ,
        orgValue:ContactStore.getOrgValueByOrgId(userInfo.orgId),
        localUri:message.localUri,
        cb:message.cb,
        erCb:message.erCb
      });
    }

    ImStore.emitChange(DictEvent.IM_SESSION);
  }

  Persister.saveMessage(message, userId);
};

let _ackMsg = (msgId, toUid, isMute, isNetErr) => {
  if (_data.toId === toUid) {
    _data.messages.find((value, index, arr) => {
      if (value.msgId === msgId) {
        if(isMute){
         value.status = 'isMute';
        }else if(isNetErr){
          value.status = 'isNetErr';
        }else {
          value.status = 'Seen';
        }
        return true;
      }
      return false;
    });

    ImStore.emitChange(DictEvent.IM_SESSION);
  }

  // TODO. Update realm of the status for message.
  Persister.resetMessageStatus(msgId, isMute,isNetErr);
  // ImStore.emitChange(CHANGE_EVENT.UPDATE, message);
};

let _getEarlier = () => {
  _data.page++;
  return _resovleMessages(false);
  // ImStore.emitChange();
};

module.exports = ImStore;
