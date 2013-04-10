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


// article (circular) queue actors.
var crypto = require('crypto')

exports.internal = function(params) {return new internal(params)}
exports.redis    = function(params) {return new redis(params)}

// native, non-persistent, may be slow compared to redis
// relies on garbage collector, don't overuse
var internal = function (params) {
	if (typeof params == 'undefined')
		params = {}

	// max number or articles in this queue
	var max = params.max || 999;

	// current array index of article
	var index = 0;

	// array of articles
	var articles = []

	// add an Article to the queue, creating id: as hash if not there
	this.enqueue = function(article) {
		// stop next() from returning a dupe
		// index must correspond to the same article
		if (articles.length)
			index++

		if (!article.id)
			article.id = articleHash(article)

		// check is unique
		for (var i in articles)
			if (articles[i].id == article.id)
				return false

		// add new article to start of array
		articles.unshift(article)

		if (articles.length > max)
			articles.pop()

		return true
	}

	// return an article from the (circular) queue
	// undefined if no items
	this.next = function() {
		if (articles[++index])
			return articles[index]
		else
			return articles[index = 0]
	}

	// return the current article without advancing the index
	this.current = function() {
		return articles[index]
	}

	// remove an article from the queue, preserving the order
	this.extract = function(id){
		// look for the article index, given the ID
		// 'i' is set to invalid index if not found
		for (var i=0; i <= articles.length; i++)
			if (i==articles.length  || articles[i].id == id)
				break;

		// repair index if affected
		if (i < index)
			index--

		// remove the article, returning if exists
		return articles.splice(i,1)[0]
	}

	// number of articles in queue
	this.pending = function(){
		return articles.length
	}
}

// returns hex. hash of article
function articleHash(article) {
	var hash = crypto.createHash('md5')
	hash.update(article.title+article.guid+article.link)
	return hash.digest('hex')
}

