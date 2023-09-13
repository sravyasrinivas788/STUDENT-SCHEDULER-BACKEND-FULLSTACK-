// Connecting to moongose
const mongoose=require("mongoose");

const mongoURL="mongodb://127.0.0.1:27017/games";

const connecttoMongo=()=>{
    mongoose.connect(mongoURL,()=>{
        console.log("Successfully connected to mongoDB");
    })
}

module.exports=connecttoMongo;