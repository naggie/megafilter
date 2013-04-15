// allow some options to come from the command line
var argv = require('optimist')
	.usage('Usage: megafilter --subscriptions subscriptions.xml')
	.default({
		user : process.env.USER,
		port : 8080,
		//subscriptions : 'subscriptions.xml'
		'store-dir' : process.cwd()
	})
	.demand(['subscriptions'])
	.describe('subscriptions','Google reader exported subscriptions.xml file')
	.describe('password','setting a password will enable authentication')
	.describe('port','port to listen on')
	.describe('username','username for auth, defaults to current user')
	.describe('import-greader-starred','import you starred google reader items to published feed')
	.describe('store-dir','directory to store published.json')
	.alias('subscriptions','s')
	.alias('password','p')
	.alias('store-dir','d')
	.alias('username','u')
	.alias('port','P')
	.argv

// queue actor
exports.queue = 'internal'
//exports.queue = 'redis'


// storage (published articles) actor
exports.store = 'json'
//exports.store = 'redis'
//exports.store = 'sqlite'


// ACTOR CONFIG
//...

// XML file containing (OPML) RSS/ATOM feed URLs from google reader
exports.subscriptions = argv.subscriptions || __dirname+'/subscriptions.xml'


// maximum number of articles via /published API call
exports.maxArticles     = 50


// specify --user optionally, defaults to username
// specify --password optionally, defaults to nothing which disables auth
exports.username = argv.username || process.env.USER
exports.password = argv.password


exports.port = argv.port || process.env.PORT || 8080

// dir to save starred items FIXME
exports.dir = argv.dir || process.env.HOME
exports.file = exports.dir+'/megafilter-published.json'

exports.argv = argv
