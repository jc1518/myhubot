// Description:
// akamai
//
// Commands:
// hubot akamai help

var akamai = require('../lib/akamai');

diag_client_token = process.env.AKAMAI_DIAG_CLIENT_TOKEN
diag_client_secret = process.env.AKAMAI_DIAG_CLIENT_SECRET
diag_access_token = process.env.AKAMAI_DIAG_ACCESS_TOKEN
diag_url = process.env.AKAMAI_DIAG_URL

ccu_client_token = process.env.AKAMAI_CCU_CLIENT_TOKEN
ccu_client_secret = process.env.AKAMAI_CCU_CLIENT_SECRET
ccu_access_token = process.env.AKAMAI_CCU_ACCESS_TOKEN
ccu_url = process.env.AKAMAI_CCU_URL

function sendHelp(msg){
  helpString = "*Usage*:\n"
  helpString += "'akamai translate error <code>' - Helps decode an error string sent by an edge server to the browser.\n";
  helpString += "'akamai translate arl <hostname>' - Translates an Akamaized URL into typecode, origin server, CP code, serial number, TTL.\n";
  helpString += "'akamai locate ip <ipaddress >' - Retrieves the location details for the provided IP address.\n";
  helpString += "'akamai queue length' - Returns the number of outstanding objects in the user's queue.\n";
  helpString += "'akamai purge content <url>' - Submits a request to purge Edge content represented by URL.\n";
  helpString += "'akamai purge status <purgeid>' -  Request that status information of the purge id.";
  msg.send(helpString);
}

module.exports = function(robot){
  robot.respond(/akamai (\?|help)/i, function(msg){
    sendHelp(msg);
  });

  robot.respond(/akamai translate error( Reference #| #|\s)(.*)/i, function(msg){
    errorCode = msg.match[2];
    msg.reply("Translating error code: " + errorCode);
    akamai.translateError(diag_client_token, diag_client_secret, diag_access_token, diag_url, errorCode, msg);
  });

  robot.respond(/akamai translate arl (.*)/i, function(msg){
    hostName = msg.match[1];
    msg.reply("Translating Akamaized URL: " + hostName);
    akamai.translateArl(diag_client_token, diag_client_secret, diag_access_token, diag_url, hostName, msg);
  });

  robot.respond(/akamai locate ip (.*)/i, function(msg){
    ipAddress = msg.match[1];
    msg.reply("Finding the geolocation of IP address: " + ipAddress);
    akamai.ipGeolocator(diag_client_token, diag_client_secret, diag_access_token, diag_url, ipAddress, msg);
  });

  robot.respond(/akamai queue length/i, function(msg){
    msg.reply("Reading queue length:");
    akamai.queueLength(ccu_client_token, ccu_client_secret, ccu_access_token, ccu_url, msg);
  });

  robot.respond(/akamai purge content (.*)/i, function(msg){
    page = msg.match[1];
    msg.reply("Purging the content of: " + page);
    akamai.purgeRequest(ccu_client_token, ccu_client_secret, ccu_access_token, ccu_url, page, msg);
  });

  robot.respond(/akamai purge status (.*)/i, function(msg){
    id = msg.match[1];
    msg.reply("Chekcing purge status of: " + id);
    akamai.purgeStatus(ccu_client_token, ccu_client_secret, ccu_access_token, ccu_url, id, msg);
  });
}



