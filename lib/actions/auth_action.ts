'use server'
import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const one_week = 60*60*24*7;

export async function signUp(params:SignUpParams) {
    const {uid, name, email } = params;

    try{
       const userRecord = await db.collection('users').doc(uid).get();
       if(userRecord.exists){
        return{
            success: false,
            message: 'User already exists. Please sign in instead.'
        }
       }

       await db.collection('users').doc(uid).set({name, email});

       return{
        success: true,
        message: 'Account created Successfully. Please sign in.'
       }
    }catch(e:any){
        console.error('Error creating a user', e);
        if(e.code === 'auth/email-already-exist'){
          return{
            success: false,
            message: 'This email is already is use. Please Sign In'
          }
        }
        return {
            success: false,
            message: 'Failed to create an account'
        }
    }
}

export async  function  signIn(params:SignInParams){
    const {email, idToken} = params;

    try{
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord){
            return {
                success: false,
                message: 'User does not exist. Create an  account instead.'
            }
        }

        await setSessionCookie(idToken);

    }catch(e){
        console.error(e);
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: one_week*1000,
    })
    
    cookieStore.set('session', sessionCookie, {
        maxAge: one_week,
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        path: '/',
        sameSite: 'lax'
    })
}