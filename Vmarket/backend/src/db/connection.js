const mongoose = require('mongoose');

const db = 'mongodb://localhost:27017/login';

const dbon = 'mongodb+srv://bhushan:resell-123@cluster0.ifjmf0v.mongodb.net/Login?retryWrites=true&w=majority';

mongoose.connect(dbon,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
}).then(() => {
console.log(`connection successful`);
}).catch((e) => {
    console.log(`connection failed ${e}`);
})
