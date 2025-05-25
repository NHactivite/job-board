
const { default: mongoose } = require("mongoose");

const PlanSchema=new mongoose.Schema({
    heading:String,
    price:Number,
    type:String,
})

const Plan=mongoose.models.Plan || mongoose.model("Plan",PlanSchema);

export default Plan;