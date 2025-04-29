"use client"

import { useState } from "react";
import CommonCard from "../common-card";
import JobApplicant from "../job-applicants";
import { Button } from "../ui/button";


const RecruiterJobCard = ({jobItem,jobApplication}) => {
   
  const [showApplicantsDrawer,setShowApplicantsDrawer]=useState(false);
  const [currentCandidateDetails,setCurrentCandidateDetails]=useState(null);

  const [showCurrentCandidateDetailsModel,setShowCurrentCandidateDetailsModel]=useState(false)
  
  let btnDisabled=jobApplication.filter(item=>item.jobId===jobItem._id).length
  
     
  return (
    <div>
         <CommonCard
         title={jobItem.title}
         skills={jobItem.skills}
         location={jobItem.location}
         footerContent={
          <Button disabled={btnDisabled===0} onClick={()=>setShowApplicantsDrawer(true)}  className=" flex h-11 items-center justify-center px-5">
            {
              btnDisabled>0?`${btnDisabled} Applicants`:"No Applicants"
            }
            </Button>
         }
         />
         <JobApplicant
           showApplicantsDrawer={showApplicantsDrawer}
           setShowApplicantsDrawer={setShowApplicantsDrawer}
           currentCandidateDetails={currentCandidateDetails}
           setCurrentCandidateDetails={setCurrentCandidateDetails}
           showCurrentCandidateDetailsModel={showCurrentCandidateDetailsModel}
           setShowCurrentCandidateDetailsModel={setShowCurrentCandidateDetailsModel}
           jobItem={jobItem}
           jobApplication={jobApplication.filter(item=>item.jobId===jobItem?._id)}
         />   
    </div>
  )
}

export default RecruiterJobCard;