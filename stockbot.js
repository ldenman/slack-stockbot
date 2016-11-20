var Botkit = require('botkit');


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

var yahooFinance = require('yahoo-finance');

controller.hears(['\\$(.*)'], ['ambient'], function(bot,message) {
    const  { user, channel, text } = message;
    const userData = text.match(/\$([A-Z]+)/)
    if ( userData ) {
        yahooFinance.snapshot({
            symbol: userData[1],
            fields: ['s', 'n', 'l1'],
        }, function (err, snapshot) {
            if (snapshot) {
                if (snapshot.name && snapshot.lastTradePriceOnly) {
                    bot.reply(message, "" + snapshot.name + " ("+snapshot.symbol+")"+" - $" + snapshot.lastTradePriceOnly );
                }
            }
        });
    }
});
