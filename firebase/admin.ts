import { cert, initializeApp, getApps} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore';
import {getAuth} from 'firebase-admin/auth';
const initFirebaseAdmin = () =>{
    const apps = getApps();
    const serviceAccount = {
                    projectId: process.env.project_id,
                    clientEmail: process.env.client_email,
                    privateKey: process.env.private_key?.replace(/\\n/g,"\n")
                }
    if(!apps.length){
        initializeApp(
            {
                credential: cert(serviceAccount as any)
            }
        )
    }
    return {
        auth:getAuth(),
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin();