const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const{app} = require('../server');
const{Todo} = require ('../models/todo');

// CLEAR DB OF TODO'S
const seedTodos= [{
    _id:new ObjectID(),
    text:'First test todo'
},{
    _id:new ObjectID(),
    text:'Second test todo'
},{
    _id:new ObjectID(),
    text:'Third test todo'
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
       return Todo.insertMany(seedTodos);
    }).then(()=> done());
});

describe ('POST /todos',()=>{
    it ('should create a new todo', (done)=>{
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    });

    it ('should not create todo with invalid body data', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res)=>{
            if (err) {
                return done (err);
            }
            Todo.find().then((todos)=>{
                expect (todos.length).toBe(seedTodos.length);
                done();
            }).catch((e)=>done(e));
        });
    })
});

describe ('GET /todos',()=>{

    it ('should get all the todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect ((res)=>{
            expect(res.body.todos.length).toBe(seedTodos.length);
        })
        .end(done);
    });

});

describe ('GET /todos/:id',()=>{

    it ('should get one todo',(done)=>{
        request(app)
        .get(`/todos/${seedTodos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(seedTodos[0].text);
        })
        .end(done);
    });

    it ('should return a 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it ('should return a 404 for non-object IDs', (done)=>{
       request(app)
        .get(`/todos/9027546639`)
        .expect(404)
        .end(done);
    })

});