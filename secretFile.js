var request = require('request');
var configs = require('./googleServiceAccount.json');


request.defaults({'content-type': 'application/json', "Accept": 'application/vnd.heroku+json; version=3'})
request.patch('https://api.heroku.com/apps/snap-biz/config-vars', configs, function(err) {
    console.log(err);
    console.log(configs);
})

