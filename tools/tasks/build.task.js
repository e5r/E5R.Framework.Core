// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
    gutil = require('gulp-util'),

    config = require('../../config'),
    log = gutil.log,
    
    GREEN = gutil.colors.green,
    
    build = [
        'build.dotnet'
    ];

function task() {
    var name = config.files.package.name,
        version = 'v' + config.files.package.version;
    log('All build finished for', '\'' + GREEN(name, version) + '\'');
}

task.doc = {
    text: 'Build all components'
};

gulp.task('build', build, task);