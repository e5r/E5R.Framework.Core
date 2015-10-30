// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

/* global process */

var fs = require('fs'),
    path = require('path'),
    cwd = process.cwd();

module.exports = {
    paths: {
        root: cwd,
        doc: path.resolve(cwd, 'doc'),
        src: path.resolve(cwd, 'src'),
        test: path.resolve(cwd, 'test'),
        tools: path.resolve(cwd, 'tools'),
        stage: path.resolve(cwd, 'build'),
        dist: path.resolve(cwd, 'artifacts')
    },
    files: {
        'global': require(path.resolve(cwd, 'global.json')),
        'package': require(path.resolve(cwd, 'package.json')),
        'tsconfig': require(path.resolve(cwd, 'tsconfig.json'))
    }
};
