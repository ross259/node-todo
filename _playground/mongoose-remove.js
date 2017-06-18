const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user')

var userID = '59388964c1908f2c40906044'

Todo.remove({}).then((result)=>{
    console.log(result);
})

Todo.findOneAndRemove({name:"Todd"})

Todo.findByIdAndRemove('59388964c1908f2c40906044').then((todo)=>{
    console.log(todo);
})