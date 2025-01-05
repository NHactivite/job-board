

import { fetchProfileAction } from '@/actions';
import AccountInfo from '@/components/account-info'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const AccountPage = async() => {

    const user=await currentUser();
    const profileInfo=await fetchProfileAction(user?.id);

    if(!profileInfo) redirect("/onboard")
  return (
    <div>
        <AccountInfo profileInfo={JSON.parse(JSON.stringify(profileInfo))}/>
    </div>
  )
}

export default AccountPage