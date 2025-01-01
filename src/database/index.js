import mongoose from "mongoose";


const ConnectDB=async()=>{
    const url="mongodb://localhost:27017/job-portal"
    mongoose.connect(url).then(()=>console.log("database Conntected")).catch((e)=>console.log(e))
}

export default ConnectDB;