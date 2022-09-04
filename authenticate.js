var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

// create JWT 
var JwtStraegy =require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');

// for using sessions. 

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, 
        {expiresIn : 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStraegy(opts,
    (jwt_payload, done)=>{
        console.log("JWT Payload ", jwt_payload);
        User.findOne({_id : jwt_payload._id}, (err, user)=>{
            if(err){
                return done(err, false);
            }
            else if(user){
                return done(null,user);
            }else{
                return done(null, false);
            }
        });
}));

exports.verifyuser = passport.authenticate('jwt', {session: false});

exports.verifyadmin = function(user){
    if(req.user.admin){
        next();
    }else{
        var err = new Error('You are not authorized person to perform this operation!');
        next(err);
    }
}