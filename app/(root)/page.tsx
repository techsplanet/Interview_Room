/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import Image from 'next/image'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth_action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general_action'

const page = async() => {
  const user = await getCurrentUser();

  if(!user){
    // If user is not authenticated, show a message and a link to sign in
    // This is a server component, so we can directly return the JSX
    redirect('/signup');
  }  

  // Fetch user interviews and latest interviews concurrently
  // Using Promise.all to optimize performance
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),     // i can also use user.id directly here since i have checked for null in if condition earlier.
    await getLatestInterviews({userId: user?.id!}) // Using non-null assertion since we already checked for user nullability
  ]);

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & FeedBack</h2>
          <p className='text-lg'>
            Practice on the real interview questions & get instant feedback
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt="robot" width={280} height={280} className="max-sm:hidden " />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {hasPastInterviews?(userInterviews.map((interview)=>{
            return (
              <InterviewCard key={interview.id} {...interview} />
            )
          })):(
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
          {hasUpcomingInterviews?(latestInterviews.map((interview)=>{
            return (
              <InterviewCard key={interview.id} {...interview} />
            )
          })):(
            <p>There are no new Interviews available</p>
          )}
        </div>
      </section>
    </>
  )
}

export default page