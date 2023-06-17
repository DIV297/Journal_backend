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
router.post('/addteacher',
[
body('name','Enter valid name').isLength({min:5}),
body('password').isLength({min:5}),
body('email').isEmail()],
async (req,res)=>{
  let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });//eroor1
    }
    try{
    let user = await Teacher.findOne({email: req.body.email});
    console.log(user)
    if(user){
      return res.status(400).json({success,error:'Sorry a user with this email already exists'})//errr2
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
      
      res.json({success,authtoken})
      } catch(error){
        console.log(error.message)
        res.status(500).send('Some error  occured');
      }
})

router.post('/loginteacher',[
        body('password','password cannot be empty').exists(),
        body('email','enter valid email').isEmail()],
        async (req,res)=>{
          let success=false;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array()});
            }
            const {email,password}=req.body
            try{
              let user = await Teacher.findOne({email});
              if(!user){
                return res.status(400).json({success,error:'Please login to correct crudentials'})
              }
              const passwordCompare = await bcrypt.compare(password,user.password)
              if(!passwordCompare){
                return res.status(400).json({success,error:'Please login to correct crudentials'})
              }
              const data={
                user:{
                  id:user.id
                }
              }
              const authtoken = jwt.sign(data,JWT_SECRET)
              success=true;
              res.json({success,authtoken})
            }catch(error){
              console.log(error.message)
              res.status(500).send('internal Server Error')
            }
    })
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
],async (request,response)=>{
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({error:errors.array()})
    }
    try{
        await Journal.create(
            {
                description:request.body.description,
                tag:request.body.tag,
                date:new Date(request.body.date)
            }
        )
        response.json({msg:"Journal added"})
    } 
    catch(error){
        response.status(500).json(error);
    }
    
})

//removing journal
router.delete("/deletejournal/:id",async (request,response)=>{
    try{
        let center =await Jouranl.findById(request.params.id);
        if(!center){
            return response.status(400).json({message:"no such journal exists"});
        }
        console.log(center.id);
        await Journal.findByIdAndDelete(request.params.id);
    }
    catch(error){
        response.status(500).json(error);
    }
    response.json({msg:"Journal deleted"});
})

//displayalljournals
  router.post('/displayalljournals',async (request,response)=>{
    try{
    let center = await Journal.find();

    response.json(center);
    }
    catch(error){
        response.status(500).json(error);
    }
})
module.exports = router 