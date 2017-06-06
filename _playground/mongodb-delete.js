//const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

var obj = new ObjectID();
console.log (obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err){
        return console.log("Unable to connect to MongoDB Server.");
    }
    console.log('Connected to MongoDB server.');

    // deleteMany
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text:'Walk the dog'}).then((result)=>{
    //     console.log(result);
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //     console.log(result);
    // })

    // db.collection('Users').deleteMany({name:'Mike'}).then((result)=>{
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id : new ObjectID("5936c0fcd83641e9c61f5d89")}).then((result)=>{
        console.log(result);
    })

    //db.close();
});