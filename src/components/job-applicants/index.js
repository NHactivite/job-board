"use client"

import CandidateList from "../candidate-list";
import { Drawer, DrawerContent, DrawerTitle } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";


const JobApplicant=(
   { showApplicantsDrawer,
    setShowApplicantsDrawer,
    currentCandidateDetails,
    setCurrentCandidateDetails,
    showCurrentCandidateDetailsModel,
    setShowCurrentCandidateDetailsModel,
    jobApplication}
)=>{
    return(
        <Drawer open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
                <DrawerContent className="max-h-[50vh]">
                    <DrawerTitle className="m-auto mt-5 text-lg bg-gray-900 text-white rounded-md px-5 py-2">Applicants</DrawerTitle>
                  <ScrollArea className="h-auto overflow-y-auto">
                       <CandidateList 
                         currentCandidateDetails={currentCandidateDetails}
                         setCurrentCandidateDetails={setCurrentCandidateDetails}
                         jobApplication={jobApplication}
                         showCurrentCandidateDetailsModel={showCurrentCandidateDetailsModel}
                         setShowCurrentCandidateDetailsModel={setShowCurrentCandidateDetailsModel}
                       />
                  </ScrollArea>
                </DrawerContent>
        </Drawer>
    )
}

export default JobApplicant;