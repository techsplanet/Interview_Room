import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

const Agent = ({ userName }: AgentProps) => {
  const isSpeaking = true;
  const callStatus = CallStatus.FINISHED;
  const messages = [
    'Whats your name',
    'My name is Naman Singh Rathaur'
  ];
  const lastMessages = messages[messages.length - 1];
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/Ai-avatar.png"
              alt="vapi"
              width={165}
              height={165}
              className="object-cover"
            />
            {isSpeaking && <span className="speakAnimation" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/User-Avatar.webp"
              alt="user avatar"
              width={540}
              height={540}
              className="avatar"
            />
          <h3>{userName}</h3>
          </div>
        </div>
      </div>
        
       {
        messages.length > 0 && (
          <div className="transcript-border">
            <div className="transcript">
              <p key={lastMessages} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn')}>
                {lastMessages}
              </p>
            </div>
          </div>
        )
       }

      <div className='w-full flex justify-center'>
        {callStatus === 'FINISHED' ? (
          <button 
          className="relative btn-call"
          type="button">
            <span className={
              cn('absolute animate-ping rounded-full opacity-75', callStatus === 'CONNECTING' && 'hidden')
            } />
            <span>  {
                callStatus === 'INACTIVE' || callStatus=== 'FINISHED'?'Call':'...'
              }
              </span>
            
          </button>
        ):(
          <button type='button' className="btn-disconnect">End</button>
        ) }
      </div>
    </>
  );
};

export default Agent;
