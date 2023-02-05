import { useState, useEffect, useContext } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";

import type { Task } from "../data/task";
import { FirestoreContext } from "../context/firestore";
import { genTaskGroupQuery, getCollectionPath, TaskGroup } from "../Model";
import { UserContext } from "../context/user";
import { firebaseApp, firebaseAuth } from "../../libs/firebase";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { db } from "../../libs/firebase";

export const useTasks = (taskGroup: TaskGroup) => {
  const [tasks, setTasks] = useState<Array<Task>>([]);
  const user = useContext(UserContext);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const unsubscribe = onSnapshot(
          genTaskGroupQuery(db, user!.uid, taskGroup),
          {
            next: (sn) => {
              setTasks(sn.docs.map((docSn) => docSn.data()));
            },
          }
        );
        // console.log(tasks);
        return unsubscribe;
      }
    });
  }, [taskGroup, user]);

  return tasks;
};
