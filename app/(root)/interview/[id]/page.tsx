import { getInterviewsById } from '@/lib/actions/general_action';
import { getRandomInterviewCover } from '@/lib/utils';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import React from 'react'
import DisplayTechIcon from '@/components/DisplayTechIcon';
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth_action';

const page = async({params}: RouteParams) =>  {
  const { id } = await params;
  const user = await getCurrentUser(); // Assuming this fetches the user details as well
  const interview = await getInterviewsById(id);
  if (!interview){
    redirect('/'); // Redirect to home if interview not found
  }
  return (
    <>
      <div className='flex flex-row justify-between'>
        <div className = "flex flex-row gap-4 items-center max-sm:flex-col">
          <div className = "flex flex-row gap-4 items-center">
            <Image src={getRandomInterviewCover()} alt="Interview Cover" width={40} height={40} className="size-{40px} rounded-full object-cover" />
               <h3 className ="Capitalize text-2xl font-semibold">{interview.role} Interview</h3>
        </div>
        <DisplayTechIcon techStack = {interview.techstack} />
      </div>
      <p
      className= "bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize"
      >{interview.type}</p>
      </div>

      <Agent 
        userName = {user?.name ?? ""}
        userId = {user?.id}
        interviewId={id}
        type = "interview"
        questions={interview.questions}
        /> 
    </>
  )
    
  
}

export default page