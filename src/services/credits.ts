'use server';

import * as admin from 'firebase-admin';

const CREDI_DOC_ID = 'processing_credits';
const COLLECTION_ID = 'app_state';
const INITIAL_CREDITS = 50;

function initializeApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64!, 'base64').toString('utf8')
  );

  return admin.initializeApp({
    credential: admin.credential.cert(cert),
  });
}

async function getDb() {
  const app = await initializeApp();
  return admin.firestore(app);
}

export async function getCredits() {
  const db = await getDb();
  const docRef = db.collection(COLLECTION_ID).doc(CREDI_DOC_ID);
  const doc = await docRef.get();

  if (!doc.exists) {
    await docRef.set({ credits: INITIAL_CREDITS });
    return INITIAL_CREDITS;
  }

  return doc.data()!.credits as number;
}

export async function decrementCredits() {
    const db = await getDb();
    const docRef = db.collection(COLLECTION_ID).doc(CREDI_DOC_ID);

    const doc = await docRef.get();
    if (!doc.exists) {
        await docRef.set({ credits: INITIAL_CREDITS - 1 });
        return;
    }

    const currentCredits = doc.data()!.credits as number;
    if (currentCredits > 0) {
        await docRef.update({ credits: admin.firestore.FieldValue.increment(-1) });
    }
}
