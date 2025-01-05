"use client"

import { candidateOnboardFRomControl, initialCandidateFromData, initialRecruiterFromData, recruiterOnboardFRomControl } from "@/utils";
import { useEffect, useState } from "react";
import CommonFrom from "../common-form";
import { createClient } from "@supabase/supabase-js";
const superbaseClient = createClient(
  "https://yschbhvplekqecqsuxrk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzY2hiaHZwbGVrcWVjcXN1eHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDI2OTksImV4cCI6MjA1MDg3ODY5OX0.NGS0j7VW3c0FnIE4KT97urpLtejhdToM9jpcs3w91Us"
);

function AccountInfo({profileInfo}){
    
    const [candidateFormData,setCandidateFromData]=useState(initialCandidateFromData);
    const [recruiterFormData,setRecruiterFromData]=useState(initialRecruiterFromData);
    const [view,setView]=useState(null)
    
    console.log(profileInfo,"lll");
    
 
    useEffect(()=>{
         
      if(profileInfo?.role==="recruiter") setRecruiterFromData(profileInfo.recruiterInfo)
      if(profileInfo?.role==="candidate")  {
        const { data } = superbaseClient.storage.from("job-board-public").getPublicUrl(profileInfo.candidateInfo.resume)
           setView(data)
        setCandidateFromData({
            ...profileInfo.candidateInfo,
            resume:data.publicUrl
        })
    }
    },[profileInfo]);
  
    return(
        <div className="mx-auto max-w-7xl">
             <div className="flex items-baseline justify-between pb-6 border-b pt-24">
                 <h1 className="text-4xl font-bold tracking-tight text-gray-950">Account details</h1>
             </div>
             <div className="py-20 pb-24  pt-6">
                <div className="container mx-auto p-0 space-y-8 ">
                    <CommonFrom
                     formControls={
                        profileInfo?.role==="candidate"?candidateOnboardFRomControl: recruiterOnboardFRomControl
                     }
                     formData={profileInfo?.role==="candidate"?candidateFormData: recruiterFormData}
                     buttonText="Update"
                     setFormData={profileInfo?.role==="candidate"?setCandidateFromData:""}
                    /> 
                </div>
             </div>
        </div>
    )
}

export default AccountInfo;