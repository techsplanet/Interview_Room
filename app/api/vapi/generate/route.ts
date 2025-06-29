import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getRandomInterviewCover } from '@/lib/utils';
import { db } from '@/firebase/admin';

export async function GET() {
    return Response.json({success:true, data:'THANK YOU!'}, {status: 200});
}

export async function POST(request:Request){
    console.log('question request generated');
    const {type, role, level, techstack, amount, userid} = await request.json();

    try{
        const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        // 2. Perform a robust runtime check for undefined/empty string
        if (!googleApiKey) {
            console.error('SERVER ERROR: GOOGLE_GENERATIVE_AI_KEY environment variable is not set.');
            return Response.json(
                { success: false, error: { message: 'Server configuration error: AI API Key missing.' } },
                { status: 500 }
            );
        }

        // 3. Initialize the model with the now-guaranteed string API key
        // TypeScript now knows 'googleApiKey' is a string because of the check above.
        const model = google('gemini-2.0-flash-001');
    const {text : questions} = await generateText({ 
        model: model,
        prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioral and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

     const interview = {
        role, type, level, 
        techstack: techstack.split(','),
        questions: JSON.parse(questions),
        userId: userid,
        finalized: true,
        coverImage: getRandomInterviewCover(),
        createdAt: new Date().toISOString()
     }

     await db.collection('interviews').add(interview);

     return Response.json({success: true},{status:200});
    }catch(error){ 
        console.error(error);
        return Response.json({success: false, error}, {status: 500});
    }
}