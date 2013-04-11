var aggregator = require('./aggregator')
var argv = require('optimist').argv
var fs = require('fs')

if (argv.starred) {
	var items = JSON.parse(fs.readFileSync(argv.starred) ).items

	console.log('Importing',items.length,'articles from google reader')

	// items successfully imported
	var count = 0

	for (var i in items) {
		var item    = items[i]
		var article = {}

		article.pubdate      = (new Date(item.published*1000)).toString()
		article.title        = item.title
		article.author       = item.author
		article.source       = {
			title : item.origin.title,
			link  : item.origin.htmlUrl
		}

		if ( item.canonical)
			article.link = item.canonical[0].href
		else
			article.link = item.alternate[0].href

		article.description  = item.content && item.content.content
		article.summary      = item.summary && item.summary.content

		article.id = aggregator.articleHash(article)

		if (aggregator.store.insert(article) ) {
			count++
			process.stdout.write("Imported "+ count +"/"+items.length+" articles\r")
		}
	}

	if (count < items.length)
		console.log(items.length-count,'articles could not be imported')
	else
		console.log('All articles sucessfully imported!')

	console.log('Saving...')
	aggregator.store.save()
}


if (argv.subscriptions)
	console.log('Import of subscriptions not yet supported. Can load from it.')



