import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const getUserProfile = async (uid: string) => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};

export const saveUserProfile = async (uid: string, data: any) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  } catch (err) {
    console.error("Error saving profile:", err);
    return false;
  }
};
