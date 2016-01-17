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

http.createServer((req, res) => {
	res.end(HTML, 'utf-8');
}).listen(PORT, () => {
	notifyValimate(true);
});