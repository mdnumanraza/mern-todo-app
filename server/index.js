const express = require('express');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const router = require('./router');
//  other packages 
const cors = require("cors");
const morgan = require("morgan");

// config .env file  always keep .env above all since using variables from it
dotenv.config();
const MONGO_URL = mongodb+srv://numan71417:numan@cluster0.yzcfbgx.mongodb.net/todo-app
// rest object 
const app = express();

const port =  process.env.PORT || 8080 

//  database calling
const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log(`server running on: ${mongoose.connection.host}`);
    } catch (e) {
        console.log(" error: ", e );
    }
}
connectDb();

// middle wares 
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })

//routes
app.use('/api/v1/todos', router)

app.listen(port, ()=>{
    console.log(`server running on port: ${port}`);
})
