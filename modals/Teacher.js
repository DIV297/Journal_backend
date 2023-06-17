const mongoose = require('mongoose')
const { Schema } = mongoose;
const TeacherSchema = new  Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
});
const Teacher = mongoose.model('teachers',TeacherSchema);
module.exports=Teacher;