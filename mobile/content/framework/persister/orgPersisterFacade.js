/**
 * Created by vison on 16/5/17.
 */
let _realm = require('./realmManager');
const _ = require('lodash');
const {OrgBeanSchema,ORGBEAN} = require('./schemas');

let OrgPersisterFacade = {
  updateOrgInfo: (orgInfo)=>_updateOrgInfo(orgInfo)
};

let _updateOrgInfo = function (orgInfo) {
  _realm.write(() => {
    _realm.create(ORGBEAN, {
      id: orgInfo.orgId,
      orgCategory: orgInfo.orgCategory,
      orgCode: orgInfo.orgCode,
      orgValue: orgInfo.orgName,
      corporationType: orgInfo.corporationType,
      orgValueAlias: orgInfo.orgValueAlias,
      totalQuota: orgInfo.totalQuota,
      occupiedQuota: orgInfo.occupiedQuota
    }, true);
  });
};

module.exports = OrgPersisterFacade;
