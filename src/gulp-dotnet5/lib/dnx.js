// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.md.

var commons = require('./commons'),
	
	PLUGIN_NAME = commons.PLUGIN_NAME,
	pluginError = commons.pluginError;
	
/**
 * Microsoft .NET Execution Environment Gulp Plugin
 * 
 * @param action DNX command
 * @param options DNX options
 */
function Plugin(action, options) {
	throw pluginError('DNX tool not implemented!');
}

module.exports = Plugin;
