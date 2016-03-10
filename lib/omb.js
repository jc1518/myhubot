// omb stands for Oh My Bill
var https = require('https');
var request = require('request');

var omb = {};

omb.findCost = function(uri, dimension, msg){

  var options = {
    uri: uri,
    headers: { 'Accept': 'application/json'  }
  };

  function parseBill(callback){
    var yourBill = '';
    request(options, function(error, response, body) {
      bill = JSON.parse(body);

	    var months = [];
	      bill.dimensions[0][dimension].forEach(function(month){
		    months.push(month.label);
	    });

      /*
	    var services = [];
	      bill.dimensions[1]['AWS-Service-Category'].forEach(function(service){
		    services.push(service.label);
	    });
	    */

      var costs = [];
	      bill.data.forEach(function(cost){
		    costs.push(cost);
	    });

      var subcost = [];
	      costs.forEach(function(cost){
		    subcost.push(cost[0]);
	    });

	    for (var i = months.length - 1; i > 0; i--) {
        yourBill += months[i] + ': $' + Math.round(subcost[i]*100)/100 + '\n';
		  /*
		    for (var j = 1 ; j < services.length; j++) {
		      var service_cost = [];
			      costs.forEach(function(cost){
				    service_cost.push(cost[j])
		  	  });
		    console.log(services[j] + " : " + Math.round(service_cost[j]*100)/100);
		    };
		  */
	    };
      callback(yourBill);
    });
  };

  parseBill(function(yourBill){
   // console.log(yourBill);
    msg.send("```" + yourBill + "```");
  });

}

module.exports = omb;
