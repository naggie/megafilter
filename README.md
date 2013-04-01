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


Article format
--------------

	// some identifier that uniquely matches this article in the queue
	// optional (hash will be generated)
	id            : string;

	publishedDate : Date;
	title         : string;

	// HTML content
	content       : string;

	// name/email of original author
	author        : string;

	// URL to article on the web
	link          : string;
