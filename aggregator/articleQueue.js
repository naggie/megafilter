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
	var max = params.max | 999;

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

		// add new article to start of array
		articles.unshift(article)

		if (articles.length > max)
			articles.pop()
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
		return articles.splice(i)[0]
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

