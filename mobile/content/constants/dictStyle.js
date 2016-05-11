const React = require('react-native');
const {
  StyleSheet,
  } = React;

const { Device } = require('mx-artifacts');

const TABBAR_HEIGHT = 50;

const PlainStyle = {

  colorSet: {
    // loading: '';
    arrowColor: '#a8afb3',
    navBar: '#4074e6',
    navBarFont: '#ffffff',
    content: '#f4f4f4',
    btnEnable: '#4074e6',
    btnDisable: '#b3c7f5',
    inputBorderColor: '#b7c7dc',
    inputBackgroundColor: '#ffffff',
    inputTextColor: '#000000',
    inputPlaceholderTextColor: '#c7d2da',
    commonTextColor: '#000000',
    homeMenuColor: '#ffffff',
    homeListHeaderColor: '#f3f4f5',
    homeListItemColor: '#f7f7f7',
    homeListTextColor: '#394448',
    personalItemColor: '#ffffff',
    personalRealName: '#3b4549',
    personalOrgName: '#8a9499',
    userInfoBorderColor:'#d3d5e0',
    userInfoTextColor: '#979fa2',
    textEditBackground: '#fefefe',
    textEditTextColor: '#000000',
    textEditBorderColor: '#d7d8d9',
    aboutUsTextColor:'#3b4549',
    imTitleTextColor:'#3B4549',
    imTimeTextColor:'#BAC5CC',
    searchBarColor:'#BAC5CC',
    demarcationColor:'#DFE1ED',
    extenListGroundCol:'#FEFEFE',
    extenListArrowColor:'#A3AAAE',
    extenListGroupTitleColor:'#F4F4F4',
    sessionDetailColor:'#687886'
  },

  heightSet: {
    statusBar: Device.innerStatusBarSize,
    navBar: Device.navBarHeight,
    content: Device.height - Device.navBarHeight,
    tabBar: TABBAR_HEIGHT,
    tabContent: Device.height - Device.navBarHeight - TABBAR_HEIGHT
  },

  tabBar: {
    tintColor: '#ffffff',
    barTintColor: '#2b3849'
  },

  //market
  marketSet: {
    fontColor: '#3b4549',
    filterSelectColor: '#4fc1e9',
    amountColor: '#4074e6',
    modifyDateColor: '#f33b1e',
  },

  imChat:{
    leftBackgroundColor:'#FEFEFE',
    rightBackgroundColor: '#44B5E6',
    textInputBorderColor:'#DFE0E7',
    textInputBackGroundColor:'#F4F4F4',
    autoExpandingTextInputBackGroundColor:'#ffffff',
    textInputFontColor:'#3B4549',
    iconBorderColor:'#585F6B',
    iconTextColor:'#585F6B',
    panelContainerColor:'#F4F4F4',
    panelTextColor:'#585F6B',
    chatTipsTextColor:'#959DA2',

  },

  groupManage:{
    memberNameColor:'#3B4549',
    memberListBackgroundColor:'#FEFEFE',
    buttonArrowColor:'#A3AAAE',
  }


};


const DictStyle = StyleSheet.create({

  fullScreen: {
    height: Device.height,
    width: Device.width,
  },

  block: {
    flex: 1
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  backgroundColor: {
    backgroundColor: '#F5F5F5'
  },

  borderColor: {
    borderColor: '#D3D3D3'
  },

  fontColor: {
    color: '#000000'
  },

  fontSize: {
    fontSize: 16
  },

  row: {
    flexDirection: 'row'
  },

  column: {
    flexDirection: 'column'
  },

  navBar: {
    flexDirection: 'row',
    borderColor: '#A47441',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: PlainStyle.heightSet.navBar,
    paddingTop: PlainStyle.heightSet.statusBar
  },

  textInput: {
    fontSize: 18,
    color: PlainStyle.colorSet.inputTextColor,
    marginLeft: 9,
    width: Device.width * (375 - 80) / 375
  },

  userInfoValueItem: {
    fontSize: 15,
    color: PlainStyle.colorSet.userInfoTextColor,
    textAlign: 'right'
  },

  textEditItem: {
    backgroundColor: PlainStyle.colorSet.textEditBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: PlainStyle.colorSet.textEditBorderColor,
    borderTopColor: PlainStyle.colorSet.textEditBorderColor,
    borderTopWidth: 0.5
  },

  userInfoBorderBottom:{
    borderBottomColor:PlainStyle.colorSet.userInfoBorderColor,
    borderBottomWidth:1
  },
  userInfoBorderTop:{
    borderTopColor:PlainStyle.colorSet.userInfoBorderColor,
    borderTopWidth:1
  }

});

module.exports = Object.assign(PlainStyle, DictStyle);
