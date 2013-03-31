config = require('./config')

queue  = require('./articleQueue')[config.queue]
store  = require('./articleStorage')[config.store]
