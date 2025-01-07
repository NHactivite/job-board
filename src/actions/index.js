"use server"

import Application from "@/models/application";
import Job from "@/models/job";
import { func } from "joi";

const { default: ConnectDB } = require("@/database");
const { default: Profile } = require("@/models/profile");
import { revalidatePath } from "next/cache";


// crete profile action


export const createProfileAction=async(formData,pathToRevalidate)=>{
     await ConnectDB();
     console.log(formData);
     
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
  const { _id,candidateInfo,isPremiumUser,role,userId,email}=data;

  await Profile.findOneAndUpdate({
    _id:_id
  },{
    candidateInfo,isPremiumUser,role,userId,email
  },{new:true});
   revalidatePath(pathToRevalidate)
}