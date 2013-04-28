// allow some options to come from the command line
var argv = require('optimist')
	.usage('Usage: megafilter --s subscriptions.xml')
	.default({
		user : process.env.USER,
		port : 8080,
		//subscriptions : 'subscriptions.xml'
		'store-dir' : process.cwd(),
		backfill  : 0,
		theme : 'default'
	})
	.demand(['subscriptions'])
	.describe('subscriptions','Google reader exported subscriptions.xml file')
	.describe('password','setting a password will enable authentication')
	.describe('port','port to listen on')
	.describe('username','username for auth, defaults to current user')
	.describe('import-greader-starred','import you starred google reader items to published feed')
	.describe('store-dir','directory to store published.json')
	.describe('backfill','add all articles')
	.describe('theme','CSS style filename from public/themes/ without extension (default or elastic)')
	.alias('subscriptions','s')
	.alias('password','p')
	.alias('store-dir','d')
	.alias('username','u')
	.alias('backfill','b')
	.alias('port','P')
	.alias('theme','t')
	.argv



exports.dir = argv.dir || process.env.HOME

// storage (published articles) actor
exports.store = {
	actor: 'json',
	//actor: 'sqlite',
	//actor: 'redis',
	file: exports.dir+'/megafilter-published.json',
}



// XML file containing (OPML) RSS/ATOM feed URLs from google reader
exports.subscriptions = argv.subscriptions || __dirname+'/subscriptions.xml'


// maximum number of articles via /published API call
exports.maxArticles     = 50


// specify --user optionally, defaults to username
// specify --password optionally, defaults to nothing which disables auth
exports.username = argv.username || process.env.USER
exports.password = argv.password

exports.port = argv.port || process.env.PORT || 8080

exports.argv = argv



// BACKFILL
Date.prototype.addHours = function(h) {
	this.setTime(this.getTime() + (h*60*60*1000))
	return this
}

exports.since = new Date()
exports.since = exports.since.addHours(-argv.backfill)



exports.theme = argv.theme
