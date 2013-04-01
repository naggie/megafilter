config = require('../config')

// TODO: article validator

// load chosen actors
queue  = new require('./articleQueue')[config.queue](config)
store  = new require('./articleStore')[config.store](config)


// TODO: return pending count somehow (maybe attach to article)

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
