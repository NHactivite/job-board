const { default: mongoose } = require("mongoose");

const ApplicationSchema= new mongoose.Schema({
    recruiterUserId:String,
    name:String,
    email:String,
    candidateUserId:String,
    status:Array,
    jobId:String,
    jobAppliedDate:String,
    interviewDate:{
        type:Date,
        default:""
    }
})

const Application=mongoose.models.Application || mongoose.model("Application",ApplicationSchema);

export default Application;