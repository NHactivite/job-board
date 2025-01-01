"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import CommonFrom from "../common-form"
import { initialPostNewJobFromData, postNewJobFromControls } from "@/utils"
import { postNewJobAction } from "@/actions"


export default function PostNewJob({profileInfo,user}){

    const [showJobDialog,setShowJobDialog]=useState(false)
    const [jobFormData,setJobFormData]=useState({
        ...initialPostNewJobFromData,
        companyName:profileInfo?.recruiterInfo?.companyName || ""
    })

  const handlePostNewJobBtnValid=()=>{
    return(
        Object.keys(jobFormData).every(control=>jobFormData[control].trim()!=="")
    )
  }
  const createNewJob=async()=>{
     await postNewJobAction({
      formData:{
        ...jobFormData,
      recruiterId:user?.id,
      applicants:[]
      },
     pathToRevalidate: "/jobs"
  });
  setJobFormData({
    ...initialPostNewJobFromData,
      companyName:profileInfo?.recruiterInfo?.companyName
  })
  setShowJobDialog(false)
  }

   return(
     <div>
       <Button  onClick={()=>setShowJobDialog(true)} className="disabled:opacity-60 flex h-11 items-center justify-center px-5">Post A Job</Button>
       <Dialog  open={showJobDialog} onOpenChange={()=>{
        setShowJobDialog(false),
        setJobFormData({
            ...initialPostNewJobFromData,
            companyName:profileInfo?.recruiterInfo?.companyName
        })
       }}>
           <DialogContent className="sm:max-w-screen-md h-[600px] overflow-auto">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
                <div className="grid gap-4 py-4">
                    <CommonFrom
                    buttonText={"Add"}
                    formData={jobFormData}
                    setFormData={setJobFormData}
                    formControls={postNewJobFromControls}
                    isBtnDisabled={!handlePostNewJobBtnValid()}
                    action={createNewJob}
                    />
                </div>
              </DialogHeader>
           </DialogContent>
       </Dialog>
     </div>
   )
}