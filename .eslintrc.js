module.exports = {
	"globals": {
		"expect": true,
		"sinon": true,
		"describe": true,
		"it": true,
		"beforeEach": true,
		"afterEach": true
	},

	"env": {
		"es6": true,
		"node": true
	},

	"extends": "eslint:recommended",

	"rules": {
		"no-console": "off",
		"no-var": "error",
	}
};
