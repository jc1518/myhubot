// Description:
// omb - Oh My Bill
// Commands:
// hubot omb help

var omb = require('../lib/omb');
var API_ENDPOINT = 'https://chapi.cloudhealthtech.com/olap_reports/';
var API_KEY = process.env.CLOUDHEALTH_API_KEY;

// To ignore the ssl warning if any
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function sendHelp(msg){
  helpString = "*omb stands for Oh My Bill*\n";
  helpString += "Usage:\n";
  helpString += "\tomb now - show all AWS accounts and month to date bill\n";
  helpString += "\tomb all - show the history cost of all AWS accounts\n";
  helpString += "\tomb <account_name> <monthly/ weekly/ daily/ hourly> - show the history cost of a specified account";
  msg.send("```" + helpString + "```")
}

module.exports = function(robot){
  robot.respond(/omb (\?|help)/i, function(msg){
    sendHelp(msg);
  });

  robot.respond(/omb now/i, function(msg){
    msg.send('Are we still on budget? Let me find it out.');
    uri = uri = API_ENDPOINT + 'cost/current' + '?api_key=' + API_KEY;
    omb.findCost(uri, 'AWS-Account', msg);
  });

  robot.respond(/omb all/i, function(msg){
    msg.send('I wish my payslip could look like this.');
    uri = API_ENDPOINT + 'cost/history' + '?api_key=' + API_KEY;
    omb.findCost(uri, 'time', msg);
  });

  // Replace accounts with your own accounts
  robot.respond(/omb (accountA|accountB) (monthly|weekly|daily|hourly)/i, function(msg){
    accountName = msg.match[1].replace(/ /g,'').toLowerCase().trim();
    msg.send('Hi ' + accountName + ' team,  any free ice cream this month?');
    if (accountName === "accounta") { accountId = "111111111111" };
    if (accountName === "accountb") { accountId = "222222222222" };
    interval = msg.match[2].replace(/ /g,'').toLowerCase().trim();
    uri = API_ENDPOINT + 'cost/current?interval=' + interval + '&dimensions[]=time&dimensions[]=AWS-Service-Category&measures[]=cost&filters[]=AWS-Account:select:' + accountId + '&api_key=' + API_KEY;
    omb.findCost(uri, 'time', msg);
  });
}
