// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    config = require('../../config');

gulp.task('configure', function (done) {
    var args = process.argv.slice(2);

    for (var a in args) {
        var match = args[a]
            .toLowerCase()
            .match('^(\-{1,2})([a-z0-9\-]+)$');

        if (match) {
            var toolFileName = 'configure-{tool}.js'.replace('{tool}', match[2]),
                toolPath = path.resolve(config.paths.tools, toolFileName);

            if (fs.existsSync(toolPath)) {
                var tool = require(toolPath);
                tool.configure();
            }
        }
    }
    
    done(null);
});
