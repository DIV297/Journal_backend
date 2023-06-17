const mongoose = require('mongoose')
const connectToMongo=()=>{
mongoose.connect("mongodb+srv://divbajaj297:Divanshbajaj297$@cluster0.lwlgrra.mongodb.net/?retryWrites=true&w=majority/journal");
console.log("connected to db");
}
connectToMongo()
module.exports = connectToMongo;


