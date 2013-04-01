config = require('../config')

// TODO: article validator
// TODO: may have to change to async with callbacks
// TODO: queue/store may have to return pending and article at once
// above is so that redis and sqlite (async) can be implemented

// load chosen actors
queue  = new require('./articleQueue')[config.queue](config)
store  = new require('./articleStore')[config.store](config)


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
exports.dump    = store.dump

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
