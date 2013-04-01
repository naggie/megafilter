var restify = require('restify')

var config = require('./config')

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

server.get('/next', function (req, res, next) {
	var data = aggregator.next()
	res.send(data.article?200:404,data)
	return next()
})

server.get('/current', function (req, res, next) {
	var data = aggregator.current()
	res.send(data.article?200:404,data)
	return next()
})

server.get(/.*/,restify.serveStatic({
	directory:__dirname+'/public/',
	default:'index.html',
	//maxAge:3600,
}))

server.listen(process.env.PORT | 8080, function () {
	console.log('%s listening at %s', server.name, server.url)
})
