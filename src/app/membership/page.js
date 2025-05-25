import { fetchPlanAction, fetchProfileAction } from "@/actions";
import MemberShipPage from "@/components/membership";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const MemberShip=async()=>{
    const user=await currentUser()
      const ProfileInfo= await fetchProfileAction(user?.id);
      const AllPlan = await fetchPlanAction();
   
      if(user && !ProfileInfo?._id) redirect("/onboard")
    return(
        <div>
          <MemberShipPage ProfileInfo={JSON.parse(JSON.stringify(ProfileInfo))} AllPlan={JSON.parse(JSON.stringify(AllPlan))}/>
        </div>
    )
}

export default MemberShip