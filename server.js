var express = require('express'),
    app = express(),
    session = require('express-session');
    app.use(session({
    secret: 'secretsession',
    resave: true,
    saveUninitialized: true
    }));
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use ( bodyParser.json() );
app.use ( bodyParser.urlencoded({ extended: true}) );
var u = require('./users');
var fs = require('fs');
app.set('view engine', 'jade');
var auth = function(req, res, next) {
    if (req.session.auth)
        return next();
    else
        console.log("not auth")
        res.redirect('/users/login');
};
var logOut = function(x){

    return '<a href="/logout">' + x + '</a>';
};
app.get('/', function (req, res) {
    res.redirect('/users');
});
app.get('/users', function(req, res){
    // var users = fs.readFile('./users.json', function (err, data) {
    //     if (err) throw err;
    //     obj = JSON.parse(data);
    //     console.log(obj);
    // });
    console.log(u);
    res.render('index', { title: 'List of Users', usersList: u });
});
app.get('/users/login', function (req, res) {
    res.render('login', { title: 'Login' });
});

app.post('/users/login/process', function (req, res) {
    if (req.body.login in u){
        if (u[req.body.login] === req.body.pass){
            req.session.auth = true;
            req.session.login = req.body.login;
            console.log("login success!");
            res.redirect('/users/profile');
        }else{
            console.log("wrong password");
            res.redirect('/users/login');
        }
    }else{
        console.log("wrong username");
        res.redirect('/users/login');
    }
});
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/users/login');
});

app.get('/users/profile', auth, function (req, res) {
    console.log('Private area');
    res.send('<h1>Welcome to your profile, ' + req.session.login + '</h1>' + logOut('Log out now'));
});
app.use(function(req, res, next){
    if (req.session.auth)
        next();
    else
        res.redirect('/users/login');
    return res.status(404).send('<h2>Not found</h2>');
});


app.listen(3000);
console.log("app running at http://localhost:3000");