#!/usr/bin/env node

uglifyjs = require('uglify-js')
fs = require('fs')


console.log('Compiling megafilter client...')


var result = uglifyjs.minify([
	__dirname+"/public/jquery-1.9.1.js",
	__dirname+"/public/jquery.hotkeys.js",
	__dirname+"/public/client.js"
])

fs.writeFileSync(
			__dirname+"/public/build.js",
			result.code,
			{
				encoding:'utf8'
			}
)

