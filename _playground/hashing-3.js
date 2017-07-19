const bcrypt = require('bcryptjs');

var password = '123abc';

bcrypt.genSalt(10, (err,salt)=>{
    bcrypt.hash(password, salt, (err, hash)=>{
        console.log(hash)
    })
})

var hashedPassword = '$2a$10$E3xPtHAGBbM4Lamehxhmu.r/sc5Usy1Rvx2npqMZYsGcMRW11DFDO';

bcrypt.compare(password, hashedPassword, (err,res)=>{
    console.log(res)
});