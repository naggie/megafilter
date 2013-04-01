// uses node-feedparser to give 'real time' updates for RSS
// watches the feed, firing *after* each interval in a loop
// This stops hammering the feed when the app is restarted
// for updates or whatever
// TODO: conditional GET (if-modified-since and etag)
// Will have to remember old intervals
// using request object
// https://github.com/danmactough/node-feedparser
var fp = require('feedparser')
//var request = require('request')

// update interval is in seconds
// offset allows multiple queries on the same server without hammering
var watch = function (params) {
	if (!params.url) console.error('No URL given')
	if (!params.callback) params.callback = function() {console.error('Callback needed')}

	// silent: yes, I know parseURL is depreciated. See #15
	var parser = new fp ({silent:true})

	// array of known GUIDs
	var known = []

	var interval = {
		// 1 minute
		min: 60,
		// 1 day
		max: 84600,
		// initially set to default value, 5 hours
		current: 18000,
	}

	if (params.interval) interval.current = params.interval

	// offset, to reduce hammering on server restart (updates)
	// and also when checking multiple feeds from the same server
	interval.offset = interval.current*Math.random() + interval.min

	// array of pubdates to unix time, used for calculating update interval
	var dates = []

	// given articles (etc) see if it's new
	// if so, and it to the public callback
	// also ignore the first batch. Real time only.
	var inspect = function(error,meta,articles) {
		if (error) return console.error(params.url,error)

		// oldest first is required to publish in correct order
		articles.reverse()

		// do not publish articles on first run
		if (known.length) {
			articles.forEach( function (article,i) {
				// is this article new? If so, guid is not in known
				if (known.indexOf(article.guid) == -1)
					params.callback(article)

				var date = (new Date(article.pubdate) ).valueOf()
				// convert to seconds
				date /= 1000
				dates.push(date)

				// only keep 20
				if (dates.length > 20)
					dates.shift()
			})
		}

		// recalculate interval (if interval was not explicitly set)
		if (!params.interval)
			calcInterval()

		// GUID GARBAGE COLLECTION, EFFECTIVELY
		// articles which have fallen off the end of the feed stack won't appear again
		// so the old GUIDs may be removed. A simple way is to re-create the known array.
		known = []
		articles.forEach( function (article) {
			known.push(article.guid)
		})

		// fire at next interval (time may change, so timeout is used rather than interval)
		setTimeout(function() { parser.parseUrl(params.url,inspect) },interval.current*1000)
	}

	var calcInterval = function() {
		var periods = []

		dates.sort(function(a,b){return a-b})

		dates.forEach(function (d,i) {
			if (dates[i+1])
				periods.push(dates[i+1] - d)
		})

		// remove potential outliers
		periods.push()
		periods.pop()

		// no meaningful information, leave interval as-is
		if (periods.length < 4) return

		// calculate average
		var avg = 0
		periods.forEach(function(i){
			avg +=i
		})
		avg /= periods.length

		if (avg < interval.min) interval.current = interval.min
		if (avg > interval.max) interval.current = interval.max

		if (avg > interval.min && avg < interval.max )
			interval.current = avg
	}

	// initial run at offset
	setTimeout(function() { parser.parseUrl(params.url,inspect) },interval.offset*1000)
}

var watchMultiple = function (params) {
	if (!params.urls) console.error('No URLs given')
	if (!params.interval) params.interval = 15*60 // 15 minutes
	if (!params.callback) params.callback = function() {console.error('Callback needed')}

	params.urls.forEach(function (url,i) {
		// different offset for each, to avoid hammering
		var offset = i*(params.interval/params.urls.length)
		new watch({
			url:url,
			interval:params.interval,
			callback:params.callback
		})
	})
}

exports.watch = function(params) {return new watch(params)}
exports.watchMultiple = function(params) {return new watchMultiple(params)}

