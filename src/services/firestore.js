import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

// ── Buckets ──

export async function getBuckets(userId) {
  const ref = collection(db, "users", userId, "buckets");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.data().id, name: d.data().name }));
}

export async function createBucket(userId, bucket) {
  await setDoc(doc(db, "users", userId, "buckets", bucket.id), bucket);
}

export async function renameBucket(userId, bucketId, name) {
  const ref = doc(db, "users", userId, "buckets", bucketId);
  await updateDoc(ref, { name });
}

// ── Cards ──

export async function getCards(userId, bucketId) {
  const ref = collection(db, "users", userId, "buckets", bucketId, "cards");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({
    id: d.data().id,
    name: d.data().name,
    link: d.data().link,
  }));
}

export async function createCard(userId, bucketId, card) {
  await setDoc(
    doc(db, "users", userId, "buckets", bucketId, "cards", card.id),
    card
  );
}

export async function updateCard(userId, bucketId, cardId, data) {
  const ref = doc(db, "users", userId, "buckets", bucketId, "cards", cardId);
  await updateDoc(ref, data);
}

export async function deleteCard(userId, bucketId, cardId) {
  await deleteDoc(
    doc(db, "users", userId, "buckets", bucketId, "cards", cardId)
  );
}

export async function clearBucket(userId, bucketId, cards) {
  const deletes = cards.map((c) =>
    deleteDoc(doc(db, "users", userId, "buckets", bucketId, "cards", c.id))
  );
  await Promise.all(deletes);
}

// ── History ──

export async function getHistory(userId) {
  const ref = collection(db, "users", userId, "history");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((d) => ({
    id: d.id,
    name: d.data().name,
    link: d.data().link,
    time: d.data().time,
  }));
}

export async function addHistory(userId, entry) {
  await addDoc(collection(db, "users", userId, "history"), entry);
}

export async function deleteHistory(userId, historyId) {
  await deleteDoc(doc(db, "users", userId, "history", historyId));
}

export async function clearAllHistory(userId) {
  const ref = collection(db, "users", userId, "history");
  const snapshot = await getDocs(ref);
  const deletes = snapshot.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletes);
}

// ── User ──

export async function createUser(userId, email) {
  await setDoc(doc(db, "users", userId), { email });
}
