const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require ('../../models/todo');
const {User} = require ('../../models/user');

const seedTodos= [{
    _id:new ObjectID(),
    text:'First test todo'
},{
    _id:new ObjectID(),
    text:'Second test todo',
    completed: true,
    completedAt: 333
},{
    _id:new ObjectID(),
    text:'Third test todo'
}];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const seedUsers = [{
    _id:userOneId,
    email:"ross.burke@fabmail.com",
    password:"wipeout5267",
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userOneId, access:'auth'}, 'abc123').toString()
    }]
},{
    _id:userTwoId,
    email:"randomguy@gmail.com",
    password:"ultra5536"
}]

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
       return Todo.insertMany(seedTodos);
    }).then(()=> done());
}

const populateUsers  = (done)=>{
    User.remove({}).then(()=>{
       var userOne = new User(seedUsers[0]).save();
       var userTwo = new User(seedUsers[1]).save();

       return Promise.all([userOne, userTwo])
    }).then(()=> done());
}

module.exports = {
    seedTodos,
    populateTodos,
    seedUsers,
    populateUsers
}