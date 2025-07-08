const express=require('express')
const router=express.Router()
const {User}=require('../models/model')
const bcrypt=require('bcryptjs')
const auth=require('../middleware/auth')

// view all users
router.get('/',auth,async(req,res)=>{
    try {
        const users=await User.find()
        res.json(users)
    } catch (error) {
      res.status(500).json({message:error.message})  
    }
})

// get one user
router.get('/:id',async(req,res)=>{
  try {
    const user=await User.findById(req.params.id)
    if(!user){
      return res.status(404).json({message:'user not found'})
    }
    res.json(user)
  } catch (error) {
    res.status(400).json({message:error.message})
  }
})

// update a user
router.put('/:id',async(req,res)=>{
  try {
    const {name,email,password}=req.body
    // checking if the user we are updating exists
    const user=await User.findById(req.params.id)
    console.log(user)
    if(!user)return res.status(404).json({message:'user not found'})
      // prepare the data that we will update with
    let updateData={name,email}
    if(password){
      const salt =await bcrypt.genSalt(10)
      const hashedPassword=await bcrypt.hash(password,salt)
      updateData.password=hashedPassword
  
    }
    // update the user
    const updatedUser=await User.findByIdAndUpdate(req.params.id,updateData,{new:true})
    res.status(201).json(updatedUser)

  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

// delete the user
router.delete('/:id',auth,async(req,res)=>{
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    // check the person you are deleting exists
    if (!deleteUser) {
      return res.status(404).json({ message: "user not found" });
    }
    // if user is found
    res.json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

// export router
module.exports=router