// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	
	config = require('../../config'),
	log = gutil.log;

var build = [
	'build.dotnet'
];

gulp.task('default', [].concat(build), function() {
	log('Running default gulp task...');
	log(config.files.package.name, 'v' + config.files.package.version);
});
