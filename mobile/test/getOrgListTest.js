var request = require('request');


request.post({url: 'http://114.55.16.46:80/fas/app/pub/getOrgList'}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body); // Show the HTML for the Google homepage.
  }
});
