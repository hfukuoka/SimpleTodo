import {
  collection,
  collectionGroup,
  Firestore,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import type { Project } from "./data/project";
import { TaskConverter } from "./data/task";

export type InboxType = { __type: "inbox"; name: "__inbox__" };
export type TodayFilterType = { __type: "today"; name: "__today__" };
export type RecentFilterType = { __type: "recent"; name: "__recent__" };
export type TaskGroup =
  | Project
  | InboxType
  | TodayFilterType
  | RecentFilterType;
export const Inbox: InboxType = { __type: "inbox", name: "__inbox__" };
export const TodayFilter: TodayFilterType = {
  __type: "today",
  name: "__today__",
};
export const RecentFilter: RecentFilterType = {
  __type: "recent",
  name: "__recent__",
};

// Firestore definitions
// -------------------------------------------------------------------------

export const getCollectionPath = (taskGroup: TaskGroup, userId: string) => {
  if (taskGroup.__type === "project") {
    return `/users/${userId}/projects/${taskGroup.id}/tasks`;
  } else {
    return `/users/${userId}/tasks`;
  }
};

export const genTaskGroupQuery = (
  db: Firestore,
  userId: string,
  taskGroup: TaskGroup
) => {
  if (taskGroup.__type === "project" || taskGroup.__type === "inbox") {
    const path = getCollectionPath(taskGroup, userId);
    const col = collection(db, path).withConverter(TaskConverter);
    // console.log(userId);

    // return query(col, where("done", "==", false), orderBy("createdAt"));
    return query(col, orderBy("createdAt"));
  } else if (taskGroup.__type === "today" || taskGroup.__type === "recent") {
    const path = getCollectionPath(taskGroup, userId);
    const col = collection(db, path).withConverter(TaskConverter);
    const colGr = collectionGroup(db, "tasks").withConverter(TaskConverter);
    const op = taskGroup.__type === "today" ? "<=" : ">";
    const q = query(
      col,
      // where("userId", "==", userId),
      // where("done", "==", false),
      where("scheduledAt", op, new Date())
      // // orderBy("scheduledAt")
    );
    console.log(q);

    return q;
  } else {
    throw "Unexpected case";
  }
};
