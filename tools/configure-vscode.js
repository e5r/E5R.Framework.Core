// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gutil = require('gulp-util'),
    config = require('../config'),
    fs = require('fs'),
    path = require('path'),

    YELLOW = gutil.colors.yellow,
    RED = gutil.colors.red,
    GREEN = gutil.colors.green;

function ConfigureVSCode(cwd) {
    gutil.log(YELLOW('Configuring Visual Studio Code...'));

    var pathFrom = path.resolve(config.paths.tools, 'vscode-settings.json'),
        pathTo = path.resolve(config.paths.root, '.vscode', 'settings.json');

    if (!fs.existsSync(pathTo)) {
        if (!fs.existsSync(path.resolve('.vscode'))) {
            fs.mkdir(path.resolve('.vscode'));
        }
        fs.writeFileSync(pathTo, fs.readFileSync(pathFrom));
    }

    if (require(pathTo)) {
        gutil.log(GREEN('Visual Studio Code sucessfuly configured!'))
    } else {
        gutil.log(RED('Error on configure Visual Studio Code.'));
    }
}

module.exports = {
    configure: ConfigureVSCode
};