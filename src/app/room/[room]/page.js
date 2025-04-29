import VideoPage from '@/components/video-page'
import React from 'react'
import { currentUser } from "@clerk/nextjs/server";
import { fetchProfileAction } from '@/actions';
const page = async() => {
     const user =await currentUser();
        const profileInfo=await fetchProfileAction(user?.id)
        
  return (
    <div>
        <VideoPage role={profileInfo.role}/>
    </div>
  )
}

export default page