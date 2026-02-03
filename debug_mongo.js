const MongoStore = require('connect-mongo');
console.log('Type of MongoStore:', typeof MongoStore);
console.log('MongoStore keys:', Object.keys(MongoStore));
console.log('MongoStore.create defined?:', typeof MongoStore.create);
if (MongoStore.default) {
    console.log('MongoStore.default keys:', Object.keys(MongoStore.default));
    console.log('MongoStore.default.create defined?:', typeof MongoStore.default.create);
}
