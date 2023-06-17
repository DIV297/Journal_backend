const mongoose = require('mongoose')
const { Schema } = mongoose;

const JournalSchema = new  Schema({
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('journals',JournalSchema)