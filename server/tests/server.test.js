const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require ('../models/todo');

const {seedTodos, seedUsers, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateTodos, populateUsers);

// REST METHODS
describe ('POST /todos',()=>{

    it ('should create a new todo', (done)=>{
        var text = 'Test todo text';
        request(app)
        .post('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
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
        .set('x-auth', seedUsers[0].tokens[0].token)
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
    });

});

describe ('GET /todos',()=>{

    it ('should get all the todos', (done)=>{
        request(app)
        .get('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .expect ((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });

});

describe ('GET /todos/:id',()=>{

    it ('should get one todo',(done)=>{
        request(app)
        .get(`/todos/${seedTodos[0]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(seedTodos[0].text);
        })
        .end(done);
    });

    it ('should not return a todo created by another user',(done)=>{
        request(app)
        .get(`/todos/${seedTodos[1]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it ('should return a 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it ('should return a 404 for non-object IDs', (done)=>{
       request(app)
        .get(`/todos/9027546639`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

});

describe ('DELETE /todos/:id', (done)=>{

    it ('should remove a todo',(done)=>{
        var hexId = seedTodos[2]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(seedTodos[2].text);
        })
        .end((err, res)=>{
            if (err) return done(err);
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toNotExist()
                done()
            }).catch((e)=> done());
        });
    });

    it ('should NOT remove a todo created by another user',(done)=>{
        var hexId = seedTodos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', seedUsers[1].tokens[0].token)
        .expect(404)
        .end((err, res)=>{
            if (err) return done(err);
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toExist();
                done();
            }).catch((e)=> done());
        });
    });

    it ('should return 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it ('should return 404 if object id is invalid', (done)=>{
       request(app)
        .delete(`/todos/9027546639`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

});

describe ('PATCH /todos/:id',(done)=>{

    it ('should update the todo',(done)=>{
        var hexId = seedTodos[0]._id.toHexString();
        var text = 'New text';
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({text:text, completed:true})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done)

    });

    it ('should NOT update a todo created by another user',(done)=>{
        var hexId = seedTodos[0]._id.toHexString();
        var text = 'New text';
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[1].tokens[0].token)
        .send({text:text, completed:true})
        .expect(404)
        .end(done)

    });

    it ('should clear completedAt when todo is not completed', (done)=>{
        var hexId = seedTodos[1]._id.toHexString();
        var text = 'New Text for second item'
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[1].tokens[0].token)
        .send({text:text, completed:false})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });

});