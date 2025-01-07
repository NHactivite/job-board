"use client"

import CommonCard from "../common-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";


function CandidateActivity({jobList,jobApplicants}){
    const uniqueStatusArray= [...new Set(jobApplicants.map(jobApplicantItem=>jobApplicantItem.status).flat(1))]
    return(
        <div className="mx-auto max-w-7xl">
              <Tabs defaultValue="Applied" className="w-full">
                 <div className="flex items-baseline justify-between border-b pb-6 pt-24">
                     <h1 className="text-4xl font-bold tracking-tight text-gray-950">
                        Your Activity
                     </h1>
                     <TabsList>
                        {
                            uniqueStatusArray.map((status,idx)=><TabsTrigger key={idx} value={status}>{status}</TabsTrigger>)
                        }
                     </TabsList>
                 </div>
                 <div className="pb-24 pt-6">
                     <div className="container mx-auto space-y-8 p-0">
                         <div className="flex flex-col gap-4">
                           {
                            uniqueStatusArray.map((status,idx)=>(
                                <TabsContent key={idx} value={status}>
                                   {
                                    jobList.filter(jobItem=>(
                                        jobApplicants.filter(jobApplication=>jobApplication.status.indexOf(status)>-1).findIndex(filterItemBystatus=>
                                            jobItem._id===filterItemBystatus.jobId  
                                        )>-1
                                    ) ).map((finalFilteredItem,idx)=><CommonCard
                                         key={idx}
                                         title={finalFilteredItem.title}
                                         description={finalFilteredItem.comapnyName}
                                    />)
                                   }
                                </TabsContent>
                            ))
                           }
                         </div>
                     </div>
                 </div>
              </Tabs>
        </div>
    )
}

export default CandidateActivity;