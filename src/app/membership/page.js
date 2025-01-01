import { fetchProfileAction } from "@/actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const MemberShip=async()=>{
    const user=await currentUser()
      const ProfileInfo= await fetchProfileAction(user?.id);
       
      if(user && !ProfileInfo?._id) redirect("/onboard")
    return(
        <div>mambership page</div>
    )
}

export default MemberShip