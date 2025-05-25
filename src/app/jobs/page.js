import { createFilterCategoryAction, fetchJobApplicationForCandidate, fetchJobApplicationForRecruiter, fetchJobsForCandidateAction, fetchJobsForRecruiterAction, fetchProfileAction } from "@/actions";
import JobListing from "@/components/job-listing";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



async function Jobs({searchParams}){
const value=await searchParams
 
    const user =await currentUser();
    const profileInfo=await fetchProfileAction(user?.id)
    //  if(user && !profileInfo?._id) redirect("/onboard")
      if (user && !profileInfo?._id) {
        redirect("/onboard");
        return null;
    }
    
    
    const jobList= profileInfo?.role==="candidate"?await fetchJobsForCandidateAction(value):await  fetchJobsForRecruiterAction(user?.id);
   console.log("jobList",jobList.length);
   
     const getJobApplicationList= profileInfo?.role==="candidate"? await fetchJobApplicationForCandidate(user?.id)
     : await fetchJobApplicationForRecruiter(user?.id)

     const fetchFilterCategories=await createFilterCategoryAction()


   return(
      <JobListing user={JSON.parse(JSON.stringify(user))} profileInfo={JSON.parse(JSON.stringify(profileInfo))}  jobList={jobList}
        jobApplication={getJobApplicationList}
      filterCategories={fetchFilterCategories}
      />
   )
}

export default Jobs;