"use server"

import Application from "@/models/application";
import Job from "@/models/job";
const { default: ConnectDB } = require("@/database");
const { default: Profile } = require("@/models/profile");
import { revalidatePath } from "next/cache";

import { Cashfree} from "cashfree-pg";

// Initialize Cashfree with your credentials
Cashfree.XClientId = process.env.CLIENT_ID
Cashfree.XClientSecret = process.env.CLIENT_SECRET
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX
// crete profile action


export const createProfileAction=async(formData,pathToRevalidate)=>{
     await ConnectDB();
     
     await Profile.create(formData);
     revalidatePath(pathToRevalidate);
}

export const fetchProfileAction=async(id)=>{
    await ConnectDB();
    const result=Profile.findOne({userId:id}).lean()
    return result
}

// create job action

export async function postNewJobAction({formData,pathToRevalidate}){
    await ConnectDB();
    await Job.create(formData);
    revalidatePath(pathToRevalidate)
}

// fetch job action

// recruiter

export async function fetchJobsForRecruiterAction(id){
 
  await ConnectDB();
  const result=await Job.find({recruiterId:id})
  return JSON.parse(JSON.stringify(result))
}

// candidate 


export async function fetchJobsForCandidateAction(filterParams={}){
  await ConnectDB();

  let updatedParams={};
  Object.keys(filterParams).forEach(filterKey=>{
    updatedParams[filterKey]={$in:filterParams[filterKey].split(",")}
  })
  
  const result=await Job.find(filterParams &&  Object.keys(filterParams).length>0?updatedParams:{})
  return JSON.parse(JSON.stringify(result))
}

// create job application

export async function createJobApplicationAction(data,pathToRevalidate){
    await ConnectDB();
    await Application.create(data);
    revalidatePath(pathToRevalidate)
} 

// fetch job application for candidate

export async function fetchJobApplicationForCandidate(candidateId){
  await ConnectDB();
  const result=await Application.find({candidateUserId:candidateId})
 
  return JSON.parse(JSON.stringify(result))
}
// fetch job application for candidate

export async function fetchJobApplicationForRecruiter(recruiterId){
  await ConnectDB();
  const result=await Application.find({recruiterUserId:recruiterId})
  return JSON.parse(JSON.stringify(result))
}


//get candidate details by CandidateId

export  const getCandidateDetailsByIdAction=async(candidateId)=>{
   await ConnectDB();
   const result=await Profile.findOne({userId:candidateId})
   return JSON.parse(JSON.stringify(result))
}

// update job-Application

export async function updateJobApplication(data,pathToRevalidate){
  await ConnectDB();
   const {recruiterUserId,name,jobAppliedDate,email,_id,candidateUserId,status,jobId}=data;
     await Application.findOneAndUpdate({
      _id:_id
     },{
      recruiterUserId,name,jobAppliedDate,email,candidateUserId,status,jobId
     },{
      new:true
     })
     revalidatePath(pathToRevalidate)
}


// filer actions

export async function createFilterCategoryAction(){
  await ConnectDB();
  const result=await Job.find({});

  return JSON.parse(JSON.stringify(result))
}

// update profile data

export async function updateProfileAction(data,pathToRevalidate){
  await ConnectDB();
  const { _id,candidateInfo,recruiterInfo,isPremiumUser,role,userId,email}=data;

  await Profile.findOneAndUpdate({
    _id:_id
  },{
    recruiterInfo,candidateInfo,isPremiumUser,role,userId,email
  },{new:true});
   revalidatePath(pathToRevalidate)
}


export async function createPaymentAction(data) {
  const { amount, customer_id, customer_email } = data;

  const request = {
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: customer_id,
      customer_phone:"9999999999", // Use a dummy email for sandbox
      customer_email: customer_email, 
    },
    order_id: `order_${Date.now()}`,
  };

  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    return response.data; // Return the data to the caller
  } catch (error) {
    console.error("Error setting up order request:", error?.response?.data || error);
    throw error; // Propagate error for better handling in the caller
  }
}

export const paymentVerify = async (order_id) => {
  try {
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", order_id);
    return response.data; // Ensure data is returned
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error; // Re-throw the error to handle it upstream
  }
};

export async function createOrderAction(data,pathToRevalidate){
  try {
    await ConnectDB();
    const { _id,candidateInfo,recruiterInfo,isPremiumUser,role,userId,email,memberShipType,memberShipStartDate,memberShipEndDate}=data;
  
    await Profile.findOneAndUpdate({
      _id:_id
    },{
      recruiterInfo,candidateInfo,isPremiumUser,role,userId,email,memberShipType,memberShipStartDate,memberShipEndDate
    },{new:true});
     revalidatePath(pathToRevalidate)

  } catch (error) {
    throw error
  }
}


