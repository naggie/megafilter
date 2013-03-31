var restify = require('restify')

var server = restify.createServer({
	name: 'megafilter',
	//certificate:'string',
	//key:'string',
	version: '0.0.1'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/echo/:name', function (req, res, next) {
	res.send(req.params)
	return next()
})


server.get(/.*/,restify.serveStatic({
	directory:__dirname+'/public/',
	default:'index.html',
	//maxAge:3600,
}))

server.listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url)
})
