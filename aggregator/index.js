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
	return {
		pending: queue.pending(),
		article: queue.next()
	}
}

exports.current = function() {
	return {
		pending: queue.pending(),
		article: queue.current()
	}
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
