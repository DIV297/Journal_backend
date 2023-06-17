const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Divanshisgoodprogrammer'
const fetchuser =(request, response, next)=>{
    // to convert auth token into user details
    const token = request.header('auth-token');
    if(!token){
        response.status(401).send({error:"Please authenticate using adfs valid token"})
    }
    try{ 
        const data = jwt.verify(token, JWT_SECRET);
        request.user= data.user;
        next()
    }catch(error){
       return response.status(401).send({error:"Please authenticate using a valid tokennn"})
    }
}

module.exports = fetchuser;