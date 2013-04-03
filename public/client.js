// TODO: switch to requireJS or AMD modules
// TODO: convert to backbone?

$(function(){
	//mf.initialArticle(mf.loadNext)

	// put in constructor
	mf.nav = {}
	mf.nav.skip    = new mf.controllers.button('#skip')
	mf.nav.discard = new mf.controllers.button('#discard')
	mf.nav.publish = new mf.controllers.button('#publish')
	mf.nav.inspect = new mf.controllers.button('#inspect')
	mf.nav.undo    = new mf.controllers.button('#undo')

	mf.nav.skip.bind('right')
	mf.nav.skip.bind('j')
	mf.nav.discard.bind('x')
	mf.nav.discard.bind('d')
	mf.nav.publish.bind('w')
	mf.nav.publish.bind('p')
	mf.nav.inspect.bind('i')
	mf.nav.inspect.bind('return')
	mf.nav.undo.bind('u')
	mf.nav.undo.disable()

	mf.article = new mf.controllers.article('article')
})

var mf = {}

mf.updatePending = function(count) {
	$('#pending').text(count)
}

// cache the next article
mf.loadNext = function() {

}

// render the next article from cache and begin to use the
mf.next = function() {}

mf.initialArticle = function(done) {
	
}

mf.controllers = {}

mf.controllers.article = function(selector) {
	var ele = $(selector)

	// render a given node-feedparser article to the page
	this.render = function(article) {
		ele.css('visibility','visible')
		$('section.description',ele).html(article.description)
		$('> h1 a',ele).text(article.title).attr(href,article.origlink)
		$('time',ele).attr('datetime',article.pubdate)
		$('.note',ele).html(article.author).prepend(' by ')
	}

	this.hide = ele.hide = function() {
		ele.css('visibility','hidden')
	}
}


// navigation buttons (sort of like a view controller)
mf.controllers.button = function(selector){
	var ele = $(selector)
	var enabled = true;

	// callback for when button is clicked or key is pressed
	var action = this.action = function() {}

	ele.click(function() {
		if (enabled)
			action()
	})

	this.enable = function() {
		enabled = true
		ele.removeClass('disabled')
		return this
	}

	this.disable = function() {
		enabled = false
		ele.addClass('disabled')
		return this
	}

	// bind a key
	this.bind = function(key) {

		// press
		$(document).bind('keydown',key,function() {
			if (!enabled) return false

			ele.addClass('depressed')
			return false
		})
		// release
		$(document).bind('keyup',key,function() {
			if (!enabled) return false

			ele.removeClass('depressed')
			action()
			return false
		})
		return this
	}
}

