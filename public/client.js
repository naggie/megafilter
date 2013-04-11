// TODO: switch to requireJS or AMD modules
// TODO: convert to backbone?

$(function(){
	mf.init()
	mf.load()
})

var mf = {}

mf.init = function() {
	mf.nav = {}

	mf.nav.skip    = new mf.controllers.button('#skip')
	mf.nav.discard = new mf.controllers.button('#discard')
	mf.nav.publish = new mf.controllers.button('#publish')
	mf.nav.inspect = new mf.controllers.button('#inspect')
	mf.nav.undo    = new mf.controllers.button('#undo')

	mf.nav.skip.bind('right').bind('j').bind('s')
	mf.nav.discard.bind('x').bind('d')
	mf.nav.publish.bind('p')
	mf.nav.inspect.bind('i')
	mf.nav.undo.bind('u').bind('ctrl+z')
	mf.nav.undo.disable()

	mf.display = new mf.controllers.display('article')
	mf.display.wait()

	mf.pending = new mf.controllers.counter('#pending')
	// queue refill should load article
	mf.pending.change(function(from, to){
		document.title =  '('+to+') Megafilter'

		// is there another article to skip to?
		if (to < 2)
			mf.nav.skip.disable()
		// skip is always disabled before a load, always enable if valid
		else
			mf.nav.skip.enable()
	})

	mf.nav.skip.action(mf.skip)
	mf.nav.discard.action(mf.discard)
	mf.nav.publish.action(mf.publish)
	mf.nav.inspect.action(mf.inspect)

	setInterval(mf.check_pending,5000)

	mf.notification = new mf.controllers.notification('#notification')
}

mf.controllers = {}

mf.controllers.display = function(selector) {
	var ele = $(selector)

	// currently displayed article, if any
	this.article = null

	// render a given node-feedparser article to the page
	this.render = function(article) {
		$('body').scrollTop(0)
		// clean this up FIXME
		this.article = article
		$('#placeholder').hide()
		$('#loading').hide()
		ele.css('visibility','visible')
		$('section.description',ele).html(article.description || article.summary)
		$('> h1 a',ele).html(article.title).attr('href',article.link)
		$('time',ele).attr('datetime',article.pubdate)
		$('.note',ele).empty()
		if (article.author) $('.note',ele).html(article.author).prepend(' by ')
		if (article.source.title) $('.note',ele).prepend('<a href="'+article.source.link+'">'+article.source.title+'</a>').prepend(' from ')
		// also do link to source site homepage
		// open all article links in a new window
		$('a',ele).attr('target','_new')
		return this
	}

	var discard = this.discard = function() {
		this.article = null
		ele.css('visibility','hidden')
		return this
	}

	// show loading animation
	this.wait = function(){
		$('#loading').show()
		discard()
		$('#placeholder').hide()
		return this
	}

	// show a message in place of the article
	this.placeholder = function(msg) {
		$('#loading').hide()
		discard()
		$('#placeholder').show().text(msg)
		return this
	}
}

// positive article counter
mf.controllers.counter = function(selector) {
	var ele = $(selector)
	// count
	var value = " "

	// callback for when number changes
	var change = function(from,to) {}
	this.change = function(fn) {
		change = fn
	}

	this.set = function(number) {
		// from, to
		change(value,number)
		ele.text(number)
		value = number
		return this
	}

	// initialise to zero without triggering change()
	ele.text(0)

	this.get = function() {
		return value
	}

	this.decrement = function() {
		if (value > 0) {
			ele.text(--value)
			change(value+1,value)
		}

		return this
	}

	this.increment = function() {
		ele.text(++value)
		change(value+1,value)

		return this
	}
}

// navigation buttons (sort of like a view controller)
mf.controllers.button = function(selector){
	var ele = $(selector)
	var enabled = true;

	// callback for when button is clicked or key is pressed
	var action = function() {}
	this.action = function(fn) {
		action = fn
	}

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

mf.controllers.notification = function(selector) {
	var ele = $(selector)
	var beep = $('#beep').get()[0]

	// timeout id for the fade out animation
	var timeout

	// user may have interest
	//ele.on('mouseenter',function(){
	//	clearTimeout(timeout)
	//})

	// set the message, optionally specifying an icon from font awesome,
	// without icon- prefix
	this.say = function(msg,icon) {
		if (!arguments[1])
			var icon = 'info-sign'

		$('body').scrollTop(0)

		var icon = $('<i />').addClass('icon-'+icon)
		ele.stop(1).show().html(msg).prepend(' ').prepend(icon)

		// another message pending? don't want it's replacement to fade too quick
		clearTimeout(timeout)
		// new extended time
		timeout = setTimeout(function(){
			$(ele).fadeOut(300)
		},2500)

		// may as well log in console
		console.log(msg)

		// chaining
		return this
	}

	this.beep = function() {
		// this is necessary, otherwise it won't work more than once
		// http://stackoverflow.com/questions/2702343/html5-audio-plays-only-once-in-my-javascript-code
		beep.load()
		beep.play()

		// chaining
		return this
	}

	// chain: make the message persistent (CALL AFTER say() IN CHAIN)
	this.persist = function() {
		clearTimeout(timeout)
		return this
	}

}

// last deleted or published article (MUST BE A CLONE)
mf.trash = {}

// -------model?

// download and display the next article (or current on first load)
mf.load = mf.skip = function() {
	// remove article, show loading animation
	mf.display.wait()

	// article operations not valid during loading
	mf.nav.discard.disable()
	mf.nav.publish.disable()
	mf.nav.inspect.disable()

	// undo has lost its context
	mf.nav.undo.disable()

	// do not want to load another article whilst this one is pending
	mf.nav.skip.disable()

	$.ajax({
		url: mf.display.article?'/next':'/current',
		type:'GET',
		error:function() {
			mf.display.placeholder('No more articles')
		},
		success:function(article) {
			mf.display.render(article)

			// this will also set whether skip is possible
			mf.pending.set(article.pending)

			// re-enable article operations
			mf.nav.discard.enable()
			mf.nav.publish.enable()
			mf.nav.inspect.enable()
		}


	})
}

mf.publish = function() {
	$.ajax({
		url:'/publish/'+mf.display.article.id,
		type:'PUT',
		error:function() {
			mf.notification.say('article already published','exclamation-sign').beep()
		},
		success:function() {
			mf.notification.say('published article','ok')
			mf.nav.undo.enable().action(mf.unpublish)
		}

	})
}

mf.discard = function() {
	// clone old article to trash
	mf.trash = $.extend({},mf.display.article)

	mf.pending.decrement()
	$.ajax({
		url:'/queue/'+mf.display.article.id,
		type:'DELETE',
		error:function() {
			mf.notification.say('could not delete previous article','exclamation-sign').beep()
		},
		success:function() {
			mf.notification.say('discarded previous article','ok')
			mf.nav.undo.enable().action(mf.undiscard)
		}
	})
	mf.load()
}

mf.unpublish = function() {
	mf.notification.say('retracting article','spinner icon-spin').persist()
	mf.nav.undo.disable()

	$.ajax({
		url:'/published/'+mf.display.article.id,
		type:'DELETE',
		error:function() {
			mf.notification.say('could not undo publish','exclamation-sign').beep()
		},
		success:function() {
			mf.notification.say('article retracted','ok')
		}
	})
}

mf.inspect = function() {
	window.open(mf.display.article.link)
}

// restore last extracted article to queue
mf.undiscard = function() {
	mf.notification.say('restoring previous article to queue...','spinner icon-spin').persist()
	mf.nav.undo.disable()

	$.ajax({
		url:'/enqueue',
		type:'POST',
		data: mf.trash,
		error:function() {
			mf.notification.say('could not restore previous article','exclamation-sign').beep()
		},
		success:function() {
			mf.notification.say('sucessfully restored previous article to queue','ok')
			// load article on restore to empty queue
			if (mf.pending.get() == 0) mf.load()
			mf.pending.increment()
		}

	})
}


// periodically update counter and load new article if queue is re-formed
mf.check_pending = function () {
	$.ajax({
		url: '/pending',
		type: 'GET',
		success: function(d) {
			// queue has an item for the first time since
			if (d.pending > 0 && mf.pending.get() == 0) {
				mf.load()
				mf.notification.say('new article in queue').beep()
			}

			mf.pending.set(d.pending)
		},
		error: function() {
			mf.notification.say('network error','warning-sign')
		}
	})
}
