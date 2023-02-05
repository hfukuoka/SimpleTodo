import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import { Task, TaskConverter } from "./data/task";
import { FirestoreContext } from "./context/firestore";
import { DatePicker } from "@mantine/dates";
import { Button, Flex, TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  collectionPath: string;
  task: Task;
  onCancelClick: () => void;
  onComplete: () => void;
};

export const TaskItemForm: React.FC<Props> = (props) => {
  const db = useContext(FirestoreContext);
  const [task, setTask] = useState<Task>(props.task);

  const canSubmit = task.name.length > 0;

  const submitHandler = (e: any) => {
    e.preventDefault();
    const col = collection(db, props.collectionPath).withConverter(
      TaskConverter
    );
    if (task.id) {
      setDoc(doc(col, task.id), task)
        .then((_task) => props.onComplete())
        .catch((e) => console.error(e));
    } else {
      addDoc(col, task)
        .then((_docRef) => props.onComplete())
        .catch((e) => console.error(e));
    }
  };
  const largeScreen = useMediaQuery("(min-width: 768px)");

  return (
    <Flex direction="column" align="center" gap={30}>
      <Flex
        style={{ marginTop: "20px" }}
        direction="row"
        align="center"
        gap={20}
        maw={700}
      >
        <TextInput
          type="text"
          label="task name"
          placeholder="Task name"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          miw={largeScreen ? "400px" : "xs"}
          mx="auto"
        />
        <DatePicker
          dropdownType="modal"
          label="task date"
          onChange={(e) =>
            setTask({
              ...task,
              scheduledAt: e ? e : null,
            })
          }
          placeholder="Date input"
        />
      </Flex>
      <Flex
        gap="xl"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Button type="submit" disabled={!canSubmit} onClick={submitHandler}>
          Add task
        </Button>
        <Button type="reset" onClick={props.onCancelClick}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};

function formatDate(date: Date): string {
  const y = date.getFullYear().toString();
  const m = ("0" + (date.getMonth() + 1)).slice(-2);
  const d = ("0" + date.getDate()).slice(-2);
  return `${y}-${m}-${d}`;
}
