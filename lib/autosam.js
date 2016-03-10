var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-2';

var AutoSam = new AWS.DynamoDB.DocumentClient();
var autosam = {};

// Replace cloudlets-redirects with your table name
var JobQueue = 'cloudlets-redirects';

autosam.list = function(jobstatus, msg){
  if (jobstatus == 'ALL') {
    var params = {
      TableName: JobQueue
    }
  }
  else {
    var params = {
      TableName : JobQueue,
      FilterExpression : 'jobstatus = :jobstatus',
      ExpressionAttributeValues : {':jobstatus' : jobstatus}
    }
  };
  AutoSam.scan(params, function(err, data) {
    if (err) {
      msg.send("```"+err+"```");
    }
    else {
      len = data.Items.length;
      if (len == 0) {
          msg.send("```"+"Unable to find any jobs"+"```");
      }
      else {
        jobs = "There are "+len+" jobs in "+jobstatus+" status:\n"
        for (var i = 0; i < len; i++){
          j = i + 1;
          jobs = jobs+"("+j+")"+" FROM: "+data.Items[i].fromurl+" TO: "+data.Items[i].tourl+" STATUS: "+data.Items[i].jobstatus+"\n";
        }
        msg.send("```"+jobs+"```");
      }
    }
  });
}

autosam.add = function(fromurl, tourl, msg) {
  var params = {
    TableName: JobQueue,
    Item: {
      fromurl: fromurl,
      tourl: tourl,
      jobstatus: 'OPEN'
    }
  }
  AutoSam.put(params, function(err, data) {
    if (err) {
      msg.send("```"+err+"```");
    }
    else {
      msg.send("```"+"The job has been created"+"```");
    }
  });
}

autosam.remove = function(fromurl, tourl, msg) {
  var params = {
    TableName: JobQueue,
    Key: {
      fromurl: fromurl
    },
    Expected: {
      jobstatus: {
        Value: 'OPEN'
      },
      tourl: {
        Value: tourl
      }
    }
  }
  AutoSam.delete(params, function(err, data) {
    if (err) {
      msg.send("```"+err+"```");
    }
    else {
      msg.send("```"+"The job has been deleted"+"```");
    }
  });
}

autosam.search = function(fromurl, msg) {
  var params = {
    TableName: JobQueue,
    Key: {
      fromurl: fromurl
    }
  };
  AutoSam.get(params, function(err, data) {
    if (err) {
      msg.send("```"+err+"```");
    }
    else {
      len = Object.keys(data).length;
      if (len == 0) {
        msg.send("```"+"Unable to find it"+"```");
      }
      else {
        msg.send("```"+"FROM: "+data.Item.fromurl+" TO: "+data.Item.tourl+" STATUS: "+data.Item.jobstatus+"```");
      };
    }
  });
}

module.exports = autosam;
