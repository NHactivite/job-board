"use client";

import { createPlanAction, fetchPlanUpadateAction } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const Plan = ({ data }) => {
  // Initialize plan data based on incoming data
  const [planDataList, setPlanDataList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const newPlan = {
    heading: "",
    price:0,
    type: "",
    month:"",        
    job: "",
  };
  const [newPlanData, setNewPlanData] = useState(newPlan);
  useEffect(() => {
    const initialData = data.map((item) => ({
      id: item._id || "",
      heading: item.heading || "",
      price: item.price || 0,
      type: item.type || "",
      month: item.month || "",
      job: item.job || "",
    }));
    setPlanDataList(initialData);
  }, [data]);
  const isPlanChanged = (index) => {
    const current = planDataList[index];
    const original = data[index];
  
    const currentClean = {
      id: current.id,
      heading: current.heading,
      price: current.price,
      type: current.type,
      month: current.month,
      job: current.job,
    };
  
    const originalClean = {
      id: original._id || original.id,
      heading: original.heading,
      price: original.price,
      type: original.type,
      month: original.month ,
      job: original.job ,
    };
    
    const result = JSON.stringify(currentClean) === JSON.stringify(originalClean);
   
    return result;
  };
  const handleChange = (index, field, value) => {
    const updatedList = [...planDataList];
    updatedList[index][field] = value;
    setPlanDataList(updatedList);
  };
  const handleSubmit = async (e, idx) => {
    e.preventDefault();
    const plan = planDataList[idx];
    console.log("Submitting plan:", plan);
    
    await fetchPlanUpadateAction(plan, "/admin/plan");
    toast.success("Plan updated successfully!");
  };

  const handleNewPlan = async(e) => {
      e.preventDefault();
      await createPlanAction(newPlanData,"/admin/plan");
      toast.success("New plan added successfully!");
        setShowDialog(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Membership Plans</h1>
        <p className="text-white font-bold">
          Choose the plan that works best for your hiring needs.
        </p>
      </div>
      <Button
        className="bg-white text-black hover:bg-gray-200 rounded-md p-2 w-32"
        onClick={() => setShowDialog(true)}
      >
        Add New Plan
      </Button>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {planDataList.map((plan, idx) => (
          <form
            key={idx}
            className="w-full"
            onSubmit={(e) => handleSubmit(e, idx)}
          >
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Input
                type="text"
                placeholder="Heading"
                value={plan.heading}
                onChange={(e) => handleChange(idx, "heading", e.target.value)}
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="Price"
                value={plan.price}
                onChange={(e) =>
                  handleChange(idx, "price", Number(e.target.value))
                }
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="Type"
                value={plan.type}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="Month"
                value={plan.month}
                onChange={(e) => handleChange(idx, "month", e.target.value)}
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="Number of Jobs"
                value={plan.job}
                onChange={(e) => handleChange(idx, "job", e.target.value)}
                className="w-full mb-4"
              />
              <Button className="w-full" variant="outline" type="submit" disabled={isPlanChanged(idx)} >
                Update Plan
              </Button>
            </div>
          </form>
        ))}
      </div>
      <Dialog
        open={showDialog}
        onOpenChange={() => {
          setShowDialog(false);
        }}
      >
        <DialogContent>
          <DialogTitle>New Plan</DialogTitle>
          <form className="w-full" onSubmit={(e) => handleNewPlan(e)}>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Input
                type="text"
                placeholder="Heading"
                value={newPlanData.heading}
                onChange={(e) =>
                  setNewPlanData({ ...newPlanData, heading: e.target.value })
                }
                className="w-full mb-4"
              />
              <Input
                type="number"
                placeholder="Price"
                value={newPlanData.price.toString()}
                onChange={(e) =>
                    setNewPlanData({
                        ...newPlanData,
                        price: e.target.value === "" ? 0 : Number(e.target.value),
                      })
                }
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="Type"
                value={newPlanData.type}
                onChange={(e) =>
                  setNewPlanData({ ...newPlanData, type: e.target.value })
                }
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="Month"
                value={newPlanData.month}
                onChange={(e) =>
                  setNewPlanData({ ...newPlanData, month: e.target.value })
                }
                className="w-full mb-4"
              />
              <Input
                type="text"
                placeholder="job"
                value={newPlanData.job}
                onChange={(e) =>
                  setNewPlanData({ ...newPlanData, job: e.target.value })
                }
                className="w-full mb-4"
              />
              <Button className="w-full" variant="outline" type="submit" disabled={newPlanData.heading==="" || newPlanData.price===0 || newPlanData.type===""}>
                Add Plan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plan;
