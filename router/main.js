module.exports = function(app)
{
    // Web push
    const webpush = require('web-push');
// VAPID keys should only be generated only once.
    const vapidKeys = webpush.generateVAPIDKeys();

    webpush.setGCMAPIKey('AAAASh6YDxE:APA91bEwr2UlW981dPTMQXSUvzQXh1yiklqFFCTmi0BlH0ue9aILC4NHjmpaUlQ-ZjFfH9hVoi0Ung6_GM6ZqioMidNzFju_chCrx6E8LgCBTlJk-tyMNssJJow1NR7Jooc4bu1J56_h');
    webpush.setVapidDetails(
        'mailto:your E-Mail',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );

    app.get('/',function(req,res){
        res.render('index.html')
    });

    app.post('/push-send', function(request, reply) {
        const subscription = JSON.parse(request.payload.subscription);
        const data = request.payload.data;
        const options = {
            TTL: 24 * 60 * 60,
            vapidDetails: {
                subject: 'mailto: UR E-mail',
                publicKey: vapidKeys.publicKey,
                privateKey: vapidKeys.privateKey
            }
        };
        webpush.sendNotification( subscription, data, options );
        return reply({statusCode:200, data : "OK"}).code(200);
    });
}