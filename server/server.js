require('./config/config');

const _ = require('lodash');

const express = require ('express');
const bodyParser = require ('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const {authenticate} = require('./middleware/authenticate');

const PORT = process.env.PORT;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text:req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos:todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id',(req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return res.sendStatus(404);
    }
    Todo.findById(id).then((todo)=>{
        if (todo) res.send({todo});
        else res.sendStatus(404);
    }).catch((e)=>{
        res.sendStatus(400);
    });
});

app.delete('/todos/:id', (req,res)=>{
    var id=req.params.id;
    if (!ObjectID.isValid(id)){
        return res.sendStatus(404);
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(todo) res.status(200).send({todo});
        else res.status(404).send("ID not found");
    }).catch((e)=>{
        res.sendStatus(400);
    });
});

app.patch('/todos/:id', (req, res)=>{
    var id = req.params.id;
    console.log(id)
	console.log("body", req.body);
    var body = _.pick(req.body, ['text','completed']);
    if (!ObjectID.isValid(id)){
        return res.sendStatus(404);
    }
    if (_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo)=>{
        if(!todo){
            return res.sendStatus(404);
        }
        res.send({todo});
    }).catch((e)=>{
       // res.status(400).send();
        res.sendStatus(400);
    })
});

app.post('/users', (req, res)=>{
    var body = _.pick(req.body, ['email','password']);
    var user = new User(body);
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
});

app.listen(PORT, ()=>{
    console.log(`Started on port ${PORT}`);
});

module.exports = {app}