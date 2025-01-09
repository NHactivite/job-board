"use client"

import { memberShipPlans } from "@/utils";
import CommonCard from "../common-card";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { createPaymentAction } from "@/actions";


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

    
  const getSessionId = async () => {
    try {
      const res = await createPaymentAction({
        amount: 100,
        customer_id: "12345",
        customer_phone: "9999999999",
      });
  
      // Log the entire response for debugging
      console.log("Response from createPaymentAction:", res);
  
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

  const handlePay = async () => {
    try {
      // Check if the cashfreeRef is loaded and the checkout method is available
      if (cashfreeRef.current && typeof cashfreeRef.current.checkout === "function") {
        console.log("Starting payment flow...");
  
        // Get the payment session ID (this should be returned from your backend or API)
        const sessionId = await getSessionId(); // Replace with actual method to fetch the session ID
  
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
          verifyPayment(sessionId.orderId);
        }).catch(error => {
          console.error("Error during checkout:", error);
          toast.error("Payment failed.");
        });
      } else {
        console.error("checkout function is not available in the Cashfree SDK");
      }
    } catch (error) {
      console.error("Error in handlePay:", error);
      toast.error("Payment failed.");
    }
  };
  
  
    return(
        <div className="mx-auto max-w-7xl">
             <div className="flex items-baseline justify-between border-b pb-6 pt-24">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                     Choose Your Best Plan
                  </h1>
             </div>
             <div className="py-20 pb-24 pt-6">
                 <div className="container mx-auto p-0 space-y-8">
                     <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                         {
                            memberShipPlans.map((plan,idx)=>(
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
                                <Button onClick={handlePay}>Get Premimum</Button>
                               }
                            />
                        ))
                         }
                     </div>
                 </div>
             </div>
        </div>
    )
}

export default MemberShipPage;