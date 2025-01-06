"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommonFrom from "../common-form";
import {
  candidateOnboardFRomControl,
  initialCandidateFromData,
  initialRecruiterFromData,
  recruiterOnboardFRomControl,
} from "@/utils";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createProfileAction } from "@/actions";
import { createClient } from "@supabase/supabase-js";
const superbaseClient = createClient(
  "https://yschbhvplekqecqsuxrk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzY2hiaHZwbGVrcWVjcXN1eHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDI2OTksImV4cCI6MjA1MDg3ODY5OX0.NGS0j7VW3c0FnIE4KT97urpLtejhdToM9jpcs3w91Us"
);

function OnBoard() {
  const { user } = useUser();

  const [file, setFile] = useState(null);
  const [currentTab, setCurrentTab] = useState("candidate");
  const [fileStatus,setFileStatus]=useState(false)
  const [recruiterFromData, setRecruiterFromData] = useState(
    initialRecruiterFromData
  );

  const [candidateFromData, setCandidateFromData] = useState(
    initialCandidateFromData
  );

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };
  

  const handleUploadPdfToSuperbase = async () => {
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const { data, error } = await superbaseClient.storage
      .from("job-board-public")
      .upload(`${sanitizedFileName}_${user.id}`,file,
        {
          cacheControl:"3600",
          upsert:false
        }
      );
      if (error) {
        if (error.statusCode === "409") {
          // File already exists
          console.warn("File already exists. Using existing file path.");
          setCandidateFromData({
            ...candidateFromData,
            resume: `${sanitizedFileName}_${user.id}`, // Use existing file path
          });
          setFileStatus(true);
        } else {
          console.error("File upload error:", error.message);
        }
      } else
      if(data){
        setFileStatus(true)
         setCandidateFromData({
          ...candidateFromData,
          resume:data.path
         })
        
          }
       
      
  };

  const handleFileChange = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
  };


  const uploadFile=async(e)=>{
  
     e.preventDefault();
    if (file && !fileStatus) handleUploadPdfToSuperbase(); 
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    if(fileStatus){
      const { data } = await superbaseClient
      .storage
      .from('job-board') // Specify the bucket name
      .remove([`${sanitizedFileName}_${user.id}`]); // Pass the path of the file to delete as an array
     
       if(data[0]?.name==`${sanitizedFileName}_${user.id}`){
        console.log('File deleted successfully:', data);
        setFileStatus(false)
       }
    }
   
  }
  

  const handleRecuiterFromValid =() => {
    return Object.keys(recruiterFromData).every((key) => {
      const value = recruiterFromData[key];

      // Validate string fields
      if (typeof value === "string") {
        return value.trim() !== "";
      }

      // Allow non-string fields like boolean
      return true;
    });
  };
  const handleCandidateFromValid = () => {
    return Object.keys(candidateFromData).every((key) => {
      const value = candidateFromData[key];

      // Validate string fields
      if (typeof value === "string") {
        return value.trim() !== "";
      }

      // Allow non-string fields like boolean
      return true;
    });
  };

  const createProfile = async () => {
    const data =currentTab==="candidate"?{
      candidateInfo:candidateFromData,
      role:"candidate",
      isPremiumUser:false,
      userId: user.id,
      email: user.primaryEmailAddress.emailAddress,
    } :{
      recruiterInfo: recruiterFromData,
      role: "recruiter",
      userId: user.id,
      email: user.primaryEmailAddress.emailAddress,
      isPremiumUser: false,
    };

    await createProfileAction(data, "/onboard");
  };
  console.log(candidateFromData);
  
  return (
    <div className="bg-white">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex items-baseline justify-between border-b pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Welcome to onboarding
            </h1>
            <TabsList>
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="candidate">
          <CommonFrom
          action={createProfile}
            formControls={candidateOnboardFRomControl}
            buttonText={"Onboard as candidate"}
            formData={candidateFromData}
            setFormData={setCandidateFromData}
            handleFileChange={handleFileChange}
            isBtnDisabled={!handleCandidateFromValid()}
            uploadFile={uploadFile}
            fileStatus={fileStatus}
          />
        </TabsContent>
        <TabsContent value="recruiter">
          <CommonFrom
            formControls={recruiterOnboardFRomControl}
            buttonText={"Onboard as recruiter"}
            formData={recruiterFromData}
            setFormData={setRecruiterFromData}
            isBtnDisabled={!handleRecuiterFromValid()}
            action={createProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OnBoard;
