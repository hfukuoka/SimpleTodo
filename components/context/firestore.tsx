import React, { ReactFragment } from "react";
import { createContext } from "react";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../libs/firebase";

const db = getFirestore(firebaseApp);

export const FirestoreContext = createContext(db);

export const FirestoreProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <FirestoreContext.Provider value={db}>{children}</FirestoreContext.Provider>
  );
};
