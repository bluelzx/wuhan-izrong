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
  BizOrderCategorySchema,
  BizOrderItemSchema,
  FilterItemSchema,
  FilterItemsSchema,
  OrderItemSchema,
  SessionSchema,
  PlatFormInfoSchema,
  HomePageSchema,
  NoticeSchema
  } = require('./schemas');
console.log(Realm.defaultPath);
let _realm = new Realm({
  schema: [DeviceSchema, GroupSchema, MessageSchema, ImUserInfoSchema, LoginUserInfoSchema, OrgBeanSchema,NoticeSchema,
    BizOrderCategorySchema, BizOrderItemSchema, FilterItemSchema, FilterItemsSchema, OrderItemSchema, SessionSchema,PlatFormInfoSchema,HomePageSchema],
  schemaVersion: 30
});

module.exports = _realm;
