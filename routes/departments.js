const express = require("express");
const router = express.Router();
const { Department, Employee } = require("../models/model");
const auth = require("../middleware/auth");

// creating a new department
router.post("/", auth, async (req, res) => {
  try {
    // destructuring
    const { name, description } = req.body;
    const department = new Department({ name, description });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// get all departments
router.get("/", auth, async (req, res) => {
  try {
    const departments = await Department.find().populate(
      "managerId",
      "firstName lastName"
    );
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// getting a specific user
router.get("/:id", auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("managerId","firstName lastName");
    if (!department)
      return res.status(404).json({ message: "department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update department
router.put('/:id',auth,async(req,res)=>{
    try {
        // destructuring
        const{name,description,managerId}=req.body
        // const managerExists=await Employee.findById(managerId)
        //if(!managerExists) return res.status(400).json({message:'manager not found'})
            const department=await Department.findByIdAndUpdate(
                req.params.id,
                {name,description,managerId,updatedAt:Date.now()},
                {new:true}
            )
            // if the department you are updating does not exist
            if(!department) return res.status(404).json({message:'department not found'})
                res.json(department)
    } catch (error) {
       res.status(500).json({message:error.message}) 
    }
})

// deleting the 
router.delete('/:id',auth,async(req,res)=>{
    try {
       const department=await Department.findByIdAndDelete(req.params.id)
       if(!department)return res.status(404).json({message:error.message}) 
        res.json({message:'department deleted '})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
// export
module.exports = router;
