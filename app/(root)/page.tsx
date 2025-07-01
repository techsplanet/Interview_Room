import { Button } from '@/components/ui/button'
import { Linefont } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser, getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/auth_action'

const page = async() => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({userId: user?.id!})
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
            <p>You haven't taken any interviews yet</p>
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