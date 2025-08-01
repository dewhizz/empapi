// require mongoose
const mongoose=require('mongoose')

// define the schema
const Schema=mongoose.Schema

// users schema
const userSchema=new Schema({
    name:String,
    email:{type:String,required:true,unique:true},
    dob:{type:Date,default:Date.now},
    password:{type:String,required:true},
    photo:String
})

// employees schema
const employeeSchema=new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User',default:null},
    firstName:{type:String},
    lastName:{type:String},
    email:{type:String,required:true,unique:true},
    departmentId:{type:Schema.Types.ObjectId, ref:'Department',required:true},
    jobTitile:{type:String},
    hireDate:{type:Date},
    salary:{type:Number},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}

})

// department schema
const departmentSchema= new Schema({
    name:{type:String, required:true},
    description:{type:String},
    managerId:{type:Schema.Types.ObjectId, ref:'Employee',default:null},
    createdAt:{type:Date, default:Date.now}
})

const User = mongoose.model('User',userSchema)
const Employee=mongoose.model('Employee',employeeSchema)
const Department=mongoose.model('Department',departmentSchema)

// exporting schema
module.exports={User,Department,Employee}