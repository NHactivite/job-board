"use client";

import { getCandidateDetailsByIdAction, updateJobApplication } from "@/actions";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

import { format } from "date-fns";
import DatePicker from "react-datepicker";
// import { saveInterviewDate } from "./actions"
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

function CandidateList({
  currentCandidateDetails,
  setCurrentCandidateDetails,
  jobApplication,
  showCurrentCandidateDetailsModel,
  setShowCurrentCandidateDetailsModel,
}) {
  const handleFetchCandidateDetails = async (id) => {
    const data = await getCandidateDetailsByIdAction(id);

    if (data) {
      setCurrentCandidateDetails(data);
      setShowCurrentCandidateDetailsModel(true);
    }
  };

  const handlePreviewResume = () => {
    if (currentCandidateDetails?.candidateInfo.resume.publicPath) {
      // Create and trigger the download link
      const a = document.createElement("a");
      a.href = currentCandidateDetails?.candidateInfo.resume.publicPath; // Ensure the publicUrl is correctly assigned
      a.setAttribute("target", "_blank"); // Open in new tab if clicked
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error("No public URL found!");
    }
  };
  const handleUpdateJobStatus = async (getCrruentStatus) => {
    let copyJobApplicats = [...jobApplication];
    const indexOfCurrentJobApplicant = copyJobApplicats.findIndex(
      (item) => item.candidateUserId === currentCandidateDetails?.userId
    );

    const jobApplicatsUpdate = {
      ...copyJobApplicats[indexOfCurrentJobApplicant],
      status:
        copyJobApplicats[indexOfCurrentJobApplicant].status.concat(
          getCrruentStatus
        ),
    };
    await updateJobApplication(jobApplicatsUpdate, "/jobs");
  };

  const handleUpdateJobInterview = async (time) => {
    let copyJobApplicats = [...jobApplication];
    const indexOfCurrentJobApplicant = copyJobApplicats.findIndex(
      (item) => item.candidateUserId === currentCandidateDetails?.userId
    );

    const jobApplicatsUpdate = {
      ...copyJobApplicats[indexOfCurrentJobApplicant],
      interviewDate: time,
    };
    await updateJobApplication(jobApplicatsUpdate, "/jobs");
  };

  const isApplicationExists = jobApplication.find(
    (item) => item.candidateUserId === currentCandidateDetails?.userId
  );

  const isSelected = isApplicationExists?.status.includes("Selected");

  const isRejected = isApplicationExists?.status.includes("Rejected");

  const interviewDate=isApplicationExists?.interviewDate;

  const [selectedDateTime, setSelectedDateTime] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-3 p-10 md:grid-cols-2 lg:grid-cols-3">
        {jobApplication && jobApplication.length > 0
          ? jobApplication.map((item, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg w-full max-w-md rounded-lg overflow-hidden mx-auto p-4"
              >
                <div className="px-4 my-6 flex justify-between items-center">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <Button
                    onClick={() =>
                      handleFetchCandidateDetails(item?.candidateUserId)
                    }
                    className=" flex h-11 items-center justify-center px-5"
                  >
                    View Profile
                </Button>
                </div>
                {item.interviewDate && new Date(item.interviewDate) <= new Date() ? (
                  <Link
                    href={{
                      pathname: "/interview",
                      query: { id: jobApplication[0].candidateUserId },
                    }}
                    className="flex h-11 items-center justify-center px-5 bg-black text-white cursor-pointer"
                  >
                    Take Interview
                  </Link>
                ) : (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">
                      {
                        item.interviewDate
                          ? `Interview Date: ${format(
                              new Date(item.interviewDate),
                              "MMMM d, yyyy h:mm aa"
                            )}`
                          : "No Interview Scheduled"
                      }
                    </span>
                  </div>
                )}
              </div>
            ))
          : null}
      </div>
      <Dialog
        open={showCurrentCandidateDetailsModel}
        onOpenChange={() => {
          setCurrentCandidateDetails(null);
          setShowCurrentCandidateDetailsModel(false);
        }}
      >
        <DialogContent>
          <DialogTitle className=" flex justify-center text-xl font-bold">
            <span className="bg-black text-white px-5 py-2 rounded-md">
              Candidate
            </span>
          </DialogTitle>
          <div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {currentCandidateDetails?.candidateInfo.name}
              </h1>
              <p className="text-lg font-bold text-gray-900">
                Email:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.email}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Role:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.role}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Premium User:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.isPremiumUser ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Current Company:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.currentCompanyName}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Current Salary:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.currentSalary}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Job Location:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.currentJobLocation}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Preferred Job Location:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.preferedJobLocation}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Previous Companies:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.previousCompanies}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Notice Period:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.noticePeriod}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Skills:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.skills}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                LinkedIn Profile:{" "}
                <a
                  className="font-semibold text-gray-600 "
                  href={currentCandidateDetails?.candidateInfo.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentCandidateDetails?.candidateInfo.linkedinProfile}
                </a>
              </p>
              <p className="text-lg font-bold text-gray-900">
                GitHub Profile:{" "}
                <a
                  className="font-semibold text-gray-600 "
                  href={currentCandidateDetails?.candidateInfo.githubProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentCandidateDetails?.candidateInfo.githubProfile}
                </a>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Graduated Year:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.graduatedYear}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                College Location:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.collegeLocation}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                College:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.college}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Total Experience:{" "}
                <span className="font-semibold text-gray-600 ">
                  {currentCandidateDetails?.candidateInfo.totalExperience}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-900">
                Resume:{" "}
                <a
                  className="font-semibold text-gray-600 "
                  href={currentCandidateDetails?.candidateInfo.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={handlePreviewResume}
              className="m-2 items-center justify-center px-5"
            >
              Resume
            </Button>
            {isSelected ? (
              <span className="text-green-400 font-bold mx-5">Selected</span>
            ) : (
              <Button
                onClick={() => handleUpdateJobStatus("Selected")}
                className="disabled:opacity-55 m-2 items-center justify-center  px-5 "
                disabled={isRejected}
              >
                Select
              </Button>
            )}
            {isRejected ? (
              <span className="text-red-500 font-bold mx-5">Rejected</span>
            ) : (
              <Button
                onClick={() => handleUpdateJobStatus("Rejected")}
                className="disabled:opacity-55 m-2 items-center justify-center  px-5"
                disabled={isSelected}
              >
                Reject
              </Button>
            )}
            <div className="flex items-center justify-between rounded-md font-bold ">
              <div className="space-y-2">
                <label
                  htmlFor="interview-date"
                  className="block text-sm font-bold text-gray-900"
                >
                  Select Interview Date and Time
                </label>
                <DatePicker
                  id="interview-date"
                  selected={selectedDateTime}
                  onChange={setSelectedDateTime}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={1}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  maxDate={
                    new Date(new Date().setMonth(new Date().getMonth() + 1))
                  }
                  placeholderText="Click to select date and time"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={() => handleUpdateJobInterview(selectedDateTime)}
                disabled={false}
                className="disabled:opacity-55 m-2 items-center justify-center  px-5 mt-9"
              >
                {
                  interviewDate? "Update Interview Date":"Schedule Interview"
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CandidateList;
