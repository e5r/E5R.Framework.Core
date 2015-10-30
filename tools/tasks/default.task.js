// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    EOL = require('os').EOL,

    config = require('../../config'),
    log = gutil.log,
    log2 = console.log,

    CYAN = gutil.colors.cyan,
    YELLOW = gutil.colors.yellow,
    GREY = gutil.colors.grey;

gulp.task('default', function () {
    log2(EOL);
    log2(YELLOW('Usage: gulp'), CYAN('[tasks]'), EOL);

    log2([
        'Tasks:',
        '  ' + CYAN('build.dotnet') + '          Build .NET components',
        '  ' + CYAN('build') + '                 Build all components',
        '  ' + CYAN('configure') + ' ' + GREY('[tools]') + '     Configure development tools',
        '',
        'Tools:',
        '  ' + GREY('--vscode') + '              Configure Visual Studio Code'
    ].join(EOL), EOL);

    log2(YELLOW('Paths:'), GREY(JSON.stringify(config.paths, null, 4)));
    log2(EOL);
});
