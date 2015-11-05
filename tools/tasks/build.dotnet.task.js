// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
    config = require('../../config'),
    dotnet = require('gulp-dotnet5'),
    path = require('path');

gulp.task('build.dotnet', function () {
    return gulp.src(path.join(config.paths.src, '**/project.json'))
        .pipe(dotnet.dnu('restore', {
            verbose: true,
            args: [
                '<%= file.path %>',
                '--source', 'https://www.myget.org/F/aspnetvnext/api/v2',
                '--no-cache',
                '--quiet',
                '--parallel',
                '--lock',
                '--ignore-failed-sources'
            ]
        }))
        .pipe(dotnet.dnu('build', {
            verbose: true,
            outPathBase: config.paths.stage,
            args: [
                '<%= file.path %>',
                '--out', '<%= outPath %>',
                '--quiet',
                '--configuration', config.dotnet.configuration
            ]
        }));
});
