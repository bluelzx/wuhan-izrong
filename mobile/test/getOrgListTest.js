var request = require('request');


request.post({url: 'http://121.40.51.79:8081/app/pub/getOrgList'}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body); // Show the HTML for the Google homepage.
  }
});
