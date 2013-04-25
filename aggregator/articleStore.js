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
// must implement at least insert, dump, discard and save

var fs = require('fs')
exports.json  = function(params) {return new json(params)}
//exports.sqlite = function(params) {return new sqlite(params)}
var json  = function (params) {
	if (typeof params == 'undefined')
		params = {}

	// file to save/load
	var file = params.file || __dirname+'/../published.json';

	// articles saved
	var articles = []

	// load starred items JSON file
	if (fs.existsSync(file))
		articles = JSON.parse( fs.readFileSync(file,{encoding:'utf8'}) )

	// timeout to save (reset on insert)
	// deferred save
	var saveTimeout

	// save an article, in order based on pubdate
	this.insert = function(article) {
		// must have ID, pubdate
		if (!article.id || !article.pubdate)
			return false

		var pubdate = new Date(article.pubdate)

		// check is unique
		for (var i in articles)
			if (articles[i].id == article.id)
				return false

		// insert it into the correct place (articles are already sorted from new to old)
		for (var i in articles)
			if ( pubdate > (new Date(articles[i].pubdate)) ) {
				// article is newer than this position
				articles.splice(i,0,article)
				break
			}

		// perhaps it's older than all the articles, if so, put it in the end
		if (pubdate < (new Date(articles[articles.length-1].pubdate)))
			articles.push(article)

		// schedule a save, possibly cancelling previously scheduled one
		// this way if save is hammered during import, they don't queue up.
		clearTimeout(saveTimeout)
		saveTimeout = setTimeout(this.save,2000)

		return true
	}

	// dump n latest articles (0 for all)
	this.dump = function(count) {
		if (count <= 0)
			return articles
		else
			return articles.slice(0,count)
	}

	this.discard = function(id) {
		for (var i in articles)
			if (articles[i].id == id)
				return !!articles.splice(i,1)[0]

		return false
	}

	// write to disk
	this.save = function(callback) {
		if (!arguments[0]) callback = function(){}

		var json = JSON.stringify(articles)
		fs.writeFile(file,json,{encoding:'utf8'},function(err) {
			if (err) console.err(err)
			console.log('Saved '+articles.length+' published items')
			callback()
		})
	}
}
