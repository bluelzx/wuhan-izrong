var request = require('request');


request.post({url: 'http://192.168.64.169/fas/app/pub/getOrgList'}, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    console.log(body); // Show the HTML for the Google homepage.
  }
});
