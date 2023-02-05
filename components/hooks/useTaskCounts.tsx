import { useState, useEffect, useContext } from "react";
import { onSnapshot, Unsubscribe } from "firebase/firestore";

import { Inbox, RecentFilter, TodayFilter } from "../Model";
import { FirestoreContext } from "../context/firestore";
import { ProjectsContext } from "../context/projects";
import { UserContext } from "../context/user";
import { genTaskGroupQuery } from "../Model";
import { firebaseAuth } from "../../libs/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useTaskCounts = () => {
  // const user = firebaseAuth.currentUser;
  const db = useContext(FirestoreContext);
  const projects = useContext(ProjectsContext);
  const [taskCounts, setTaskCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const unsbuscribes: Unsubscribe[] = [];
        const allTaskGroups = [Inbox, TodayFilter, RecentFilter, ...projects];
        allTaskGroups.forEach((taskGroup) => {
          const unsubscribe = onSnapshot(
            genTaskGroupQuery(db, firebaseAuth.currentUser!.uid, taskGroup),
            {
              next: (sn) => {
                setTaskCounts((prev) => {
                  return { ...prev, [taskGroup.name]: sn.size };
                });
              },
            }
          );
          unsbuscribes.push(unsubscribe);
        });
        return () => {
          unsbuscribes.forEach((unsubscribe) => unsubscribe());
        };
      }
    });
  }, [db, projects]);

  return taskCounts;
};
