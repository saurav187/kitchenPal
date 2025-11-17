import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const shareItem = async (data: any) => {
  try {
    await addDoc(collection(db, "shared_items"), {
      ...data,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.log("Error sharing item:", err);
    return false;
  }
};

export const getSharedItems = async () => {
  try {
    const q = query(
      collection(db, "shared_items"),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.log("Error loading shared items:", err);
    return [];
  }
};
