const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

//mongoose.connect('mongodb://ross259:w0Rd2urM0M!@ds143181.mlab.com:43181/node_todo259');

//mongoose.connect('mongodb://ross259:w0Rd2urM0M!@ds131312.mlab.com:31312/todo2_259')

module.exports = {
    mongoose
}