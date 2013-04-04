
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
