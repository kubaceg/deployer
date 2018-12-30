const { IncomingWebhook } = require('@slack/client');

module.exports = {
    sendNotification(message, config) {
        var webhook = new IncomingWebhook(config.slackWebhookUrl);

        webhook.send(message, function(err, res) {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Message sent: ', res);
            }
        });
    }
}