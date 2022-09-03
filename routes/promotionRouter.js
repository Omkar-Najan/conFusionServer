const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

const authenticate = require('../authenticate')


// datavase connectivity
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
        .then((promos)=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promos)
        }, (err)=> next(err))
        .catch((err)=>next(err));
})
.post(authenticate.verifyuser,(req, res, next) => {
   Promotions.create(req.body)
   .then((promo)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promo)
   }, (err)=>next(err))
   .catch((err)=> next(err));
})
.put(authenticate.verifyuser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyuser,(req, res, next) => {
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>next(err))
    .catch((err)=>next(err));
});


promoRouter.route('/:promoId')
.get((req,res,next) => { // get specific promotion 
    Promotions.findById(req.params.promoId)
    .then((promo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyuser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put(authenticate.verifyuser,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set: req.body
    },{new:true})
    .then((promo)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyuser,(req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = promoRouter;