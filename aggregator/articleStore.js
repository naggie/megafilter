/*
   Copyright 2013 Callan Bryant <callan.bryant@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// actors to store and dump articles for publishing

var fs = require('fs')

exports.json  = function(params) {return new json(params)}
//exports.sqlite = function(params) {return new sqlite(params)}
var json  = function (params) {
	if (typeof params == 'undefined')
		params = {}

	// file to save/load
	var file = params.file || __dirname+'/../starred.json';

	// save interval, default 5mins, in seconds
	var saveInterval = params.saveInterval || 60*5

	// articles saved
	var articles = []

	// change since last write?
	var changed = false

	// load starred items JSON file
	if (fs.existsSync(file))
		articles = JSON.parse( fs.readFileSync(file,{encoding:'utf8'}) )

	// save it every 5 minutes or so IF CHANGED
	setTimeout(function() {
		if (!changed) return;
		changed = false;

		var json = JSON.stringify(articles)
		fs.writeFile(file,json,{encoding:'utf8'},function(err) {
			if (err) console.err(err)
			console.log('Saved '+articles.length+' starred items')
		})
	}, saveInterval*1000)

	// save an article
	this.save = function(article) {
		articles.push(article)
		return changed = true
	}

	// dump n latest articles (0 for all)
	this.dump = function(count) {
		if (count == 0)
			return articles
		else
			return articles.slice(-count)
	}
}
