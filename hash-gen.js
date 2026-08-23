const bcrypt = require('bcryptjs');
const password = 'ChangeMeNow123!';
const hash = bcrypt.hashSync(password, 10);
console.log('Bcrypt hash for "ChangeMeNow123!":', hash);
