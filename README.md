Remember to do a recursive clone, there are submodules. If you don't the icons won't work.


I'll open-source it under MIT, BSD or GPLv2 when it works.


RESTful JSON API
----------------

> `GET /next`
Get the next article. Returns `article` and `pending` count.

> `GET /current`
Get the current article (good for first load) returns `article` and `pending` count.

> `DELETE /:id`
Discard an article from the queue. Returns `pending` count.

> `GET /publish/:id`
Publish an article by ID from the queue (removing it). Returns `pending` count.

> `GET /articles/:count`
Given a `count` as parameter, return published articles. 0 Means all articles, unspecified  means 30.

> `GET /pending`
Gives the current number of articles pending


Article format
--------------

The same as the node-feedparser format.

	* title
	* description (frequently, the full article content)
	* summary (frequently, an excerpt of the article content)
	* link
	* origlink (when FeedBurner or Pheedo puts a special tracking url in the `link` property, `origlink` contains the original link)
	* date (most recent update)
	* pubdate (original published date)
	* author
	* guid (a unique identifier for the article)
	* comments (a link to the article's comments section)
	* image (an Object containing `url` and `title` properties)
	* categories (an Array of Strings)
	* source (an Object containing `url` and `title` properties pointing to the original source for an article; see the [RSS Spec](http://cyber.law.harvard.edu/rss/rss.html#ltsourcegtSubelementOfLtitemgt) for an explanation of this element)
	* enclosures (an Array of Objects, each representing a podcast or other enclosure and having a `url` property and possibly `type` and `length` properties)
	* meta (an Object containing all the feed meta properties; especially handy when using the EventEmitter interface to listen to `article` emissions)

