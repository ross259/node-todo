const mongoose = require('mongoose');

var User = mongoose.model('User',{
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:1
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
})

module.exports = {User}