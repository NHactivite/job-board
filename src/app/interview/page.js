import Interview from '@/components/interview-card'
import React from 'react'
import { currentUser } from "@clerk/nextjs/server";
import { fetchProfileAction } from '@/actions';
const page = async() => {
   
        const user =await currentUser();
              const profileInfo=await fetchProfileAction(user?.id)
  return (
    <div>
      <Interview role={profileInfo.role}/>
    </div>
  )
}

export default page