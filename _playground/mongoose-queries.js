const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user')

var userID = '59388964c1908f2c40906044'
// var id = '594439665c63b650841deff244';

// if (!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }

// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id:id
// }).then((todo)=>{
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo)=>{
//     if (!todo){
//         return console.log("ID not found");
//     }
//     console.log('Todo By ID', todo);
// }).catch((e)=> console.log(e));

User.findById(userID).then((user)=>{
    if (!user){
        return console.log("User not found.");
    }
    console.log('User Email', user.email)
}).catch((e)=>console.log(e));