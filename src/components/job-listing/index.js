"use client";

import { filterMenuData, formUrlQuery } from "@/utils";
import { CandidateJobCard } from "../candidate-job-card";
import PostNewJob from "../post-new-job";
import RecruiterJobCard from "../recruiter-job-card";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function JobListing({
  user,
  profileInfo,
  jobList,
  jobApplication,
  filterCategories,
}) {
  const filterMenus = filterMenuData.map((item) => ({
    id: item.id,
    name: item.label,
    options: [
      ...new Set(filterCategories.map((listItem) => listItem[item.id])),
    ],
  }));


  const [filterParams, setFilterParams] = useState({});
  const searchParams=useSearchParams()
  const router=useRouter()

  const handleFilter = (getSectionId, getCurrentOption) => {
    let cpyFilterParams = { ...filterParams };
    const indexOfCurrentSection =
      Object.keys(cpyFilterParams).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilterParams = {
        ...cpyFilterParams,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilterParams[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        cpyFilterParams[getSectionId].push(getCurrentOption);
      } else {
        cpyFilterParams[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilterParams(cpyFilterParams);
    sessionStorage.setItem("filterParams", JSON.stringify(cpyFilterParams));
  };

  useEffect(()=>{
      setFilterParams(JSON.parse(sessionStorage.getItem("filterParams")))
  },[])

  useEffect(()=>{
    if(filterParams && Object.keys(filterParams).length >0 ){
        let url="";
        url=formUrlQuery({
            params:searchParams.toString(),
            dataToAdd:filterParams
        })
        router.push(url,{scroll:false})
    }
  },[filterParams,searchParams])

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-10 pb-5">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {profileInfo?.role === "candidate"
              ? "Explore All Jobs"
              : "Jobs Dashboard"}
          </h1>
          <div className="flex items-center">
            {profileInfo?.role === "candidate" ? (
              <Menubar>
                {filterMenus.map((filterMenu,idx) => (
                  <MenubarMenu key={idx}>
                    <MenubarTrigger>{filterMenu.name}</MenubarTrigger>
                    <MenubarContent>
                      {filterMenu.options.map((option, idx) => (
                        <MenubarItem
                          key={idx}
                          className="flex items-center"
                          onClick={() => handleFilter(filterMenu.id, option)}
                        >
                          <div
                            className={`h-4 w-4 border-solid border-gray-950 rounded-sm ${
                              filterParams &&
                              Object.keys(filterParams).length > 0 &&
                              filterParams[filterMenu.id] &&
                              filterParams[
                                filterMenu.id].indexOf(option) > -1
                                  ? "bg-black"
                                  : ""
                              
                            }`}
                          ></div>
                          <Label className="ml-3 cursor-pointer text-sm text-gray-600">
                            {option}
                          </Label>
                        </MenubarItem>
                      ))}
                    </MenubarContent>
                  </MenubarMenu>
                ))}
              </Menubar>
            ) : (
              <PostNewJob profileInfo={profileInfo} user={user} currentCount={jobList.length}/>
            )}
          </div>
        </div>
        <div className="pt-6 pb24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div className="lg:col-span-4">
              <div className="container mx-auto p-0 space-y-8">
                <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                  {jobList && jobList.length > 0
                    ? jobList.map((jobItem, idx) =>
                        profileInfo?.role === "candidate" ? (
                          <CandidateJobCard
                            key={idx}
                            jobItem={jobItem}
                            profileInfo={profileInfo}
                            jobApplication={jobApplication}
                            currentCount={jobList.length}
                            
                          />
                        ) : (
                          <RecruiterJobCard
                            jobItem={jobItem}
                            key={idx}
                            jobApplication={jobApplication}
                            currentCount={jobList.length}
                            profileInfo={profileInfo}
                          />
                        )
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListing;
