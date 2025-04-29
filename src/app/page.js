import { fetchProfileAction } from '@/actions';
import HomePage from '@/components/Home-page';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user=await currentUser()
  
  const ProfileInfo= await fetchProfileAction(user?.id);
  if(user && !ProfileInfo?._id) redirect("/onboard")


  return (
     <>
     <HomePage ProfileInfo={JSON.parse(JSON.stringify(ProfileInfo))}/>
     </>
  );
}
