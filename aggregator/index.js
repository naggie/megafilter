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

config = require('../config')

// TODO: article validator
// TODO: may have to change to async with callbacks
// TODO: queue/store may have to return pending and article at once
// above is so that redis and sqlite (async) can be implemented

// load chosen actors
queue  = require('./articleQueue')[config.queue](config)
store  = require('./articleStore')[config.store](config)

watcher = require('./rss-watcher')


exports.watchRssFeeds = function(urls) {
	watcher.watchMultiple({
		urls:urls,
		callback:function(article) {
			exports.enqueue(article)
			exports.newArticle(article)
		}
	})
}

exports.newArticle = function(article){}

exports.next    = function() {
	var article = queue.next()
	if (article)
		article.pending = queue.pending()
	return article
}

exports.current = function() {
	var article = queue.current()
	if (article)
		article.pending = queue.pending()
	return article
}

exports.discard = function(id) {
	return !!queue.extract(id)
}

exports.publish = function(id) {
	var article = queue.extract(id)
	if (article)
		return !!store.save(article)
	else
		return false
}

exports.enqueue = queue.enqueue
exports.dump    = store.dump
exports.pending = queue.pending
