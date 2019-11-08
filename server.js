var express = require('express');
var app = express();
var router = require('./router/main')(app);

app.set('views', __dirname + '/www');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(express.static('files'));

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
});