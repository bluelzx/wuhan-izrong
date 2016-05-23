/**
 * Created by vison on 16/5/17.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {OrgBeanSchema,ORGBEAN} = require('./schemas');

let OrgPersisterFacade = {
  updateOrgInfo: (orgInfo)=>_updateOrgInfo(orgInfo)
};

//推送消息某些字段缺失
let _updateOrgInfo = function (orgInfo) {
  _realm.write(() => {
    _realm.create(ORGBEAN, {
      id: orgInfo.orgId,
      corporationType: orgInfo.corporationType,
      orgCategory: orgInfo.orgCategory,
      orgCode: orgInfo.orgCode,
      orgValue: orgInfo.orgName,
      orgValueAlias: orgInfo.orgValueAlias,
      totalQuota: orgInfo.totalQuota,
      occupiedQuota: orgInfo.occupiedQuota,
      isDisabled: orgInfo.isDisabled?orgInfo.isDisabled:null,
      creator: orgInfo.creator?orgInfo.creator:null,
      creatorDate: orgInfo.creatorDate?orgInfo.creatorDate:null,
      lastUpdateBy: orgInfo.lastUpdateBy?orgInfo.lastUpdateBy:null,
      isNeedAudit: orgInfo.isNeedAudit?orgInfo.isNeedAudit:null,
      isDeleted: orgInfo.isDeleted?orgInfo.isDeleted:null,
      isApply: orgInfo.isApply?orgInfo.isApply:null,
      remark: orgInfo.remark?orgInfo.remark:null,
      lastUpdateDate:orgInfo.lastUpdateDate?orgInfo.lastUpdateDate:null
    }, true);
  });
};

module.exports = OrgPersisterFacade;
