
const React = require('react-native');
const {
  StyleSheet,
  } = React;

const { Device } = require('mx-artifacts');

const TABBAR_HEIGHT = 50;

const PlainStyle = {

  colorSet: {
    navBar: '#4074e6',
    navBarFont: '#ffffff',
    content: '#f7f7f7',
    btnEnable: '#4074e6',
    btnDisable: '#b3c7f5',
  },

  heightSet: {
    statusBar: Device.innerStatusBarSize,
    navBar: Device.navBarHeight,
    content: Device.height - Device.navBarHeight,
    tabBar: TABBAR_HEIGHT,
    tabContent: Device.height - Device.navBarHeight - TABBAR_HEIGHT,
  },

  tabBar: {
    tintColor: '#ffffff',
    barTintColor: '#2b3849'
  },

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
    color: 'grey'
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
    paddingTop: PlainStyle.heightSet.statusBar,
  },
});

module.exports = Object.assign(PlainStyle, DictStyle);
