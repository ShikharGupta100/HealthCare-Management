const mongoose = require("mongoose")

const connectToDB = async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI)
       console.log("MONGODB connected successfully");
    }catch(err){
        console.log("MONGODB connection error :",err.message);
        process.exit(1);
        
    }
}
module.exports = connectToDB;