config = require('./config')

queue  = require('./articleQueue')[config.queue]
store  = require('./articleStorage')[config.store]


// TODO: return pending count somehow (maybe attach to article)

// TODO: 404
exports.current = function() {
	return {
		pending: queue.pending(),
		article: queue.next()
	}
}

exports.next    = function() {
	return {
		pending: queue.pending(),
		article: queue.current()
	}
}
exports.dump    = store.dump

// TODO: 404
exports.discard = function(id) {
	return !!queue.extract(id)
}


// TODO: 404
exports.publish = function(id) {
	var article = queue.extract(id)
	if (article)
		return !!store.save(article)
	else
		return false
}
