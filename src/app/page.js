import { fetchProfileAction } from '@/actions';
import { Cashfree} from '@cashfreepayments/cashfree-js';
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user=await currentUser()
  
  const ProfileInfo= await fetchProfileAction(user?.id);
  if(user && !ProfileInfo?._id) redirect("/onboard")


  return (
     <>
     <div className='bg-white'>
      <div className='relative w-full'>
        <div className='min-h-full flex'>
              <div className='container mt-20 p-0'>
                 <div className='flex item center flex-wrap gap-12 lg:gap-0'>
                     <div className='lg:w-5/12 space-y-8'>
                        <span className='flex space-x-2'>
                          <span className='block w-14 mb-2 border-b-2 border-gray-700'></span>
                          <span className='font-medium text-gray-600'>One Stop Solution to Find Jobs</span>
                        </span>
                        <h1 className='text-4xl font-bold md:text-6xl'>
                           The Best <br/> Job Protal App
                        </h1>
                        <p className='text-xl text-gray-700'>
                          Find Best Jobs From Top Product Best Compaines and Build Your Career
                        </p>
                        <div className='flex space-x-4'>
                              {
                                ProfileInfo?(
                                  ProfileInfo?.role==="candidate"?(
                                    <Link href={"/jobs"} className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5">Browse Jobs</Link>
                                  ):(
                                    <Link href={"/jobs"} className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5">Post New Job</Link>
                                  )
                                ):(
                                  <>
                                    <Link href={"/jobs"} className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5">Post New Job</Link>
                                  
                                  <Link href={"/jobs"} className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5">Browse Jobs</Link>
                                  </>
                                )
                              }
                        </div>   
                     </div>
                     <div className='hidden relative md:block lg:w-7/12 '>
                                <img
                                  src="https://static.vecteezy.com/system/resources/previews/000/172/715/original/vector-job-search-via-website.jpg"
                                  alt="home img"
                                  className='relative ml-auto'
                                />
                          </div>
                 </div>
              </div>
        </div>
      </div>
     </div>

     </>
  );
}
