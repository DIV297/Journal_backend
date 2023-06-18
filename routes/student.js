const express = require('express')
const router = express.Router()
const Student =require('../modals/Student')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const {body, validationResult} = require('express-validator');
const Journal = require('../modals/Journal');
const JWT_SECRET = 'Divanshisgoodprogrammer'

router.post('/addstudent',
[
body('name','Enter valid name').isLength({min:5}),
body('password').isLength({min:5}),
body('email').isEmail()],
async (req,res)=>{
  let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });//eroor1
    }
    try{
  
    let user = await Student.findOne({email: req.body.email});
    if(user){
      return res.status(400).send({success,error:'Sorry a user with this email already exists'})//errr2
    }
    const salt = await bcrypt.genSalt(10)
    const secPass= await bcrypt.hash(req.body.password, salt)
    user=await Student.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
      // Authentication token given to new user
      const data={
        user:{
          id:user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET)
      success=true;
      console.log(user)
      
      res.send({success,authtoken})
      } catch(error){
        console.log(error.message)
        res.status(500).send('Some error  occured');
      }
      
})
router.post('/loginstudent',[
        body('password','password cannot be empty').exists(),
        body('email','enter valid email').isEmail()],
        async (req,res)=>{
          let success=false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).send({ errors: errors.array() });
            }
            const {email,password}=req.body
            try{
              let user = await Student.findOne({email});
              if(!user){
                return res.status(400).send({success,error:'Please login to correct crudentials'})
              }
              const passwordCompare = await bcrypt.compare(password,user.password)
              if(!passwordCompare){
                return res.status(400).send({success,error:'Please login to correct crudentials'})
              }
              const data={
                user:{
                  id:user.id
                }
              }
              const authtoken = jwt.sign(data,JWT_SECRET)
              success=true;
              res.send({success,authtoken})
            }catch(error){
              console.log(error.message)
              res.status(500).send('internal Server Error')
            }
            })
  router.post('/getstudentdetails',fetchuser, async(req,res)=>{
    try{
      userId = req.user.id;
      
      const user = await Student.findById(userId).select("-password")
       res.send(user)
    }catch(error){
      console.error(error.message);
      res.status(401).send('Internal Server Error');
    }
  })

  router.post('/displaytaggedjournal',fetchuser, async(req,res)=>{
    try{
      userId = req.user.id;
      const user = await Student.findById(userId).select("-password")
      console.log(user.name);
      const journals = await Journal.find({tag:user.name,date:{$lte: new Date()}});
      res.send(journals);
    }catch(error){
      console.error(error.message);
      res.status(401).send('Internal Server Error');
    }
  })
module.exports = router 