var request = require('request');


request.post({url: 'http://192.168.64.205:9101/fas/app/pub/getOrgList'}, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    console.log(body); // Show the HTML for the Google homepage.
  }
});
