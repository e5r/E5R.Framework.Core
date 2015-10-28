// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.md.

var gutil = require('gulp-util');

var lib = {
	PLUGIN_NAME: 'gulp-dotnet5',

	/**
	* Generate a new PluginError.
	* 
	* @param message A message of error
	* @return new instance of gutil.PluginError
	*/
	pluginError: function(message) {
		return new gutil.PluginError({
			plugin: lib.PLUGIN_NAME,
			message: message
		});
	},
	
	/**
	 * Normalize args list to use in shell
	 * 
	 * @param args A array of arguments
	 * @param context A object context to use [gulp-util].template
	 */
	normalizeArgs: function(args, context) {
		if(!Array.isArray(args)) {
			throw lib.pluginError('Args is not a Array');
		}
		
		for(var a in args) {
			var arg = context
				? gutil.template(args[a].toString(), context)
				: args[a].toString();
			
			if (arg.indexOf(' ') > -1 || arg.indexOf('"') > -1) {
				args[a] = '"'
					.concat(arg.replace('"', '""'))
					.concat('"');
			} else {
				args[a] = arg;
			}
		}
		
		return args;
	},
	
	/**
	 * Abstraction to [gulp-util].log
	 */
	log: gutil.log
};

module.exports = lib;