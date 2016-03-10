# Description
#   Find who is oncall
#
# Commands:
#   hubot who is oncall - Find out who is the Unix oncall.
#
opsgenie_api_key = process.env.OPSGENIE_API_KEY

module.exports = (robot) ->
  robot.respond /who is (oncall|on call)/i, (msg) ->
    # Replace devops_schedule with your schedule name
    robot.http("https://api.opsgenie.com/v1.1/json/schedule/whoIsOnCall?apiKey=#{opsgenie_api_key}&name=devops_schedule")
      .header('Accept', 'application/json')
      .get() (err, res, body) ->
        poorMan = JSON.parse(body).participants[0].name.split("@",1)[0]
        msg.reply "Poor #{poorMan} is oncall now"

