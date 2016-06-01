'use strict';
let {
  AppRegistry
  } = require('react-native');

let FasApp = require('./content/framework/system/navigator');

//let FasApp = require('./content/comp/fileCache/cache');

AppRegistry.registerComponent('FasApp', () => FasApp);
