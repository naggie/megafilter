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


// must accept config somehow else FIXME
config = require('../config')

// TODO: article validator
// TODO: may have to change to async with callbacks (store only)
// so that redis and sqlite (async) can be implemented

// load chosen actors
queue  = require('./articleQueue').internal(config)
store  = require('./articleStore')[config.store.actor](config.store)

exports.importer = require('./importer')
exports.importer.store = store // hack: FIXME


watcher = require('./rss-watcher')


exports.watchRssFeeds = function(urls) {
	urls.forEach(function(url){
		watcher.watch({
			url:url,
			callback:function(article) {
				exports.enqueue(article)
				exports.hooks.enqueue(article)
			},
			since: config.since
		})
	})
}

exports.hooks = {}
exports.hooks.enqueue = function(article){}
exports.hooks.publish = function(article){}

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
	return queue.discard(id)
}

exports.publish = function(id) {
	var article = queue.get(id)
	if (article) {
		exports.hooks.publish(article)
		return !!store.insert(article)
	} else
		return false
}

exports.enqueue   = queue.enqueue
exports.dump      = store.dump
exports.pending   = queue.pending
exports.unpublish = store.discard
exports.store     = store
exports.queue     = queue
exports.articleHash = require('./articleQueue').articleHash
