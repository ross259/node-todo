const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require ('../../models/todo');
const {User} = require ('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const seedTodos= [{
    _id:new ObjectID(),
    text:'First test todo',
    _creator:userOneId
},{
    _id:new ObjectID(),
    text:'Second test todo',
    completed: true,
    completedAt: 333,
    _creator:userTwoId
},{
    _id:new ObjectID(),
    text:'Third test todo',
    _creator:userOneId
}];

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
    password:"ultra5536",
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userTwoId, access:'auth'}, 'abc123').toString()
    }]
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