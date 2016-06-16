/**
 * Created by baoyinghai on 6/12/16.
 */

let _saveLoginUserInfo = function (loginUserInfo , token) {
  let param = {
    userId: loginUserInfo.userId,
    address: loginUserInfo.address,
    realName: loginUserInfo.realName,
    weChatNo: loginUserInfo.weChatNo,
    email: loginUserInfo.email,
    nameCardFileUrl: loginUserInfo.nameCardFileUrl,
    qqNo: loginUserInfo.qqNo,
    department: loginUserInfo.department,
    mobileNumber: loginUserInfo.mobileNumber,
    jobTitle: loginUserInfo.jobTitle,
    phoneNumber: loginUserInfo.phoneNumber,
    photoFileUrl: loginUserInfo.photoFileUrl,
    orgId: loginUserInfo.orgId,
    token: token,
    lastLoginTime: new Date(),
    publicTitle: loginUserInfo.publicTitle || false,
    publicMobile: loginUserInfo.publicMobile || false,
    publicDepart: loginUserInfo.publicDepart || false,
    publicPhone: loginUserInfo.publicPhone || false,
    publicEmail: loginUserInfo.publicEmail || false,
    publicAddress: loginUserInfo.publicAddress || false,
    publicWeChat: loginUserInfo.publicWeChat || false,
    publicQQ: loginUserInfo.publicQQ || false,
    lastSyncTime: null,
    friendList: loginUserInfo.friendList && JSON.stringify(loginUserInfo.friendList),
    certified: loginUserInfo.isCertificated || false
  }
  return param;
}

let _saveImUser = function(orgData){
  let param = {
    userId: orgData.userId,
    address: orgData.address || '',
    realName: orgData.realName || '',
    nameCardFileUrl: orgData.nameCardFileUrl,
    department: orgData.department || '',
    jobTitle: orgData.jobTitle,
    qqNo: orgData.qqNo,
    email: orgData.email,
    weChatNo: orgData.weChatNo,
    mute:orgData.mute||false,
    mobileNumber: orgData.mobileNumber||orgData.mobileNo,
    photoFileUrl: orgData.photoFileUrl||orgData.photoStoredFileUrl,
    orgId: orgData.orgId,
    phoneNumber: orgData.phoneNumber,
    publicTitle: orgData.publicTitle || orgData.isPublicTitle || false,
    publicMobile: orgData.publicMobile || orgData.isPublicMobile || false,
    publicDepart: orgData.publicDepart || orgData.isPublicDepart || false,
    publicPhone: orgData.publicPhone || orgData.isPublicPhone || false,
    publicEmail: orgData.publicEmail || orgData.isPublicEmail || false,
    publicAddress: orgData.publicAddress || orgData.isPublicAddress || false,
    publicWeChat: orgData.publicWeChat || orgData.isPublicWeChat || false,
    publicQQ: orgData.publicQQ || orgData.isPublicQQ || orgData.isPublicQq ||  false,
    certified: orgData.isCertificated || false
  }
  return param;
}


module.exports = {
  saveLoginUserInfo:_saveLoginUserInfo,
  saveImUser:_saveImUser
}
