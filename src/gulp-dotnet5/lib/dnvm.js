// Copyright (c) E5R Development Team. All rights reserved.
// Licensed under the Apache License, Version 2.0. More license information in LICENSE.md.

var commons = require('./commons'),
	
	PLUGIN_NAME = commons.PLUGIN_NAME,
	pluginError = commons.pluginError;
	
/**
 * Microsoft .NET Version Manager Gulp Plugin
 * 
 * @param action DNVM command
 * @param options DNVM options
 */
function Plugin(action, options) {
	throw pluginError('DNVM tool not implemented!');
}

module.exports = Plugin;
