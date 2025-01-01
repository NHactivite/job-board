const { default: mongoose } = require("mongoose");


const ProfileSchema=new mongoose.Schema({
    userId:String,
    role:String,
    email:String,
    isPremiumUser:Boolean,
    memberShipType:String,
    memberShipStartDate:String,
    memberShipEndDate:String,
    recruiterInfo:{
        name:String,
        companyName:String,
        companyRole:String
    },
    candidateInfo:{
        name:String,
        resume:String,
        currentCompanyName:String,
        currentSalary:String,
        currentJobLocation:String,
        preferedJobLocation:String,
        previousCompanies:String,
        noticePeriod:String,
        skills:String,
        linkedinProfile:String,
        githubProfile:String,
        graduatedYear:String,
        collegeLocation:String,
        college:String,
        totalExperience:String,
        collegeLocation:String,
    },
})

const Profile=mongoose.models.Profile || mongoose.model("Profile",ProfileSchema);

export default Profile;