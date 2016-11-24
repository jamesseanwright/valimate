# Valimate

[![Build status](https://api.travis-ci.org/jamesseanwright/valimate.svg)](https://travis-ci.org/jamesseanwright/valimate)

Valimate is a configurable command line interface for validating local and remote websites against the [Nu HTML Checker](https://github.com/validator/validator). It can be easily integrated with continuous integration pipelines and regression test suites.

Requires **Node.js 4 or greater**


## Installing

```
npm i --save-dev valimate
```


## Configuration

Valimate is configured on a per-project basis via the [valimate.json](https://github.com/jamesseanwright/valimate/wiki/valimate.json) file. This must reside in the root directory of your project. A simple configuration might look like this:

```javascript
{
	"urls": [
		"http://jamesswright.co.uk/",
		"http://jamesswright.co.uk/about-me",
		"http://jamesswright.co.uk/skills"
	]
}
```

To validate these URLs, run `./node_modules/.bin/valimate` in your terminal or `valimate` within the context of an npm script. Valimate will read the config; each URL is requested via HTTP GET, and the returned markup is sent to the Nu validator.

All of the configuration options are listed on the [valimate.json wiki page](https://github.com/jamesseanwright/valimate/wiki/valimate.json).


## Running against a local app server

In a continuous integration scenario, it could be ideal validate your app server with the latest code changes. If this server is developed in Node.js, then you can use the [Valimate Notifier](https://github.com/jamesseanwright/valimate-notifier) module to defer the execution of tests until the server has started up and is ready to serve HTML.

In the valimate.json file, set the `localAppServer` to point to your server's entry script. You can also use the `env` property to pass environment variables to the process as key-value pairs:

```javascript
{
	"localAppServer": {
		"entryPoint": "app.js",

		"env": {
			"TEST": "true"
		}
	},

	"urls": [
		"http://localhost:8081/"
	]
}
```

Then use the Valimate Notifier module to notify Valimate when the server is ready to be validated. The module exports a fuction which accepts one argument; a truthy value suggests that start up was successful, whereas a falsy value suggests failure, causing Valimate to exit:

```javascript
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


## Programmatic Use

Valimate can also be imported into your Node.js scripts as a CommonJS module. It exposes the `validate` method, which takes the config as a parameter of the `Object` type. This returns a `Promise` which resolves once the URLs have been validated. A `Boolean` is passed through the chain that will be `true` if the markup is invalid, or `false` if it is valid.

```javascript
'use strict';

const valimate = require('valimate');

const config = {
	urls: [
		'http://jamesswright.co.uk/',
		'http://jamesswright.co.uk/about-me',
		'http://jamesswright.co.uk/skills'
	]
};

valimate.validate(config)
	.then(isInvalid => {
		process.exit(isInvalid ? 1 : 0);
	});
```

Using Valimate programmatically will still print results as if the library had been invoked via the CLI; this capability is simply a means of convenience; this can be useful when there are many asynchronous prerequisites involved. In the next major release, however, this _may_ directly expose validation results.


## Contributing

See the [Contributing wiki page](https://github.com/jamesseanwright/valimate/wiki/contributing).
