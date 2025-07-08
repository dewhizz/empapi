const express=require('express')
const mongoose = require("mongoose");

// we need dotenv which has our configuration info
require('dotenv').config()
const app = express()


// middleware
app.use(express.json())

// we need to make files accesible
app.use('uploads',express.static('uploads'))

// routes
const auth=require('./routes/auth')
app.use('/api/emp',auth)

const user=require('./routes/user')
app.use('/api/emp',user)

const department=require('./routes/departments')
app.use('/api/department',department)

const employee = require('./routes/employees');
app.use("/api/employee", employee);

// connecting mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('MongoDB CONNECTED'))
    .catch(err=>console.log('MongoDB connection error',err))

// listening to the server
app.listen(3000,()=>{
    console.log('server running in port 3000')
})