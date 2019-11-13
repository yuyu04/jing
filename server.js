var express = require('express');
var fs = require('fs');
var https = require('https');

var privateKey = fs.readFileSync('ssl/private.key', 'utf8');
var certificate = fs.readFileSync('ssl/private.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

var router = require('./router/main')(app);

app.set('views', __dirname + '/www');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('www'));
//app.use('/', router);

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8080, '172.31.38.77');

// var server = app.listen(3000, function() {
//     console.log("Express server has started on port 3000")
// });


