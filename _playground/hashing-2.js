const jwt = require('jsonwebtoken');

var data = {
    id:10
};

var token = jwt.sign(data, 'abc-123');
console.log(token);

var decoded = jwt.verify(token, 'abc-123');
console.log('Decoded:',decoded);