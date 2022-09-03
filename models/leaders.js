const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose); // defines new currency type in mongoose.

const leaderSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    image : {
        type: String,
        required: true
    },
    abbr:{
        type:String,
        required : true
    },
    designation : {
        type: String,
        default : ''
    },
   
    featured:{
        type: Boolean,
        default:false
    }
},{
    timestamps:true
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;