const fs = require('fs');
const express = require('express');
const proxy = require('express-http-proxy');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const selection = require('./selection');

const app = express();

const xy = proxy('selite:10060', {
	https: true,
	secure: false,
	proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
		proxyReqOpts.rejectUnauthorized = false;
		return proxyReqOpts;
	}
});

app.use(bodyParser.json());

app.get('/lite/application.json', xy);

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

app.get('/api/selection/:lngLat', selection.onGet);

app.post('/api/v2/applications/:appId/projects/:projectId/maps/:mapId/selection', selection.onPost);


const httpsServer = https.createServer(
	{
		key: fs.readFileSync('./localhost+2-key.pem'),
		cert: fs.readFileSync('./localhost+2.pem')
	},
	app
);

httpsServer.listen(8080, () => {
	console.log(`HTTPS Server running on port ${8080}`);
});