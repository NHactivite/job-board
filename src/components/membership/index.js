"use client"

import { memberShipPlans } from "@/utils";
import CommonCard from "../common-card";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { createOrderAction, createPaymentAction, paymentVerify } from "@/actions";


function MemberShipPage(ProfileInfo){
const cashfreeRef = useRef(null);
useEffect(() => {
  const initializeSDK = async () => {
    try {
      cashfreeRef.current = await load({
        mode: "sandbox", // Adjust to "production" for live
      });
      console.log("Cashfree SDK loaded:", cashfreeRef.current);
    } catch (error) {
      console.error("Failed to load payment gateway:", error);
    }
  };

  initializeSDK();
}, []);

    
  const getSessionId = async (plan) => {
    try {
      const res = await createPaymentAction({
        amount: plan.price,
        customer_id: ProfileInfo.ProfileInfo.userId,
        customer_email: ProfileInfo.ProfileInfo.email,
      });
      // Check if the response has the necessary data
      if (res && res.payment_session_id) {
        return {
          paymentSessionId: res.payment_session_id,
          orderId: res.order_id,
          orderStatus: res.order_status,
        };
      } else {
        console.error("Missing required session data in response:", res);
        throw new Error("Failed to retrieve valid session data.");
      }
    } catch (error) {
      console.error("Error in getSessionId:", error);
      throw error;
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  
  const getEndDate = (monthsToAdd) => {
    const today = new Date();
  
    // Save the original date
    const currentDate = today.getDate();
  
    // Add months
    today.setMonth(today.getMonth() + monthsToAdd);
  
    // If the resulting month doesn't have the original day, adjust
  if (today.getDate() < currentDate) {
    today.setDate(0); // Move to the last valid day of the previous month
  }
  
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };
  

  const verifyPayment = async ({orderId,plan}) => {
    console.log(plan,"kkkkoo");
    
    try {
      const memberShipStartDate = getCurrentDate(); // Current date in YYYY-MM-DD format
      const memberShipEndDate = getEndDate(plan.type==="basic"?2:plan.type==="teams"?6:12); // 6 months from the current date
      let data= await paymentVerify(orderId);

      if (data && data[0].payment_status === "SUCCESS") {
        const response=await createOrderAction({
          ...ProfileInfo.ProfileInfo,
          isPremiumUser:true,
          memberShipType:plan.type,
          memberShipStartDate,
          memberShipEndDate
        },"/membership")
      }
    } catch (error) {
      console.log("Payment verification failed",error);
      
    }
  };

  const handlePay = async (plan) => {
    try {
      // Check if the cashfreeRef is loaded and the checkout method is available
      if (cashfreeRef.current && typeof cashfreeRef.current.checkout === "function") {
      
        // Get the payment session ID (this should be returned from your backend or API)
        const sessionId = await getSessionId(plan); // Replace with actual method to fetch the session ID
  
        // If session ID is invalid or not found, return early
        if (!sessionId) return;
  
        // Prepare checkout options
        const checkoutOptions = {
          paymentSessionId: sessionId.paymentSessionId,
          redirectTarget: "_modal", // Ensures the payment opens in a modal
        };
  
        // Initiate the payment flow
        cashfreeRef.current.checkout(checkoutOptions).then(() => {
          // After payment is initiated, verify the payment
          verifyPayment({ orderId: sessionId.orderId, plan });
        }).catch(error => {
          console.error("Error during checkout:", error);
        });
      } else {
        console.error("checkout function is not available in the Cashfree SDK");
      }
    } catch (error) {
      console.error("Error in handlePay:", error);
    }
  };

  const trueIdx = memberShipPlans.findIndex(
    (plan) => ProfileInfo.ProfileInfo.memberShipType === plan.type
  );
  
  console.log(trueIdx,"uoo");
  
    return(
        <div className="mx-auto max-w-7xl">
             <div className="flex items-baseline justify-between border-b pb-6 pt-24">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                     {
                      ProfileInfo.ProfileInfo?.isPremiumUser?"You are a Premimum User":"Choose Your Best Plane"
                     }
                  </h1>
                  <div>
                    {
                      ProfileInfo.ProfileInfo?.isPremiumUser?
                      <Button>{ProfileInfo.ProfileInfo?.memberShipType}</Button>
                      :null
                    }
                  </div>
             </div>
             <div className="py-20 pb-16 pt-3 ">
                 <div className="container mx-auto p-0 space-y-8">
                     <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                      
                         {  
                         
                            memberShipPlans.slice(trueIdx+1).map((plan,idx)=>(
                               <CommonCard  key={idx}
                           title={
                           <div className="flex justify-between">
                                <span>
                                    {`$ ${plan.price} /yr`}
                                </span>
                                <h1>
                                    {plan.heading}
                                </h1>
                            </div>
                            }
                           description={plan.type}
                           footerContent={
                            <Button onClick={()=>handlePay(plan)}>Update Plan</Button>
                           }
                        />
                        ))
                         }

                     </div>
                     {
                          trueIdx===-1?null:
                          <div className="h-32 flex  justify-around items-end pb-5">
                            <h1 className="text-2xl font-bold">{`Your Current plan is ${ProfileInfo.ProfileInfo.memberShipType} `}</h1>
                            
                               <span className="text-xl font-semibold">{`MemberShip buy in ${ProfileInfo.ProfileInfo.memberShipStartDate}`}</span>
                               <span className="text-xl font-semibold">{`MemberShip End in ${ProfileInfo.ProfileInfo.memberShipEndDate}`}</span>
                            
                          </div>
                         }
                 </div>
             </div>
        </div>
    )
}

export default MemberShipPage;