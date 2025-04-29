"use client";

import {
  createOrderAction,
  createPaymentAction,
  paymentVerify,
} from "@/actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { memberShipPlans } from "@/utils";
import { load } from "@cashfreepayments/cashfree-js";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

function MemberShipPage(ProfileInfo) {
  const [hoveredPlan, setHoveredPlan] = useState(null)

  const cashfreeRef = useRef(null);
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        cashfreeRef.current = await load({
          mode: "sandbox", // Adjust to "production" for live
        });
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

  const verifyPayment = async ({ orderId, plan }) => {
    try {
      const memberShipStartDate = getCurrentDate(); // Current date in YYYY-MM-DD format
      const memberShipEndDate = getEndDate(
        plan.type === "basic" ? 2 : plan.type === "teams" ? 6 : 12
      ); // 6 months from the current date
      let data = await paymentVerify(orderId);

      if (data && data[0].payment_status === "SUCCESS") {
        const response = await createOrderAction(
          {
            ...ProfileInfo.ProfileInfo,
            isPremiumUser: true,
            memberShipType: plan.type,
            memberShipStartDate,
            memberShipEndDate,
          },
          "/membership"
        );
      }
      toast.success("Payment successful! Your membership has been updated.");
    } catch (error) {
      console.log("Payment verification failed", error);
    }
  };

  const handlePay = async (plan) => {
    try {
      // Check if the cashfreeRef is loaded and the checkout method is available
      if (
        cashfreeRef.current &&
        typeof cashfreeRef.current.checkout === "function"
      ) {
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
        cashfreeRef.current
          .checkout(checkoutOptions)
          .then(() => {
            // After payment is initiated, verify the payment
            verifyPayment({ orderId: sessionId.orderId, plan });
          })
          .catch((error) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <div className="h-full p-2">
    <motion.div className="container mx-auto " initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="text-center mb-12" variants={itemVariants}>
      <div className="font-bold mb-4 text-white flex justify-around  text-base  md:mt-5 lg:text-4xl mt-8">
          {ProfileInfo.ProfileInfo?.isPremiumUser ? <span className="mt-2">Your Premium Membership</span>: <span className="mt-2">Choose Your Best Plan</span>}
        
        {ProfileInfo.ProfileInfo?.isPremiumUser && (
          <Button variant="outline" size="lg" className="bg-gray-900 text-white border-0 text-xl ">
            {ProfileInfo.ProfileInfo?.memberShipType}
          </Button>
        )}
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants}>
        {memberShipPlans.slice(trueIdx + 1).map((plan, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setHoveredPlan(plan.type)}
            onHoverEnd={() => setHoveredPlan(null)}
          >
            <Card
              className={` mt-10 h-full flex flex-col ${hoveredPlan === plan.type ? "shadow-xl" : "shadow"} transition-shadow duration-300`}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{plan.heading}</span>
                  <span className="text-3xl font-extrabold text-primary">${plan.price}/yr</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-semibold mb-2">{plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}</p>
                <p className="text-gray-600">
                  {plan.type === "teams" && "Apply for 10 jobs with 6 months validity"}
                  {plan.type === "basic" && "Apply for 5 jobs with 3 months validity"}
                  {plan.type === "enterprise" && "Apply for unlimited jobs with 1 year validity"}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handlePay(plan)}>
                  Update Plan
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {trueIdx !== -1 && (
        <motion.div className="mt-20 bg-white rounded-lg shadow-lg p-8" variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6 text-center">Your Current Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-gray-600 mb-2">Plan Type</p>
              <p className="text-xl font-semibold">{ProfileInfo?.ProfileInfo?.memberShipType}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Job Applications</p>
              <p className="text-xl font-semibold">
                {ProfileInfo?.ProfileInfo?.memberShipType === "teams" && "10 jobs"}
                {ProfileInfo?.ProfileInfo?.memberShipType === "basic" && "5 jobs"}
                {ProfileInfo?.ProfileInfo?.memberShipType === "enterprise" && "Unlimited jobs"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Purchased On</p>
              <p className="text-xl font-semibold">{ProfileInfo?.ProfileInfo?.memberShipStartDate}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Expires On</p>
              <p className="text-xl font-semibold">{ProfileInfo?.ProfileInfo?.memberShipEndDate}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  </div>
  );
}

export default MemberShipPage;
