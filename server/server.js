const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
	return res.send('pong');
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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

app.listen(process.env.PORT || 8080);

console.log('server running on', 8080);