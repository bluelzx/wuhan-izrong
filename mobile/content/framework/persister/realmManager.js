/**
 * Created by baoyinghai on 4/19/16.
 */
const Realm = require('realm');
let React = require('react-native');

const {
  DeviceSchema,
  GroupSchema,
  MessageSchema,
  ImUserInfoSchema,
  LoginUserInfoSchema,
  OrgBeanSchema,
  FilterItemSchema,
  FilterItemsSchema,
  OrderItemSchema,
  SessionSchema,
  PlatFormInfoSchema,
  HomePageSchema,
  NoticeSchema,
  NewFriendNoticSchema,
  MarketInfoSchema
  } = require('./schemas');
console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema, LoginUserInfoSchema, OrgBeanSchema,NoticeSchema,MarketInfoSchema,
     FilterItemSchema, FilterItemsSchema, OrderItemSchema, SessionSchema,PlatFormInfoSchema,HomePageSchema,NewFriendNoticSchema],
  schemaVersion: 37
});

module.exports = _realm;
