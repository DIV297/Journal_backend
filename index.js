const connectToMongo = require("./db");
const express = require('express');
// const cors = require('cors');
const app = express();
// app.use(cors());
const Journal = require('./modals/Journal');
app.use(express.json())
app.use('/auth/student',require("./routes/student"));
app.use('/auth/teacher',require("./routes/teacher"));
app.get('/',(req,res)=>{
    console.log("hello");
    res.send("hello")
})
app.post('/post',async(req,res)=>{
    try{
    let center = await Journal.find();

    res.send(center);
    }
    catch(error){
        res.status(500).json(error);
    }
})
app.listen(5000);
connectToMongo