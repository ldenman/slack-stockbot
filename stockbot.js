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
    console.log(message);
    const  { user, channel, text } = message;
    const userData = text.match(/\$([A-Z]+)/g)
    console.log(userData);
    if ( userData.length > 0 ) {

        userData.forEach(function(e) {



        yfinance.getQuotes(e.match(/\$([A-Z]+)/)[1], function (err, data) {
            if(err) console.log(err);

            if (data[0]) {
            data = data[0];
                if (data.Name) {
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
                } else {
                    bot.reply(message, "Err: can't find symbol: " + data.symbol)
                }
            }

        });

        })

    }
});
