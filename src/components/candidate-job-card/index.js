"use client"

import { createJobApplicationAction } from "@/actions"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { Button } from "../ui/button"

const { Fragment, useState, useEffect } = require("react")
const { default: CommonCard } = require("../common-card")


export const CandidateJobCard=({jobItem,profileInfo,jobApplication})=>{
 const [showDetailsDrawer,setShowDetailsDrawer]=useState(false)
 const [applied,setApplied]=useState(null);
 const [count,setCount]=useState(0)

 useEffect(() => {
  // Calculate the count outside of the render phase
  const matchingCount = jobApplication?.reduce((acc, item) => {
    return item.candidateUserId === profileInfo?.userId ? acc + 1 : acc;
  }, 0);

  // Update the count state
  setCount(matchingCount);
}, [jobApplication, profileInfo]); 
 
 useEffect(()=>{
  jobApplication?.map((item)=>(
     (item.candidateUserId===profileInfo?.userId && item.jobId===jobItem._id)
     ?
       setApplied(true)
     :null
   
  
  ))
 },[showDetailsDrawer])
 
  async function handleJobApply(){
    await createJobApplicationAction(
    {  recruiterUserId:jobItem?.recruiterId,
      name:profileInfo?.candidateInfo?.name,
      email:profileInfo?.email,
      candidateUserId:profileInfo?.userId,
      status:["Applied"],
      jobId:jobItem._id,
      jobAppliedDate:new Date().toLocaleDateString()
    },"/jobs");
    setShowDetailsDrawer(false)
  }
  
 
  const BtnDisabled =
  profileInfo.memberShipType === "teams" && count === 10
    ? true
    : profileInfo.memberShipType === "basic" && count === 5
    ? true
    : !profileInfo.memberShipType && count === 2
    ? true
    : false;
    return(
        <Fragment>
            <Drawer open={showDetailsDrawer} onOpenChange={setShowDetailsDrawer}>
            <CommonCard
              title={jobItem.title}
              description={jobItem.companyName}
              footerContent={
               
                  <Button onClick={()=>setShowDetailsDrawer(true)} className=" flex h-11 items-center justify-center px-5">
                          View details
                  </Button>
                
              }
            />
            <DrawerContent className="p-6">
               <DrawerHeader className="px-0">
                  <div className="flex justify-between">
                     <DrawerTitle className="text-4xl font-extrabold text-gray-800">
                        {jobItem.title}
                     </DrawerTitle>
                    {
                      BtnDisabled && !applied?
                      <div>
                      <h1 className="text-xl font-bold mt-3 ">To Apply more jobs you need to to Upgrad your plan</h1>
                     </div>
                      :null
                    }
                     <div className="flex gap-3">
                       <Button disabled={applied || BtnDisabled} onClick={applied?null:handleJobApply} className=" flex h-11 items-center justify-center px-5 disabled:opacity-55">
                         {
                          applied?"Already applied":"Apply"
                          
                         }
                       </Button>
                       <Button className=" flex h-11 items-center justify-center px-5" onClick={()=>setShowDetailsDrawer(false)}>
                        X
                       </Button>
                     </div>
                  </div>
               </DrawerHeader>
               <DrawerDescription className="text-2xl font-medium text-gray-600">
                 </DrawerDescription>
                <div className="text-2xl mt-3 text-black">
                  Job location:
                <span className="text-xl ml-2 font-bold uppercase ">
                   {jobItem.location}
                 </span>
                </div>
               
               <div className="text-2xl mt-3 text-black">
                  Job Type:
                <span className="text-xl ml-2 font-bold uppercase ">
                   {jobItem.type}
                 </span>
                </div>
               <h3 className="text-2xl font-medium text-black mt-3">
                Experience: {jobItem.experience}
               </h3>
               
               <div className="flex gap-4 mt-6">
               <span className="text-2xl font-medium text-black">Skills:</span>
                  {
                    jobItem?.skills.split(",").map((item,idx)=>(
                      <div key={idx} className=" p-2 flex  justify-center items-center h-[35px] bg-black rounded-[4px]">
                         <h2 className="text-[13px] text-xl text-white">
                          {item}
                         </h2>
                      </div>
                    ))
                  }
               </div>
              <h3 className="text-2xl mt-3 text-black">
              Job Description: {jobItem.description} 
              </h3> 
            </DrawerContent>
            </Drawer>
            
        </Fragment>
    )
}