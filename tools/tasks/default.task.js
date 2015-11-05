// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var $ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    config = require('../../config'),
    
    log = console.log,
    
    TASK_NAME = 'default',
    EOL = require('os').EOL,
    CYAN = gutil.colors.cyan,
    YELLOW = gutil.colors.yellow,
    GREY = gutil.colors.grey;

/**
 * Make up a param text of task documentation.
 */
function paramsText(param) {
    var text = '';

    if (typeof (param) !== 'object') {
        return text;
    }

    for (var p in param) {
        if (p !== 'text') {
            if (text.length > 0) {
                text = text.concat(' ');
            }
            text = text.concat('[' + p + ']');
        }
    }

    return text.toLowerCase();
}

/**
 * Make a text with fixed length. Complete text with blank char.
 */
function fixed(str, len) {
    if (str.length > len) {
        return str.substr(0, len);
    }
    var blanks = Array(len + 1).join(' ');
    return str.concat(blanks.substring(str.length));
}

/**
 * The default task
 */
function task() {
    log(EOL);
    log(YELLOW('Usage: make'), CYAN('[tasks]'), EOL);

    var more = {},
        count = 0;
    
    // Show tasks
    log('Tasks:');
    for (var t in gulp.tasks) {
        var task = gulp.tasks[t];
        if (task.name !== 'default') {
            var doc = task.fn.doc || {};

            log('  ' + CYAN(fixed(task.name, 15)),
                GREY(fixed(paramsText(doc), 15)) +
                doc.text || 'Start [' + task.name + '] task');
            
            // More options...
            for (var n in doc) {
                if (n !== 'text' && !more[n]) {
                    more[n] = {};
                }
                if (n !== 'text') {
                    more[n] = $.merge(more[n], doc[n]);
                }
            }
            count++;
        }
    }
    if(1 > count){
        log('  ' + CYAN(fixed('<empty>', 30)), 'No tasks detected.');
    }
    log();
    
    // Show more options for task
    for(var m in more){
        var option = more[m];
        log(m + ':');
        for(var o in option){
            log('  ' + GREY(fixed(o, 30)), option[o]);
        }
        log();
    }
    
    log(YELLOW('Paths:'), GREY(JSON.stringify(config.paths, null, 2)));
    log(EOL);
}

gulp.task(TASK_NAME, task);
