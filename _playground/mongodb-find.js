//const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

var obj = new ObjectID();
console.log (obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err){
        return console.log("Unable to connect to MongoDB Server.");
    }
    console.log('Connected to MongoDB server.');

    // db.collection('Todos').find({_id:new ObjectID("59366051d83641e9c61f59eb")}).toArray().then((docs)=>{
    //     console.log("Todos")
    //     console.log(JSON.stringify(docs, undefined, 2));
    // },(err)=>{
    //     if(err){
    //         return console.log("Unable to fetch todos", err)
    //     }
    // });

    db.collection('Todos').find().count().then((count)=>{
        console.log("Todos count:", count)
    },(err)=>{
        if(err){
            return console.log("Unable to fetch todos", err);
        }
    });

    db.collection('Users').find({name:"Ross"}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2))
    },(err)=>{
        if (err){
            return console.log("Unable to find any users with name Ross");
        }
    });

    //db.close();
});