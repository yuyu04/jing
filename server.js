var createServer = require("auto-sni");
var express = require('express');
var fs = require('fs');
var http = require('http');
//var https = require('https');

// var privateKey = fs.readFileSync('ssl/private.key', 'utf8');
// var certificate = fs.readFileSync('ssl/private.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

var router = require('./router/main')(app);

app.set('views', __dirname + '/www');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('www'));
//app.use('/', router);

var httpServer = http.createServer(app);
createServer({ email: 'yuyu04@naver.com', domains: ['jing-jing.cf', 'www.jing-jing.cf'], agreeTos: true, ports: {https: 443} }, app);
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(80, '172.31.38.77');
// httpsServer.listen(8080, '172.31.38.77');

// var server = app.listen(3000, function() {
//     console.log("Express server has started on port 3000")
// });


