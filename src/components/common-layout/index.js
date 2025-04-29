import { fetchProfileAction } from "@/actions";
import { currentUser } from "@clerk/nextjs/server";
import { Toaster } from "react-hot-toast";
import Footer from "../footer-page";
import Header from "../header";
export async function CommonLayout({children}){

      const user=await currentUser();
      const profileInfo=await fetchProfileAction(user?.id)

    return(
        <div className="mx-auto max-w-full  bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 ">
            {/* header section */}
           
            <Header role={profileInfo?.role} user={JSON.parse(JSON.stringify(user))}/>
         
            {/* main content section */}
               <main className="lg:px-8 min-h-screen">
                  {children}
               </main>

               <Footer/>
            <Toaster position="top-center" reverseOrder={false} toastOptions={{duration: 3000}}/>   
        </div>
    )
}