"use client"

import { candidateOnboardFRomControl, initialCandidateFromData, initialRecruiterFromData, recruiterOnboardFRomControl } from "@/utils";
import { useEffect, useState } from "react";
import CommonFrom from "../common-form";
import { createClient } from "@supabase/supabase-js";
import { updateProfileAction } from "@/actions";
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
function AccountInfo({profileInfo}){
    
    const [candidateFormData,setCandidateFromData]=useState(initialCandidateFromData);
    const [recruiterFormData,setRecruiterFromData]=useState(initialRecruiterFromData);
    const [view,setView]=useState(false)
    const [hasViewChanged, setHasViewChanged] = useState(false);
    const [file, setFile] = useState(null);
    
    useEffect(()=>{
      window.scrollTo(0, 0);
        if(profileInfo?.role==="recruiter") setRecruiterFromData(profileInfo.recruiterInfo)
          if(profileInfo?.role==="candidate")  {
            const { data } = supabaseClient.storage.from("job-board-public").getPublicUrl(profileInfo.candidateInfo.resume)
            setCandidateFromData({
                ...profileInfo.candidateInfo,
                resume:data.publicUrl
            })
          }

    },[profileInfo]);

useEffect(() => {
  if (hasViewChanged) {
    handleUpdateResume()
    setHasViewChanged(false)
    setView(false)
  } else{
    setHasViewChanged(true)
  }
}, [view]); 

    const handleFileChange = (event) => {
        event.preventDefault();
        setFile(event.target.files[0]);
      };
    

    const handleUploadPdfToSuperbase = async () => {
        const sanitizedFileName = file.name.replace(/\s+/g, "_");
        const { data } = await supabaseClient.storage
          .from("job-board-public")
          .upload(`${sanitizedFileName}_${profileInfo.userId}`,file,
            {
              cacheControl:"3600",
              upsert:false
            }
          );
          
          if(data){ 
            setCandidateFromData((prevState) => ({
              ...prevState,
              resume: data.path,
            }));
            setView(true)
              }   
      };
    const uploadFile=async(e)=>{
        e.preventDefault();
    
       const sanitizedFileName = (profileInfo.candidateInfo.resume).split("/").pop();
         const { data } = await supabaseClient
         .storage
         .from('job-board-public') // Specify the bucket name
         .remove(sanitizedFileName); // Pass the path of the file to delete as an array
          
          if(data[0]?.name==sanitizedFileName){
            handleUploadPdfToSuperbase(); 
       }
       
     }
  
     
    const handleUpdateResume=async()=>{
       
        await updateProfileAction({
            _id:profileInfo?._id,
            candidateInfo:{
              ...profileInfo?.candidateInfo,
              resume:candidateFormData.resume
            },
            isPremiumUser:profileInfo?.isPremiumUser,
            role:profileInfo?.role,
            userId:profileInfo.userId,
            email:profileInfo?.email
          }
        ,"/account")
       
    }
    const handleUpdateAccount=async()=>{
        await updateProfileAction(profileInfo?.role==="candidate"?{
            _id:profileInfo?._id,
            isPremiumUser:profileInfo?.isPremiumUser,
            role:profileInfo?.role,
            userId:profileInfo.userId,
            email:profileInfo?.email
        }:{
            _id:profileInfo?._id,
            recruiterInfo:recruiterFormData,
            isPremiumUser:profileInfo?.isPremiumUser,
            role:profileInfo?.role,
            userId:profileInfo.userId,
            email:profileInfo?.email
        },"/account")
       
    }
  
    return(
        <div className="mx-auto max-w-7xl">
             <div className="flex items-baseline justify-between pb-6 border-b pt-24">
                 <h1 className="text-4xl font-bold tracking-tight text-gray-950">Account details</h1>
             </div>
             <div className="py-20 pb-24  pt-6">
                <div className="container mx-auto p-0 space-y-8 ">
                    <CommonFrom
                    handleFileChange={handleFileChange}
                    uploadFile={uploadFile}
                    action={handleUpdateAccount}
                     formControls={
                        profileInfo?.role==="candidate"?candidateOnboardFRomControl: recruiterOnboardFRomControl
                     }
                     formData={profileInfo?.role==="candidate"?candidateFormData: recruiterFormData}
                     buttonText="Update"
                     setFormData={profileInfo?.role==="candidate"?setCandidateFromData:setRecruiterFromData}
                    /> 
                </div>
             </div>
        </div>
    )
}

export default AccountInfo;