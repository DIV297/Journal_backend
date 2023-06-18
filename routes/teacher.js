const express = require('express')
const router = express.Router()
const Teacher =require('../modals/Teacher')
const Jouranl = require('../modals/Journal')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
const {body, validationResult} = require('express-validator');
const Journal = require('../modals/Journal');
const JWT_SECRET = 'Divanshisgoodprogrammer'

//addTecher
router.post('/addteacher',
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
    let user = await Teacher.findOne({email: req.body.email});
    console.log(user)
    if(user){
      return res.status(400).send({success,error:'Sorry a user with this email already exists'})//errr2
    }
    const salt = await bcrypt.genSalt(10)
    const secPass= await bcrypt.hash(req.body.password, salt)
    user=await Teacher.create({
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
      console.log('done')
      const authtoken = jwt.sign(data,JWT_SECRET)
      success=true;
      console.log(user)

      res.send({success,authtoken})
      } catch(error){
        console.log(error.message)
        res.status(500).send('Some error  occured');
      }
})
//LoginTeacher
router.post('/loginteacher',[
        body('password','password cannot be empty').exists(),
        body('email','enter valid email').isEmail()],
        async (req,res)=>{
          let success=false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).send({ errors: errors.array()});
            }
            const {email,password}=req.body
            try{
              let user = await Teacher.findOne({email});
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

//GetTeacher
router.post('/getteacherdetails',fetchuser, async(req,res)=>{
    try{
      userId = req.user.id;
      const user = await Teacher.findById(userId).select("-password")
      res.send(user)
    }catch(error){
      console.error(error.message);
      res.status(401).send('Internal Server Error');
    }
  })


//adding journal
router.post('/addjournal',[
  body('description','description should be atleast 1 character').isLength({min:1})
],fetchuser,async (request,response)=>{
  const errors = validationResult(request);
  if(!errors.isEmpty()){
      return response.status(400).json({error:errors.array()})
  }
  try{
    userId = request.user.id;
    const user = await Teacher.findById(userId).select("-password")
    console.log(user);
    if(user){
      await Journal.create(
          {
              description:request.body.description,
              tag:request.body.tag,
              date:new Date(request.body.date)
          }
      )
      response.json({msg:"Journal added"})
        }
        else{
          response.status(400).send({error:"Journals can be added by Teacher only"});
        }
  } 
  catch(error){
      response.status(500).json(error);
  }
  
})

//removing journal
router.delete("/deletejournal/:idi",fetchuser,async (request,response)=>{
  try{
      let center =await Jouranl.findById(request.params.idi);
      if(!center){
          return response.status(400).json({message:"no such journal exists"});
      }
      console.log(center.id);
      userId = request.user.id;
    const user = await Teacher.findById(userId).select("-password");
    if(user){
      await Journal.findByIdAndDelete(request.params.id);
      response.json({msg:"Journal deleted"});
    }
    else{
      response.status(400).send({error:"Journals can be deleted by Teacher only"})
    }
  }
  catch(error){
      response.status(500).json(error);
  }
  
})


//displayalljournals
  router.post('/displayalljournals',async (request,response)=>{
    try{
    let center = await Journal.find();
      console.log(center);
    response.send({center});
    }
    catch(error){
        response.status(500).send(error);
    }
})
module.exports = router 