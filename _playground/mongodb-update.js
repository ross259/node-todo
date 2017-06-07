//const MongoClient = require ('mongodb').MongoClient;
const {MongoClient, ObjectID} = require ('mongodb');

var obj = new ObjectID();
console.log (obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {
    if (err){
        return console.log("Unable to connect to MongoDB Server.");
    }
    console.log('Connected to MongoDB server.');

    // db.collection("Todos").findOneAndUpdate({
    //     _id:new ObjectID("5936bdf5d83641e9c61f5cb5")
    // },{
    //     $set : {
    //         completed:true
    //     }
    // },{
    //     returnOriginal:false
    // }).then((result)=>{
    //     console.log(result);
    // });

    db.collection("Users").findOneAndUpdate({
        _id:new ObjectID("5936c0f2d83641e9c61f5d85")
    },{
        $set:{name:"Ross"},
        $inc:{age:1}
    },{
        returnOriginal:false
    }).then((result=>{
        console.log(result);
    }))

    //db.close();
});