
var developConfig = {
  Dev: true, // Switch for log. true means print.
  Host: 'http://192.168.64.205:9101/fas',
  ImHost:'192.168.61.84:4000'//dev
};

var productConfig = {
  Dev: false, // Switch for log. true means print.
  Host: 'http://139.196.174.42:9201/fas',
  ImHost: '139.196.174.42:4000'
};

var Config = developConfig;

module.exports = Config;
//module.exports = function () {
//  //switch(process.env.NODE_ENV){
//  //  case 'develop':
//  //    return developConfig;
//  //  case 'product':
//  //    return productConfig;
//  //  default :
//  //    return productConfig;
//  //}
//  return {...developConfig};
//};

