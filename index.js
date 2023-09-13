const express=require("express");
const connecttoMongo=require("./db");
const cors = require('cors');
connecttoMongo();  //Connecting to mongo


const app=express();
const port=80;
app.use(cors())

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello,Welcome to task manager");
})

const auth=require('./routes/auth')
const lists=require("./routes/lists");
app.use('/auth',auth);
app.use('/lists',lists);


app.listen(port,()=>{
    console.log(`The express app is running on port ${port}`);
})
