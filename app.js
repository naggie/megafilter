var config  = require('./config')
var restify = require('restify')
var xml2js  = require('xml2js')
var fs      = require('fs')

var aggregator = require('./aggregator')


aggregator.enqueue({title:'foo',content:'bar'})
aggregator.enqueue({title:'blahblah',content:'bah bah'})

var server = restify.createServer({
	name: 'megafilter',
	//certificate:'string',
	//key:'string',
	version: '0.0.1'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/next',function(req,res,next) {
	var data = aggregator.next()
	res.send(data.article?200:404,data)
	return next()
})

server.get('/current',function(req,res,next) {
	var data = aggregator.current()
	res.send(data.article?200:404,data)
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


// any other request, for static things
server.get(/.*/,restify.serveStatic({
	directory:__dirname+'/public/',
	default:'index.html',
	//maxAge:3600,
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
			console.log(err)
			process.exit(1)
		}

		var feeds = result.opml.body[0].outline
		var urls  = []

		for (var i in feeds) {
			console.log('Watching',feeds[i].$.title)
			urls.push(feeds[i].$.xmlUrl)
		}

		aggregator.watchRssFeeds(urls)
	})
})
