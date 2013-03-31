crypto = require('crypto')

exports.js    = function(params) {return new js(params)}
exports.redis = function(params) {return new redis(params)}
var js  = function (params) {
	// max number or articles in this queue
	max = 999;

	// current array index of article
	var index = 0;

	// array of articles
	var articles = []

	// add an Article to the queue, creating id: as hash if not there
	this.enqueue = function(article) {
		if (!article.id)
			article.id = articleHash(article)

		// add new article to start of array
		articles.unshift(article)

		if (articles.length > max)
			articles.pop()

		// stop next() from returning a dupe
		index++
	}

	// return an article from the (circular) queue
	this.next = function() {
		if (articles[index])
			return articles[index++]
		else
			return articles[index = 0]
	}

	// remove an article from the queue, preserving the order
	this.extract = function(id){
		// look for the article index, given the ID
		// 'i' is set to invalid index if not found
		for (var i=0; i <= article.length; i++)
			if (article[i].id == id)
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
	};
}

// returns hex. hash of article
function articleHash(article) {
	var hash = crypto.createHash('md5')
	hash.update(article.content)
	return hash.digest('hex')
}

