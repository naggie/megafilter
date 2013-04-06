// allow some options to come from the command line
var argv = require('optimist').argv

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
exports.subscriptions = __dirname+'/subscriptions.xml'


// maximum number of articles
exports.maxArticles     = 300


// specify --user optionally, defaults to username
// specify --password optionally, defaults to nothing which disables auth
exports.username = process.env.USER || argv.username
exports.password = argv.password

console.log(exports)
