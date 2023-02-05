import {
  Navbar,
  Code,
  Container,
  Text,
  Title,
  Center,
  Menu,
} from "@mantine/core";

import { BiTask } from "react-icons/bi";
import {
  getCollectionPath,
  Inbox,
  RecentFilter,
  TaskGroup,
  TodayFilter,
} from "./Model";
import { getTaskGroupTitle } from "./utils";
import { useTaskCounts } from "./hooks/useTaskCounts";
import { UserContext } from "./context/user";
import { useContext, useState } from "react";
import { ProjectsContext } from "./context/projects";
import { TaskGroupBar } from "./TaskGroupBar";
import { SideFooter } from "./SideFooter";
import { useSideBarStyles } from "./useSideBarStyles";
import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../libs/firebase";
import { Project } from "./data/project";
import { TaskConverter } from "./data/task";

export const Sidebar = (props: any) => {
  const user = useContext(UserContext);
  const projects = useContext(ProjectsContext);
  const { classes, cx } = useSideBarStyles();
  const specialTaskGroups: TaskGroup[] = [Inbox, TodayFilter, RecentFilter];
  const counts = useTaskCounts();

  const special_tasks = specialTaskGroups.map((group) => (
    <div
      key={group.name}
      className={cx(classes.link, {
        [classes.linkActive]: props.current === group,
      })}
      onClick={() => props.switcher(group)}
    >
      <BiTask size={20} />
      <Text fz="sm" style={{ marginLeft: "20px" }}>
        {getTaskGroupTitle(group)}
      </Text>
      <span style={{ margin: "0 0 0 auto" }}>
        {counts[group.name] && counts[group.name] > 0 ? counts[group.name] : ""}
      </span>
    </div>
  ));
  const deleteProject = (project: Project) => {
    const collectionPath = `/users/${user!.uid}/projects`;
    const col = collection(db, collectionPath).withConverter(TaskConverter);
    console.log(collectionPath);
    deleteDoc(doc(col, project.id)).catch((e) => console.log(e));
  };
  const project_items = projects.map((project) => {
    const taskCount = counts[project.name];
    return (
      <Menu
        trigger="hover"
        transition="rotate-left"
        transitionDuration={300}
        offset={3}
        key={project.id}
      >
        <Menu.Target>
          <div
            key={project.name}
            className={cx(classes.link, {
              [classes.linkActive]:
                props.current.__type === "project" &&
                props.current.name === project.name,
            })}
            onClick={() => props.switcher(project)}
          >
            <BiTask size={20} color={project.color} />
            <Text fz="sm" style={{ marginLeft: "20px" }}>
              {project.name}
            </Text>
            <div style={{ position: "relative", margin: "0 0 0 auto" }}>
              {taskCount && taskCount > 0 ? taskCount : ""}
            </div>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => deleteProject(project)}>Delete</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  });

  return (
    <>
      <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
        <Navbar.Section>
          <Center className={classes.header} inline style={{ width: 270 }}>
            <Title order={1} color="white" style={{ paddingLeft: "20px" }}>
              Simple Todo
            </Title>
            <Container>
              <Code className={classes.version}>v0.0.1</Code>
            </Container>
          </Center>
        </Navbar.Section>
        <TaskGroupBar
          cx={cx}
          classes={classes}
          project_items={project_items}
          special_tasks={special_tasks}
        />
        <SideFooter classes={classes} />
      </Navbar>
    </>
  );
};
