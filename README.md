# Valimate

[![Build status](https://api.travis-ci.org/jamesseanwright/valimate.svg)](https://travis-ci.org/jamesseanwright/valimate)

Valimate is a configurable command line interface for validating local and remote websites against the [Nu HTML Checker](https://github.com/validator/validator). It can be easily integrated with continuous integration pipelines and regression test suites.

Requires **Node.js 4 and above**


## Installing

```
npm i -g valimate
```


## Configuration

Valimate is configured on a per-project basis via the [valimate.json](https://github.com/jamesseanwright/valimate/wiki/valimate.json) file. This must reside in the root directory of your project. A simple configuration might look like this:

```
{
	"urls": [
		"http://jamesswright.co.uk/",
		"http://jamesswright.co.uk/about-me",
		"http://jamesswright.co.uk/skills"
	]
}
```

To validate these URLs, run `valimate` in your terminal. Valimate will read the config; each URL is requested via HTTP GET, and the returned markup is sent to the Nu validator.

All of the configuration options are listed on the [valimate.json wiki page](https://github.com/jamesseanwright/valimate/wiki/valimate.json).


## Running against a local app server

In a continuous integration scenario, it could be ideal validate your app server with the latest code changes. If this server is developed in Node.js, then you can use the [Valimate Notifier](https://github.com/jamesseanwright/valimate-notifier) module to defer the execution of tests until the server has started up and is ready to serve HTML.

In the valimate.json file, set the `localAppServer` to point to your server's entry script:

```
{
	"localAppServer": "app.js",

	"urls": [
		"http://localhost:8081/"
	]
}
```

Then use the Valimate Notifier module to notify Valimate when the server is ready to be validated. The module exports a fuction which accepts one argument; a truthy value suggests that start up was successful, whereas a falsy value suggests failure, causing Valimate to exit:

```
'use strict';

const http = require('http');
const notifyValimate = require('valimate-notifier');
const dataService = require('./services/myDataService');
const htmlBuilder = require('./view/htmlBuilder');

const PORT = 8081;

dataService.someAsyncOperation().then(data => {
	http.createServer((req, res) => {
		res.end(htmlBuilder(data), 'utf-8');
	}).listen(PORT, () => {
		notifyValimate(true);
	});
}).catch(e => notifyValimate(false));

```

Upon running the `valimate` CLI, your app server will be started as a child process, and killed when testing is complete.

If your app server has not been started by Valimate (e.g. running in production), then this method will do nothing.


## Contributing

See the [Contributing wiki page](https://github.com/jamesseanwright/valimate/wiki/contributing).