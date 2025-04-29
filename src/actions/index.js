"use server"

import Application from "@/models/application";
import Job from "@/models/job";
const { default: ConnectDB } = require("@/database");
const { default: Profile } = require("@/models/profile");
import { revalidatePath } from "next/cache";

import { Cashfree} from "cashfree-pg";

import { GoogleGenerativeAI } from "@google/generative-ai"        
import { NextResponse } from "next/server";
// Your Gemini API key
const GEMINI_API_KEY = process.env.GIMINI_API_KEY;

// Initialize the Gemini model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


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
   const {recruiterUserId,name,jobAppliedDate,email,_id,candidateUserId,status,jobId,interviewDate}=data;
  
     await Application.findOneAndUpdate({
      _id:_id
     },{
      recruiterUserId,name,jobAppliedDate,email,candidateUserId,status,jobId,interviewDate
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

async function normalizeJobTitle(title) {
  const prompt = `Convert the following into a professional, standardized job title (no extra words): "${title}"`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// Use Gemini to find the closest matching title from DB
async function findClosestJobTitle(normalizedTitle, storedTitles) {
  const prompt = `
Given the normalized job title: "${normalizedTitle}"
And the following list of stored job titles: ${storedTitles.map(t => `"${t}"`).join(", ")}

Which one from the list best matches the normalized title? Just return the best match. If none match, say "none".
`;
  const result = await model.generateContent(prompt);
  const match = result.response.text().trim().toLowerCase();

  if (match === "none") return null;

  return match;
}
// AI-based greeting detection
async function isGreeting(text) {
  const prompt = `Is the following message a greeting? Just answer "yes" or "no": "${text}"`;
  const result = await model.generateContent(prompt);
  const response = result.response.text().trim().toLowerCase();
  return response === "yes";
}


export const searchJob = async (title) => {
  await ConnectDB();
  try {
    if (!title) {
      return res.status(400).json({ error: "Job title is required" });
    }
     // Use AI to check if input is a greeting
     const isGreet = await isGreeting(title);
     
     if (isGreet) {
       
       return { message: `Hello! How can I assist you with your job search today?` };
     }

    // Normalize user input
    const normalizedTitle = await normalizeJobTitle(title);

    // Get all stored titles
    const jobs = await Job.find({}, "title skills");
    const storedTitles =  jobs.map(job => job.title.toLowerCase())
    
    // Let Gemini pick the closest match
    const closestMatch =storedTitles.length === 0?false:  await findClosestJobTitle(normalizedTitle, storedTitles)
   
    let response = {
      available: false,
      skills: ""
    };

    if (closestMatch) {
      const matchedJob = jobs.find(job => job.title.toLowerCase() === closestMatch);
      response = {
        available: true,
        skills: matchedJob?.skills || ""
      };
    } else {
      // Use AI to generate skills
      const skillPrompt = `Given the job title "${normalizedTitle}", provide a concise list of 3-5 key skills required in 3-5 lines max. List skills only, no explanations.`;
      const result = await model.generateContent(skillPrompt);
      const generatedSkills = result.response.text().trim();

      response = {
        available: false,
        skills: generatedSkills
      };
    }
  
    // res.json({ result: response });
    return JSON.parse(JSON.stringify(response));

  } catch (error) {
    console.error("Error:", error);
    // res.status(500).json({ error: "Something went wrong" });
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
};


// export const setDate=async(data)=>{
//   await ConnectDB();
//   try{
//     const { _id,interviewDate}=data;
//   await Application.findOneAndUpdate({
//     _id:_id
//   },{
//     interviewDate:interviewDate
//   },{new:true})
//   }catch(error){
//     console.log(error)
//     return { success: false,error:error.message}
//   }
// }