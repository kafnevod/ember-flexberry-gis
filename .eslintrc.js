module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
		 "L": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
		"sourceType": "module"
    },
    "rules": {
    }
};