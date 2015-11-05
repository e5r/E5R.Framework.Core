// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
    config = require('../../config'),
    dotnet = require('gulp-dotnet5'),
    path = require('path');

function task() {
    return gulp.src(path.join(config.paths.src, '**/project.json'))
        .pipe(dotnet.dnu('restore', {
            verbose: false,
            args: [
                '<%= file.path %>',
                '--quiet'
            ]
        }))
        .pipe(dotnet.dnu('build', {
            verbose: false,
            outPathBase: config.paths.stage,
            outPathSufix: 'bin', // TODO: Implements on "gulp-dotnet5" component
            args: [
                '<%= file.path %>',
                '--out', '<%= outPath %>',
                '--quiet',
                '--configuration', config.dotnet.configuration
            ]
        }));
}

task.doc = {
    text: 'Build .NET components'
};

gulp.task('build.dotnet', task);
