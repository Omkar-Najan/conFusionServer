const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

const Leaders = require('../models/leaders');
const mongoose = require('mongoose');


const authenticate = require('../authenticate')

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyuser,(req, res, next) => {
    Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyuser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyuser,(req, res, next) => {
    Leaders.remove({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err)=> next(err))
    .catch((err)=>next(err));
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyuser,(req, res, next) => {
res.statusCode = 403;
res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put(authenticate.verifyuser,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err)=> next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyuser,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=> next(err))
    .catch((err)=>next(err));
});


module.exports = leaderRouter;