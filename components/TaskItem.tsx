import React, { useContext, useState } from "react";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

import { FirestoreContext } from "./context/firestore";
import { UserContext } from "./context/user";
import type { Task } from "./data/task";
import type { TaskGroup } from "./Model";
import { TaskItemView } from "./TaskItemView";
import { TaskItemForm } from "./TaskItemForm";
import { TaskConverter } from "./data/task";
import { getCollectionPath } from "./Model";

type Props = {
  taskGroup: TaskGroup;
  task: Task;
};
type Mode = "View" | "Form";

export const TaskItem: React.FC<Props> = (props) => {
  const user = useContext(UserContext);
  const db = useContext(FirestoreContext);
  const task = props.task;
  const [mode, setMode] = useState<Mode>(task.id ? "View" : "Form");

  const collectionPath = getCollectionPath(props.taskGroup, user!.uid);
  // if taskGroup : /users/${userId}/projects/${taskGroup.id}/tasks
  // else : /users/${userId}/tasks

  const switchTask = (task: Task) => {
    const col = collection(db, collectionPath).withConverter(TaskConverter);
    setDoc(doc(col, task.id), { ...task, done: !task.done });
  };

  const deleteTask = (task: Task) => {
    const col = collection(db, collectionPath).withConverter(TaskConverter);
    deleteDoc(doc(col, task.id)).catch((e) => console.log(e));
  };

  if (mode === "Form") {
    return (
      <TaskItemForm
        task={props.task}
        collectionPath={collectionPath}
        onCancelClick={() => setMode(task.id ? "View" : "Form")}
        onComplete={() => setMode(task.id ? "View" : "Form")}
      />
    );
  } else if (mode === "View") {
    return (
      <TaskItemView
        key="view"
        task={task}
        onCheckMarkClick={() => switchTask(task)}
        onCenterClick={() => setMode("Form")}
        onMenuEditClick={() => setMode("Form")}
        onMenuDeleteClick={() => deleteTask(task)}
      />
    );
  } else {
    console.error("Unexpected case.");
    return null;
  }
};

export default TaskItem;
