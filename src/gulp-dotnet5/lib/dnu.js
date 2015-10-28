// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.md.

var $ = require('lodash'),
	through = require('through2'),
    exec = require('child_process').exec,
	path = require('path'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	gshell = require('gulp-shell'),
	commons = require('./commons'),

	PLUGIN_NAME = commons.PLUGIN_NAME,
	pluginError = commons.pluginError,
	log = commons.log,

	DNU_COMMANDS_RENAME = {
		'build': 'Buiding',
		'install': 'Installing',
		'list': 'Listing',
		'pack': 'Packing',
		'publish': 'Publishing',
		'restore': 'Restoring'
	};

/**
 * Microsoft .NET Development Utility Gulp Plugin
 *
 * @param action DNU command
 * @param options DNU options
 */
function Plugin(action, options) {
	if(!action) {
		throw pluginError('Please specify the DNU action');
	}

	var stream = through.obj(function(file, enc, done) {

		options = $.merge({
			env: process.env,
			cwd: process.cwd(),
			verbose: false,
			outPathBase: path.resolve(path.parse(file.path).dir, 'bin', 'artifacts'),
			args: []
		}, options);

		log(gutil.colors.grey(DNU_COMMANDS_RENAME[action.toLowerCase()] || '<DNU '.concat(action.toUpperCase(), '> for')),
			gutil.colors.grey('\'' + gutil.colors.yellow(path.dirname(file.relative)) + '\'...'));

		var self = this,
			command = ['dnu', action]
				.concat(commons.normalizeArgs(options.args, {
					file: file,
					outPath: path.resolve(options.outPathBase, path.dirname(file.relative))
				}))
				.join(' '),
			cmdOptions = {
				env: options.env,
				cwd: options.cwd,
				maxBuffer: 1024 * 1024 * 5, // 5KB
			},
			
			child = exec(command, cmdOptions, function(error, stdout, stderr) {
				if (error) {
					self.emit('error', {
						file: file.path,
						message: error.message,
						errorOutput: stderr.toString()
					});
				}
				done(null, file);
			});

		if(options.verbose) {
			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);
		}
	});

	stream.on('error', function(error){
		log(gutil.colors.bgRed('DNU failed:'), error.file || '');
		if (error.message) {
			log(gutil.colors.red(error.message));
		} else {
			log(gutil.colors.red(JSON.stringify(error)));
		}
		if(options.verbose && error.errorOutput){
			log(gutil.colors.bgYellow('DNU failed output:'))
			log(gutil.colors.yellow(error.errorOutput));
		}
	});

	stream.resume();

	return stream;
}

module.exports = Plugin;
