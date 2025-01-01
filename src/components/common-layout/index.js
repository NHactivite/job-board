import { currentUser } from "@clerk/nextjs/server"
import Header from "../header"
import { fetchProfileAction } from "@/actions";

export const CommonLayout=async({children})=>{

      const user=await currentUser();
      const profileInfo=await fetchProfileAction(user?.id)
      
    return(
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
            {/* header section */}
           
             <Header role={profileInfo?.role} user={JSON.parse(JSON.stringify(user))}/>
         
            {/* main content section */}
               <main>
                  {children}
               </main>
        </div>
    )
}