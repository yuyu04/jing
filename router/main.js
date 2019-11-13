module.exports = function(app)
{
    // Web push
    const webpush = require('web-push');

    // VAPID keys should only be generated only once.
    const vapidKeys = webpush.generateVAPIDKeys();

    const publicKey = 'BEdMy4CXnj2VLTCrKKBPZfgIaURGcfmOPsjh1BBDnv-72Uj9WsSnbU8ce-vogrJwKxpiedEiYjrrkTjaHjHQa-A';
    const privateKey = 'VpSgjyWs6Q27voDmefD4xZJYdYjyloubHiaFERJUv44';

    webpush.setGCMAPIKey('AAAASh6YDxE:APA91bEwr2UlW981dPTMQXSUvzQXh1yiklqFFCTmi0BlH0ue9aILC4NHjmpaUlQ-ZjFfH9hVoi0Ung6_GM6ZqioMidNzFju_chCrx6E8LgCBTlJk-tyMNssJJow1NR7Jooc4bu1J56_h');
    webpush.setVapidDetails(
        'mailto:yuyu04@inka.co.kr',
        publicKey,
        privateKey
    );
    console.log("server start", vapidKeys.publicKey);
    console.log("server start2", vapidKeys.privateKey);
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://yuyu04:85tmffkdla@cluster0-ycxrb.mongodb.net/test?retryWrites=true&w=majority";

    let countId = 0;

    app.get('/',function(req,res){
        res.render('index.html')
    });

    app.get('/get-db', function(req, res) {
        let responseData = null;
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            if (err) {
                console.error('MongoDB 연결 실패', err);
                res.status(500).send(err);
                return;
            }

            const collection = client.db("jingDb").collection("customers");
            // perform actions on the collection object

            collection.find().toArray(function (err, docs) {
                client.close();
                if (err) {
                    console.error('find err', err);
                    res.status(500).send(err);
                    return;
                }
                res.send(docs);
            });
        });
    });

    app.post('/remove-all', function(req, res) {
        const isRemove = req.body.isRemove;
        if (isRemove == null) {
            res.status(500).send('dont remove item');
        }

        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            console.log("connection");
            if (err) {
                console.error('MongoDB 연결 실패', err);
                res.status(500).send(err);
                return;
            }

            const collection = client.db("jingDb").collection("customers");

            collection.removeMany({});
            client.close();
        });
    });

    app.post('/push-send', function(req, res) {
        const id = Number(req.body.id);
        if (id == null) {
            res.status(500).send('id is Null');
        }

        const data = req.body.data;
        const options = {
            TTL: 24 * 60 * 60,
            vapidDetails: {
                subject: 'mailto:yuyu04@inka.co.kr',
                publicKey: publicKey,
                privateKey: privateKey
            }
        };
        console.log(id, data);

        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            console.log("connection");
            if (err) {
                console.error('MongoDB 연결 실패', err);
                res.status(500).send(err);
                return;
            }

            const collection = client.db("jingDb").collection("customers");

            collection.findOne({ ID: id })
                .then(function(result) {
                    let subscription = JSON.parse(result.subscription);
                    console.log(subscription);
                    webpush.sendNotification(subscription, data, options).catch(error => {
                        console.log(error);
                    });
                    client.close();
                })
                .catch(function(error) {
                    console.log(error);
                    client.close();
                });
        });

        res.send('POST request to the homepage');
    });

    app.post('/save-subs', function(request, reply) {
        const subscription = request.body.subscription;
        if (subscription == null) {
            reply.status(500).send('subscription is Null');
        }

        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            if (err) {
                console.error('MongoDB 연결 실패', err);
                reply.status(500).send(err);
                return;
            }

            const collection = client.db("jingDb").collection("customers");
            // perform actions on the collection object

            collection.insertOne({ID: countId, subscription: subscription});
            countId += 1;
            client.close();
        });

        reply.send('POST request to the homepage');
        //return reply({statusCode:200, data : "OK"}).code(200);
    });
}