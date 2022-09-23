const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens:[{ 
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    try{
        const token = jwt.sign({_id: this._id}, "mynameisbhushanravindrabahaleandiamstudentofvnit");
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;
    } catch (e) {
        console.log(e.msg);
    }
}

userSchema.pre('save', async function(next){

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
   next();
})
const Register = new mongoose.model('Register', userSchema);

module.exports = Register;