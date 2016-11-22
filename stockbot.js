var Botkit = require('botkit');
var yfinance = require('yfinance');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

controller.hears(['\\$(.*)'], ['ambient'], function(bot,message) {
    const  { user, channel, text } = message;
    const userData = text.match(/\$([A-Z]+)/)
    if ( userData ) {


        yfinance.getQuotes(userData[1], function (err, data) {
            if(err) console.log(err);
            bot.reply(message, data);
            data = data[0];
            if (data) {
                bot.reply(message, ""
                          + data.Name
                          + " ("+data.symbol
                          + ")"+" - "
                          + data.LastTradePriceOnly
                          + " | "
                          + data.ChangeinPercent
                          + " | "
                          + "↓ "
                          + data.DaysLow
                          + " | "
                          + "↑ "
                          + data.DaysHigh
                         );
            }

        });

    }
});
