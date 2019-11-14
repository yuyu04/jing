var createServer = require("auto-sni");
var express = require('express');
var fs = require('fs');
var http = require('http');
var cookieParser = require('cookie-parser');
//var https = require('https');

// var privateKey = fs.readFileSync('ssl/private.key', 'utf8');
// var certificate = fs.readFileSync('ssl/private.pem', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

var router = require('./router/main')(app);

app.set('views', __dirname + '/www');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('www'));

app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
      message: err.message,
      error: {}
   });
});

var httpServer = http.createServer(app);
httpServer.listen(80, '3.19.204.190');

createServer({ email: 'yuyu04@naver.com', domains: ['jing-jing.cf', 'www.jing-jing.cf'], agreeTos: true, ports: {https: 443} }, app);
// var httpsServer = https.createServer(credentials, app);

// httpsServer.listen(8080, '172.31.38.77');

// var server = app.listen(3000, function() {
//     console.log("Express server has started on port 3000")
// });


