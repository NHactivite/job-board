import { fetchProfileAction } from "@/actions";
import MemberShipPage from "@/components/membership";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const MemberShip=async()=>{
    const user=await currentUser()
      const ProfileInfo= await fetchProfileAction(user?.id);
       console.log(ProfileInfo,"kk");
       
      if(user && !ProfileInfo?._id) redirect("/onboard")
    return(
        <div>
          <MemberShipPage ProfileInfo={JSON.parse(JSON.stringify(ProfileInfo))}/>
        </div>
    )
}

export default MemberShip