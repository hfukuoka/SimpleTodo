import React, { useContext } from "react";

import type { TaskGroup } from "./Model";
import { newTask } from "./data/task";
import { useTasks } from "./hooks/useTasks";
import { TaskItem } from "./TaskItem";

import { getTaskGroupTitle } from "./utils";
import { UserContext } from "./context/user";
import { Container, Divider, ScrollArea, Table, Title } from "@mantine/core";

type Props = {
  taskGroup: TaskGroup;
};

export const Mainbar: React.FC<Props> = (props) => {
  const user = useContext(UserContext);
  const title = getTaskGroupTitle(props.taskGroup);
  const tasks = useTasks(props.taskGroup);
  console.log(tasks);

  return (
    <ScrollArea>
      <Title style={{ margin: "20px" }}>{title}</Title>
      <Divider />
      {/* <div style={{ marginBottom: "28px" }} /> */}
      <Table>
        {tasks.map((task) => (
          <>
            <TaskItem key={task.id} taskGroup={props.taskGroup} task={task} />
            <Divider />
            {/* <div style={{ marginBottom: "28px" }} /> */}
          </>
        ))}
        <TaskItem taskGroup={props.taskGroup} task={newTask(user!.uid)} />
      </Table>
    </ScrollArea>
  );
};

export default Mainbar;
