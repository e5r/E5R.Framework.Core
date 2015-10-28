// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.md.

var fs = require('fs'),
	path = require('path');

function readJSONFile(filePath) {
	return JSON.parse(fs.readFileSync(filePath));
}

module.exports = {
	paths: {
		doc: path.resolve('./doc'),
		src: path.resolve('./src'),
		test: path.resolve('./test'),
		tools: path.resolve('./tools'),
		stage: path.resolve('./build'),
		dist: path.resolve('./artifacts')
	},
	files: {
		'global': readJSONFile(path.resolve('./global.json')),
		'package': readJSONFile(path.resolve('./package.json')),
		'tsconfig': readJSONFile(path.resolve('./tsconfig.json'))
	}
};
