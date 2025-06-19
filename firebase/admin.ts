import { cert, initializeApp, getApps} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
const initFirebaseAdmin = () =>{
    const apps = getApps();

    if(!apps.length){
        initializeApp(
            {
                credential: cert({
                    projectId: process.env.FIREBASE_PRODUCT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_KEY?.replace(/\\n/g,"\n")
                })
            }
        )
    }
    return {
        auth:getAuth,
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin();