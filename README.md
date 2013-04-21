This is a personal replacement for Google reader. It's simple and suits my workflow.

Articles are added to a circular FIFO queue, so that the latest articles always appear
next. Articles can be:

* **Skipped** to be viewed later
* **Published** to a JSONP 'RSS' feed
* **Discarded** from the queue
* **Inspected** to view the article from the original website, with comments

Destructive actions can be undone.

The current article is synchronised across all devices, so you can continue reading
on yor smartphone.


**State: Very beta but working very well!** I have migrated from Google reader to Megafilter.


![screenshot](http://callanbryant.co.uk/images/megafilter.png)


[See my blog post about it][2].

[2]: http://callanbryant.co.uk/#Blog


	sudo npm install -g megafilter
	# copy subscriptions.xml and starred.json from your google reader takeout to here
	megafilter -s subscriptions.xml --import-greader-starred starred.json
	open http://localhost:8080

The idea is that you run this on your own server. You can specify a PORT via
the environment variable or `--port`. Setcap can be used to run from port
80 without sudo; this is documented at the end of this file.

There will be a subscriptions manager soon. For the mean time, always start the
server with `-s subscriptions.xml`. Note that you only need to import once!

You can specify `--password <password>` to require auth. A `--username` can be
set, but this defaults to the executing user.


By default megafilter will save the published items to
`~/megafilter-published.json`. You can change this directory with `--store-dir`


When running, ~megafilter will wait for new articles. You may have to wait a
bit! A backfill option will be added.


[1]: http://stackoverflow.com/questions/413807/is-there-a-way-for-non-root-processes-to-bind-to-privileged-ports-1024-on-l



RESTful JSON API
----------------

> `GET /next`
Get the next article. Returns `article` and `pending` count.

> `GET /current`
Get the current article (good for first load) returns `article` and `pending` count.

> `DELETE /queue/:id`
Discard an article from the queue.

> `PUT /publish/:id`
Publish an article by ID from the queue.

> `GET /published`
Given a `count` as parameter, return published articles. 0 Means all articles, unspecified  means 30.

> `GET /pending`
Gives the current number of articles pending

> `DELETE /published/:id`
Delete an article from the published collection

> `POST /enqueue`
Remotely adds an article to the queue.




Article format
--------------

The same as the node-feedparser format.

* `title`
* `description` (frequently, the full article content)
* `summary` (frequently, an excerpt of the article content)
* `link`
* `origlink` (when FeedBurner or Pheedo puts a special tracking url in the `link` property, `origlink` contains the original link)
* `date` (most recent update)
* `pubdate` (original published date)
* `author`
* `guid` (a unique identifier for the article)
* `comments` (a link to the article's comments section)
* `image` (an Object containing `url` and `title` properties)
* `categories` (an Array of Strings)
* `source` (an Object containing `url` and `title` properties pointing to the original source for an article; see the [RSS Spec](http://cyber.law.harvard.edu/rss/rss.html#ltsourcegtSubelementOfLtitemgt) for an explanation of this element)
* `enclosures` (an Array of Objects, each representing a podcast or other enclosure and having a `url` property and possibly `type` and `length` properties)
* `meta` (an Object containing all the feed meta properties; especially handy when using the EventEmitter interface to listen to `article` emissions)


Running without sudo on port 80
-------------------------------

If you want to host on port 80 under ubuntu on your account, you can install `libcap2-bin` 
then run `setcap 'cap_net_bind_service=+ep' /usr/local/bin/node` to give node access to port 80.

Your path to the `node` binary may vary, you can find it with `which node`


Acknowledgements
----------------

Megafilter would not have been possible without the following awesome projects:

  * [node feedparser][3]: Used to understand RSS feeds
  * [jQuery hotkeys][4]: Used for the keyboard shorcuts
  * [Font Awesome][5]: used for the UI graphics
  * [jQuery][6]
  * [node restify][7]: Used for the RESTful JSON API, and UI serving

[3]: https://github.com/danmactough/node-feedparser
[4]: https://github.com/jeresig/jquery.hotkeys
[5]: http://fortawesome.github.io/Font-Awesome/
[6]: http://jquery.com
[7]: http://mcavage.github.io/node-restify/
