"use client"

import React, { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {vapi} from '@/lib/vapi.sdk';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED'
}

interface SavedMessage {
  role:'user'|'system'|'assistant';
  content : string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);


  useEffect(()=>{
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message:Message) =>{
      if(message.type ==='transcript' && message.transcriptType ){
        const newMessage = {role: message.role, content: message.transcript}
        setMessages((prev)=>[...prev, newMessage]);
      }
      }
      const onSpeechStart = () => setIsSpeaking(true);
      const onSpeechEnd = () => setIsSpeaking(false);

      const onError = (error: Error) => console.log('Error', error);

      vapi.on('call-start', onCallStart);
      vapi.on('call-end', onCallEnd);
      vapi.on('message', onMessage);
      vapi.on('speech-start', onSpeechStart);
      vapi.on('speech-end', onSpeechEnd);
      vapi.on('error', onError);
    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  },[])
  
  useEffect(()=>{
    if(callStatus === CallStatus.FINISHED) router.push('/');
  },[messages, callStatus, type, userId]);
  
  const handleCall = async () =>{
    setCallStatus(CallStatus.CONNECTING);
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;
    await vapi.start(assistantId, {
      variableValues: {
        username: userName,
        userid: userId,
      }
    })
  }

  const handleDisconnect = async ()=> {
     setCallStatus(CallStatus.FINISHED);
     vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;

  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
  
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
              <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn')}>
                {latestMessage}
              </p>
            </div>
          </div>
        )
       }

      <div className='w-full flex justify-center'>
        {callStatus !== 'ACTIVE' ? (
          <button 
          className="relative btn-call"
          type="button"
          onClick={handleCall}>
            <span className={
              cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')
            } />
            <span>  {
                isCallInactiveOrFinished?'Call':'...'
              }
              </span>
            
          </button>
        ):(
          <button type='button' className="btn-disconnect" onClick={handleDisconnect}>End</button>
        ) }
      </div>
    </>
  );
};

export default Agent;
