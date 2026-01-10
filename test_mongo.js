const MongoStore = require('connect-mongo');
console.log('MongoStore type:', typeof MongoStore);
console.log('MongoStore keys:', Object.keys(MongoStore));
if (MongoStore.default) {
    console.log('MongoStore.default keys:', Object.keys(MongoStore.default));
}
try {
    const store = MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/test' });
    console.log('Store created successfully');
} catch (e) {
    console.log('Error creating store:', e.message);
}
