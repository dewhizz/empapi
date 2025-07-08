// regestration & log in
const express=require('express')
const router=express.Router()
const {User}=require('../models/model')

// we require path to show where the file will be stored
// we require fs to create a new file
const path = require('path')
const fs=require('fs')

// importing jsonwebtoken that will be used in authentication
const jwt=require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET


// bcryptjs is used for hashing our password
const bcrypt=require('bcryptjs')
// needed to handle files
const multer=require('multer')
const { error } = require('console')

// storage location
const upload=multer({dest:'uploads/'})

// regester
router.post('/register',upload.single('photo'),async(req,res)=>{
    try {
       const {name,email,password}=req.body
    //    check if the user exsists by the email
    const existUser=await User.findOne({email})
    if(existUser){
       return res.status(400).json({message:'email exists'})
    }

    // hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    console.log(hashedPassword)

    // declare a null variable
    let photo=null
    // checking if our request has any file
    if(req.file){
        const ext=path.extname(req.file.originalname) // extracts the extention of the file
        const newFilename=Date.now()+ext
        const newPath=path.join('uploads',newFilename)
        fs.renameSync(req.file.path,newPath)
        photo=newPath.replace(/\\/g,'/')
    }

    const user=new User({name,email,password:hashedPassword,photo})
    const savedUser=await user.save()
       console.log(name,email,password)
       console.log(Date.now());
        res.status(201).json(savedUser) 
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

// login
router.post('/login',async (req,res)=>{
    const{email,password}=req.body
    console.log(email,password)
    try {
        const user=await User.findOne({email})
        // check if the user exists in the db
        if(!user){
            return res.status(404).json({message:'Wrong credentials'})
        }
        // if the user exists then we check the password
        const valid=await bcrypt.compare(password,user.password)
        if(!valid){
            return res.status(400).json({message:'wrong credentials'})
        }
        // generate token for the log in user
        const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'1h'})
        console.log(token)
        res.status(200).json({user,token})

    } catch (error) {
       res.status(400).json({ message: error.message }); 
    }
})


module.exports=router