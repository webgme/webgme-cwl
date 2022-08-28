const Http = require('http');
const Express = require('express');
const app = new Express();
const agent = require('superagent');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/check', (req, res) => {
    console.log('lets get physical');
    res.redirect('http://localhost:12345/aad?redirect=http%3A%2F%2Flocalhost%3A8888%2Fchecked');
});

app.get('/auth', (req,res) => {
    console.log('lets check if we are authenticated or not');
    res.redirect('http://localhost:12345/aad/authenticate?redirect=http%3A%2F%2Flocalhost%3A8888%2Fchecked');
});

app.get('/checked', (req, res) => {
    console.log(req.cookies.access_token);
    console.log(req.cookies.webgme_aad);
    console.log('arrived');
    res.sendStatus(200);
});

const httpServer = Http.createServer(app);

httpServer.listen(8888,() => {
    console.log('we are in business!!!');
});