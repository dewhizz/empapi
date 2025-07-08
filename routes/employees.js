const express = require("express");
const router = express.Router();

const { Employee, Department } = require("../models/model");
const auth = require("../middleware/auth");
router.post("/", auth, async (req, res) => {
  try {
    const { email, departmentId } = req.body;
    // checking if the employee already exists
    const existEmp = await Employee.findOne({ email });
    if (existEmp) return res.json({ message: "employee email exists" });
    // check if the department exist
    const existDept = await Department.findById(departmentId);
    if (!existDept)
      return res.status(404).json({ message: "department not found" });

    // saving the employee
    console.log(req.user.id, req.user.exp)
    const employee = new Employee({ ...req.body, userId: req.user.id });
    const savedEmp = await employee.save();
    res.status(201).json(savedEmp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get all employees
router.get('/',auth,async(req,res)=>{
    try {
       const employee= await Employee.find()
       .populate('departmentId','name')
       .populate('userId','name') 
       res.json(employee)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// update
router.put('/:id',auth,async(req,res)=>{
    try {
        const {email,departmentId,salary}=req.body
        // check if the email exists
        const existsEmp= await Employee.findOne({email})
        if(!existsEmp) return res.status(404).json({message:'email not found'})

        const updatedEmp=await Employee.findByIdAndUpdate(req.params.id,{email,departmentId,salary,updatedAt:Date.now()}, {new:true})
        res.json(updatedEmp)



    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
})

// delete
router.delete('/:id',async (req,res) => {
  try {
    const deleteEmp= await Employee.findByIdAndDelete(req.params.id)
    // check if the employee exists
    if(!deleteEmp) return res.status(404).json({message:"employee not found"})
      res.json({message:'employee deleted successfully'})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})
// export
module.exports=router
