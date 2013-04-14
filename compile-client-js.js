#!/usr/bin/env node

uglifyjs = require('uglify-js')
fs = require('fs')

var result = uglifyjs.minify([
	__dirname+"/public/jquery-1.9.1.js",
	__dirname+"/public/hotkeys/jquery.hotkeys.js",
	__dirname+"/public/client.js"
])

fs.writeFileSync(
			__dirname+"/public/build.js",
			result.code,
			{
				encoding:'utf8'
			}
)

