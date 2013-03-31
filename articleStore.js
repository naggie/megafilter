// actors to store and dump articles for publishing

exports.json  = function(params) {return new json(params)}
//exports.sqlite = function(params) {return new sqlite(params)}
var json  = function (params) {
	if (typeof params == 'undefined')
		params = {}

	// file to save/load
	var file = params.file | __dirname+'/starred.json';

	// save interval, default 5mins, in seconds
	var saveInterval = params.saveInterval | 60*5

	// articles saved
	var articles = []

	// load or create starred items JSON file

	// save it every 5 minutes or so IF CHANGED
	setTimeout(function(){
	
	}, saveInterval*1000)

	// save an article
	this.save(article) {
		articles.push(article)
	}

	// dump n latest articles (0 for all)
	this.dump = function(count) {
		if (count == 0)
			return articles
		else
			return articles.slice(-count)
	}
}
