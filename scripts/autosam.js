// Description:
// autosam
//
// Commands:
// hubot autosam help

var autosam = require('../lib/autosam');

function sendHelp(msg){
  helpString = "*Usage*:\n"
  helpString += "'autosam list <jobstatus>' - List redirect jobs that are in the open|staging|production|closed|all status.\n";
  helpString += "'autosam <add|remove> <from_url> <to_url>' - Add or remove a URL redirect job.\n";
  helpString += "'autosam search <from_url>' - Search the redirect job for <from_url>";
  msg.send("```"+helpString+"```");
}

module.exports = function(robot){

  robot.respond(/autosam (\?|help)/i, function(msg){
    sendHelp(msg);
  });

  robot.respond(/autosam list (.*)/i, function(msg){
    jobstatus = msg.match[1].replace(/ /g,'').toUpperCase();
    autosam.list(jobstatus, msg);
  });

  robot.respond(/autosam (add|remove) (http:\/\/|https:\/\/)(.*) (http:\/\/|https:\/\/)(.*)/i, function(msg){
    action = msg.match[1].replace(/ /g,'').toLowerCase();
    fromurl = msg.match[2].replace(/ /g,'')+msg.match[3].replace(/ /g,'').trim();
    tourl = msg.match[4].replace(/ /g,'')+msg.match[5].replace(/ /g,'').trim();
    if (action == 'add'){
      autosam.add(fromurl, tourl, msg);
      robot.messageRoom('team-ops', msg.message.user.email_address+" added FROM:"+fromurl+" TO:"+tourl);
    }
    if (action == 'remove'){
      autosam.remove(fromurl, tourl, msg);
      robot.messageRoom('team-ops', msg.message.user.email_address+" removed FROM:"+fromurl+" TO:"+tourl);
    }
  });

  robot.respond(/autosam search (.*)/i, function(msg){
    fromurl = msg.match[1].replace(/ /g,'').toLowerCase().trim();
    autosam.search(fromurl, msg);
  });
}


