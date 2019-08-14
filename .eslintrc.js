module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
		 "L": true,
		 "leafletLayer": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
		"sourceType": "module"
    },
    "rules": {
		  "no-console": "off",
		"no-unused-vars": 0
    }
};