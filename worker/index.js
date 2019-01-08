const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
    if(index < 2) return 1;
    return fib(index -1) + fib(index -2);
}
// recursive solution are not quick to run so in our sepcific case, this will justify to have several worker running on this function

//the below is a way for each time a new value is added to redis, to run the fib function
sub.on('message', (channel, message) => {
    //each time a new value is persist in redis, we call redisClient
    //and inside a hash called values, the key will be the message i.e.
    //the index and the corresponding value the fibonacci value
    redisClient.hset('values', message, fib(parseInt(message)));
});

//the following is to tell each time a new value is entered it will call emit a message
sub.subscribe('insert')
