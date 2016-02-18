var EdgeGrid = require('edgegrid');

var akamai = {};

akamai.translateError = function(client_token, client_secret, access_token, url, code, msg){
  eg = new EdgeGrid(client_token, client_secret, access_token, url);
  eg.auth({
    "path": "diagnostic-tools/v1/errortranslator?errorCode=" + code,
    "method": "GET",
  });
  eg.send(function(body, response){
    msg.reply("```"+body+"```");
  });
}

akamai.translateArl = function(client_token, client_secret, access_token, url, hostname, msg){
  eg = new EdgeGrid(client_token, client_secret, access_token, url);
  eg.auth({
    "path": "diagnostic-tools/v1/akamaitranslator?hostname=" + hostname,
    "method": "GET",
  });
  eg.send(function(body, response){
    msg.reply("```"+body+"```");
  });
}

akamai.ipGeolocator = function(client_token, client_secret, access_token, url, ipaddress, msg){
  eg = new EdgeGrid(client_token, client_secret, access_token, url);
  eg.auth({
    "path": "diagnostic-tools/v1/ipgeolocator?ip=" + ipaddress,
    "method": "GET",
  });
  eg.send(function(body, response){
    msg.reply("```"+body+"```");
  });
}

akamai.queueLength = function(client_token, client_secret, access_token, url, msg){
  eg = new EdgeGrid(client_token, client_secret, access_token, url);
  eg.auth({
    "path": "ccu/v2/queues/default",
    "method": "GET",
  });
  eg.send(function(body, response){
    msg.reply("```"+body+"```");
  });
}

akamai.purgeRequest = function(client_token, client_secret, access_token, url, env, page, msg){
  eg = new EdgeGrid(client_token, client_secret, access_token, url);
  eg.auth({
    "path": "ccu/v2/queues/default",
    "method": "POST",
    "body": "{\"action\": \"invalidate\", \"domain\": \"" + env + "\", \"objects\": [\"" + page + "\"]}"
  });
  eg.send(function(body, response){
    msg.reply("```"+body+"```");
  });
}

akamai.purgeStatus = function(client_token, client_secret, access_token, url, id, msg){
  eg = new EdgeGrid(client_token, client_secret, access_token, url);
  eg.auth({
    "path": "ccu/v2/purges/" + id,
    "method": "GET",
  });
  eg.send(function(body, response){
    msg.reply("```"+body+"```");
  });
}

module.exports = akamai;

