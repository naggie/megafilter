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

var aggregator = require('./aggregator')
var argv = require('optimist').argv
var fs = require('fs')

if (argv.google-starred) {
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


if (argv.google-subscriptions)
	console.log('Import of subscriptions not yet supported. Can load from it.')



