"use client"

import { CandidateJobCard } from "../candidate-job-card";
import PostNewJob from "../post-new-job";
import RecruiterJobCard from "../recruiter-job-card";


function JobListing({user,profileInfo,jobList,jobApplication}){
   
    return(
        <div>
            <div className="mx-auto max-w-7xl">
                <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-5">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                        {
                            profileInfo?.role==="candidate"?"Explore All Jobs":"Jobs Dashboard"
                        }
                    </h1>
                    <div className="flex items-center">
                         {
                            profileInfo?.role==="candidate"?<p>Filter</p>:<PostNewJob profileInfo={profileInfo} user={user}/> 
                         }
                    </div>
                </div>
                <div className="pt-6 pb24">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                          <div className="lg:col-span-4">
                            <div className="container mx-auto p-0 space-y-8">
                               <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                                   {
                                    jobList && jobList.length>0?
                                      jobList.map((jobItem,idx)=>(
                                        profileInfo?.role==="candidate"?<CandidateJobCard key={idx} jobItem={jobItem} profileInfo={profileInfo} jobApplication={jobApplication}/>:
                                      <RecruiterJobCard jobItem={jobItem} key={idx} jobApplication={jobApplication}/>
                                      ))
                                    :null
                                   }
                               </div>
                            </div>
                          </div>
                    </div>
                </div>
            </div> 
        </div>
    )
 }
 
 export default JobListing;