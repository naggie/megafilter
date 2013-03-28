interface Article {
	// some identifier that uniquely matches this article in the queue
	id            : number;

	publishedDate : Date;
	title         : string;

	// HTML content
	content       : string;

	// name/email of original author
	author        : string;

	// URL to article on the web
	link          : string;
}

// implements a circular queue and article storage
interface Storage {
	// add an Article to the queue
	enqueue(article : Article) : void;

	// return an article from the queue
	next(void) : void;

	// remove an article from the queue
	discard(id :number) : void;

	// publish an item (keep it) and remove it from the queue
	pubish(id :number) : void;

	// retrieve n latest published articles (0 for all)
	dump(count :number) : void;

	// number of articles in queue
	pending:number;

	// number of articles that have been published
	published:number;

}


class jsonStorage implements Storage {

}
