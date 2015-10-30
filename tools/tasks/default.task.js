// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    config = require('../../config'),
    
    log = console.log,

    EOL = require('os').EOL,
    CYAN = gutil.colors.cyan,
    YELLOW = gutil.colors.yellow,
    GREY = gutil.colors.grey;

gulp.task('default', function () {
    log(EOL);
    log(YELLOW('Usage: gulp'), CYAN('[tasks]'), EOL);

    log([
        'Tasks:',
        '  ' + CYAN('build.dotnet') + '          Build .NET components',
        '  ' + CYAN('build') + '                 Build all components',
        '  ' + CYAN('configure') + ' ' + GREY('[tools]') + '     Configure development tools',
        '',
        'Tools:',
        '  ' + GREY('--vscode') + '              Configure Visual Studio Code'
    ].join(EOL), EOL);

    log(YELLOW('Paths:'), GREY(JSON.stringify(config.paths, null, 4)));
    log(EOL);
});
