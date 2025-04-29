"use client";
import { createProfileAction } from "@/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  candidateOnboardFRomControl,
  initialCandidateFromData,
  initialRecruiterFromData,
  recruiterOnboardFRomControl,
} from "@/utils";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import CommonFrom from "../common-form";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

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
    const { data, error } = await supabaseClient.storage
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
        const res = supabaseClient.storage.from("job-board-public").getPublicUrl(data.path)
        setFileStatus(true)
         setCandidateFromData({
          ...candidateFromData,
          resume:{
           path: data.path,
           publicPath:res.data.publicUrl
          }
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
      const { data } = await supabaseClient.storage
      .from('job-board-public') // Specify the bucket name
      .remove([`${sanitizedFileName}_${user.id}`]); // Pass the path of the file to delete as an array
    
       if(data[0]?.name==`${sanitizedFileName}_${user.id}`){
        setFileStatus(false)
        setCandidateFromData({
          ...candidateFromData,
          resume:{
            path: "",
            publicPath:""
          },
        });
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

  return (
    <div className="bg-white p-5 min-h-screen">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="flex items-baseline justify-between border-b ">
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
