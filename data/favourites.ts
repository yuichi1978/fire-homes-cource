import "server-only";

import { auth, firestore } from "@/firebase/server";
import { cookies } from "next/headers";

export const getUserFavourites = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  if (!token) {
    return {};
  }

  const verifiedToken = await auth.verifyIdToken(token);

  if (!verifiedToken) {
    return {};
  }

  const favouritesSnapshot = await firestore
    .collection("favourites")
    .doc(verifiedToken.uid)
    .get();

  const favouritesData = favouritesSnapshot.data();
  return favouritesData || {};
};
