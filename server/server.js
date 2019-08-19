const fs = require('fs');
const path = require('path');
const https = require('https');
const proxy = require('http-proxy-middleware');
const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const bodyParser = require('body-parser');
const webpackConfig = require('../webpack.config');

const HTTPS_PORT = 4000;
const BACKEND = 'https://selite:10060';

const compiler = webpack(webpackConfig);
const backend = BACKEND;
const port = HTTPS_PORT;
const app = express();

app.use([
	'/auth/xy',
	'/api/v2/**',
	'/lite/application.json',
	'/portal/application.json',
	'/event-stream',
	'/event-heartbeat',
	'/event-subscribers/**'
], proxy({
	target: backend,
	https: true,
	secure: false
}));

app.use(middleware(compiler));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	next();
});

app.use(bodyParser.json());

app.get('/api/universes', function (req, res) {
	res.sendFile(path.join(__dirname, 'data', 'data.universes.json'));
});

app.get('/api/worlds', function (req, res) {
	res.sendFile(path.join(__dirname, 'data', 'data.worlds.json'));
});

app.get('/api/referencelayers', function (req, res) {
	res.sendFile(path.join(__dirname, 'data', 'data.styles.json'));
});

app.get('/api/bookmarks', function (req, res) {
	res.sendFile(path.join(__dirname, 'data', 'data.bookmarks.json'));
});

app.get('/api/languages', function (req, res) {
	res.sendFile(path.join(__dirname, 'data', 'data.languages.json'));
});

const httpsServer = https.createServer(
	{
		key: fs.readFileSync(path.resolve(__dirname, './localhost+2-key.pem')),
		cert: fs.readFileSync(path.resolve(__dirname, './localhost+2.pem'))
	},
	app
);

httpsServer.listen(port, () => {
	console.log(`HTTPS Server running on port ${ port }`);
});
