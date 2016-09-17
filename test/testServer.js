'use strict';

const http = require('http');
const notifyValimate = require('valimate-notifier');

const PORT = 8081;

const HTML = `
	<!DOCTYPE html>
	<html>
		<head>
			<title>Valimate Test Server</title>
		</head>
		<body>
			<section role="main">
				<h1>Valimate Test Server</h1>
				<p>This is some valid, dummy HTML</p>
			</section>
		</body>
	</html>
`;

function sendHtml(res) {
	res.end(HTML, 'utf-8');
}

function redirect(res, statusCode) {
	res.writeHead(statusCode, {
		Location: '/'
	});

	res.end();
}

http.createServer((req, res) => {
	switch (req.url) {
		case '/301-redirect':
			redirect(res, 301);
			break;

		case '/302-redirect':
			redirect(res, 302);
			break;

		default:
			sendHtml(res);
	}

}).listen(PORT, () => {
	console.log(`Test server listening on ${PORT}...`);
	notifyValimate(true);
});