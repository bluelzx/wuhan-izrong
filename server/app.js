"use strict"

const CONNECT = "connect", CHAT = "chat", QUERY = "query", QUIT = "quit";

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8123});
var _data = new Map();

//客户端接入服务器   用户id, 链接
var dealConnect = function (id, ws) {
  console.log("user connect:" + id);
  _data.set(id, ws);
}

var createResBean = function (msg, id, fid) {
  return {
    state: 'normal',
    body: {
      msg: msg,
      userId: fid,
      tagUserId: id,
      time: new Date()
    }
  };
}
//发送消息  消息  id
var sendMsg = function (msg, id, fid) {
  let ws = _data.get(id);
  if (ws) {
    let content = JSON.stringify(createResBean(msg, id, fid));
    console.log("send:" + content);
    ws.send(content);
    console.log(msg);
  } else {
    //离线处理
  }
}

//删除链接
var closeConnect = function (id) {
  _data.delete(id);
}


wss.on('connection', function (ws) {

  ws.on('message', function (message) {
    //var data = JSON.parse(message);
    //var cmd = data.cmd;
    //switch (cmd) {
    //  case CONNECT:
    //    dealConnect(data.userId, ws);
    //    break;
    //  case CHAT:
    //    sendMsg(data.msg, data.tagUserId, data.userId);
    //    //保存聊天记录到数据库
    //    ;
    //    break;
    //  case QUERY:
    //    ;
    //    break;
    //  case QUIT:
    //    closeConnect(data.userId);
    //    break;
    //  default:
    //    console.log("no cmd " + cmd);
    //    break;
    //}
    console.log('###### received: %s', message);
  });

});
