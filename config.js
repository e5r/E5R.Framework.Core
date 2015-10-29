// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var fs = require('fs'),
    path = require('path');

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
        'global': require(path.resolve('./global.json')),
        'package': require(path.resolve('./package.json')),
        'tsconfig': require(path.resolve('./tsconfig.json'))
    }
};
