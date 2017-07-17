const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const{app} = require('../server');
const{User} = require ('../models/user');

describe ('POST /users',()=>{

    it ('should create a new user', (done)=>{
        var email = 'ross.burke7@gmail.com';
        var password = 'train1234'
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toBe(email);
            expect(res.body.password).toBe(password);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.find({email}).then((users)=>{
                expect(users.length).toBe(1);
                expect(users[0].email).toBe(email);
                done();
            }).catch((e)=>done(e));
        });
    });

    // it ('should not create todo with invalid body data', (done)=>{
    //     request(app)
    //     .post('/todos')
    //     .send({})
    //     .expect(400)
    //     .end((err, res)=>{
    //         if (err) {
    //             return done (err);
    //         }
    //         Todo.find().then((todos)=>{
    //             expect (todos.length).toBe(seedTodos.length);
    //             done();
    //         }).catch((e)=>done(e));
    //     });
    // });

});