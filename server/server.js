var express = require ('express');
var bodyParser = require ('body-parser');

var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const PORT = 4000;

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

app.listen(PORT, ()=>{
    console.log(`Started on port ${PORT}`);
})