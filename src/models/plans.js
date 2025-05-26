
const { default: mongoose } = require("mongoose");

const PlanSchema=new mongoose.Schema({
    heading:String,
    job:String,
    price:Number,
    type:String,
    month:String,
   
})

const Plan=mongoose.models.Plan || mongoose.model("Plan",PlanSchema);

export default Plan;