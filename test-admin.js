import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'mesurepro'
});

const db = admin.firestore();

async function check() {
  try {
    const querySnapshot = await db.collection("clients").get();
    console.log("Admin Clients count:", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (e) {
    console.error(e);
  }
}
check();
