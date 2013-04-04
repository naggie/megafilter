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

var config  = require('./config')
var restify = require('restify')
var xml2js  = require('xml2js')
var fs      = require('fs')

var aggregator = require('./aggregator')


var server = restify.createServer({
	name: 'megafilter',
	//certificate:'string',
	//key:'string',
	version: '0.0.1'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.jsonp());
//server.use(restify.gzipResponse()); // breaks page load

server.get('/next',function(req,res,next) {
	var article = aggregator.next()
	res.send(article?200:404,article)
	return next()
})

server.get('/current',function(req,res,next) {
	var article = aggregator.current()
	res.send(article?200:404,article)
	return next()
})


server.get('/publish/:id',function(req,res,next) {
	var success = aggregator.publish(req.params.id)
	res.send(success?200:404,{success:success})
	return next()
})


server.del('/:id',function(req,res,next) {
	var success = aggregator.discard(req.params.id)
	res.send(success?200:404,{success:success})
	return next()
})

server.get('/articles/:count',function(req,res,next) {
	var articles = aggregator.dump(req.params.count)
	res.send(articles.length?200:404,articles)
	return next()
})

server.get('/pending',function(req,res,next) {
	res.send({
		pending:aggregator.pending()
	})
	return next()
})

// any other request, for static things
server.get(/.*/,restify.serveStatic({
	directory:__dirname+'/public/',
	default:'index.html',
	//maxAge:3600,
	maxAge:0, // disable cache
}))


server.listen(process.env.PORT | 8080, function () {
	console.log('%s listening at %s', server.name, server.url)
})

// MOAR FEEDS!!!!

if (!fs.existsSync(config.subscriptions)) {
	console.log('could not find',config.subscriptions)
	process.exit(2)
}

// load subscriptions file
var parser = new xml2js.Parser();
fs.readFile(config.subscriptions, function(err, data) {
	parser.parseString(data, function (err, result) {
		if (err) {
			console.error(err)
			process.exit(1)
		}

		var feeds = result.opml.body[0].outline
		var urls  = []

		for (var i in feeds)
			urls.push(feeds[i].$.xmlUrl)

		console.log('Watching',urls.length,'feeds')
//FIXME temporary debug LOL
urls = ['https://github.com/blog.atom']

		aggregator.watchRssFeeds(urls)
	})
})


aggregator.newArticle = function(article) {
	console.log('New article:', article.title)
}
