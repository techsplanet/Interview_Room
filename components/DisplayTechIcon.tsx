import { cn, getTechLogos } from '@/lib/utils'
import Image from 'next/image';
import React from 'react'

const DisplayTechIcon = async ({techStack}: TechIconProps) => {
  const techIcons = await getTechLogos(techStack);
  return (
    <div className='flex flex-row w-fit h-fit p-0.5 bg-dark-100 rounded-full'>{techIcons.slice(0,3).map(({tech, url}, index)=>(
      <div key={tech} className={cn('relative group  bg-dark-200 rounded-full flex-center w-8 h-8 p-0.5', index >= 1 && '-ml-2')}>
        <span className='tech-tooltip'>{tech}</span>
        <Image src={url} alt={tech} width={20} height={20}  />
      </div>
    ))}</div>
  )
}

export default DisplayTechIcon