const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {User} = require ('../models/user');

const {seedUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe ('GET /users/me', ()=>{

    it ('should return user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth', seedUsers[0].tokens[0].token )
        .expect(200)
        .expect((res)=>{
            expect (res.body._id).toBe(seedUsers[0]._id.toHexString());
            expect (res.body.email).toBe(seedUsers[0].email);
        }).end(done);
    });

    it ('should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body._id).toNotExist();
            expect(res.body).toEqual({});
        })
        .end(done)
    });

});

describe ('POST /users',()=>{

    it ('should create a new user', (done)=>{
        var email = 'ross.burke7@gmail.com';
        var password = 'train1234'
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
            //expect(res.body.password).toBe(password);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.find({email}).then((users)=>{
                expect(users.length).toBe(1);
                expect(users[0].password).toNotBe(password);
                expect(users[0].email).toBe(email);
                done();
            }).catch((e)=>done(e));
        });
    });

    it ('should return validation errors if request is invalid', (done)=>{
        var email = 'be.train.com';
        var password ='jo';
        request (app)
        .post ('/users')
        .send({email,password})
        .expect(400)
        .end(done)
    });

    it ('should not create a user if email is in use', (done)=>{
        var email=seedUsers[0].email;
        var password='dingus5266'
        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done)
    });

});