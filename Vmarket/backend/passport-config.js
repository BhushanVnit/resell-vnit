const LocalStrategy = require('passport-local').Strategy;
const Register = require('./src/models/registration');
const bcrypt = require('bcrypt');


exports.initializingPassport = (passport) => {

    passport.use(new LocalStrategy(
        function (email, password, done) {
            Register.findOne({ email: email }, function (err, user) {
                if (err) { console.log(err); return done(err); }
                if (!user) { console.log('NO user found'); return done(null, false); }
                if (user.password !== password) { 
                    console.log(user.password);
                    return done(null, false); }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((user, done) => {
        try{
            const user = Register.findById(id);
            return done(null, user);
        }
        catch(err){
            console.log(err);
            return done(err,false);
        }
    });
};
exports.isAuthenticated = (req, res, next) =>{
    if (req.user) {
        return next();
    }
    res.redirect('/login');
}