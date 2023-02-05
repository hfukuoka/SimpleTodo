import {
  Box,
  Center,
  ChevronIcon,
  Code,
  Container,
  Navbar,
  Title,
  Text,
  Flex,
  Collapse,
} from "@mantine/core";
import { useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { AddProjectModal } from "./AddProjectModal";
import { UserContext } from "./context/user";
import { newProject } from "./data/project";

export type TaskGroupType = {
  cx: (...args: any) => string;
  classes: Record<
    | "footer"
    | "header"
    | "link"
    | "version"
    | "navbar"
    | "linkIcon"
    | "linkActive",
    string
  >;
  project_items: JSX.Element[];
  special_tasks: JSX.Element[];
};

export const TaskGroupBar = (props: TaskGroupType) => {
  const [addProjectModal, setAddProjectModal] = useState<boolean>(false);
  const [opened, setOpened] = useState(false);
  const user = useContext(UserContext);

  return (
    <>
      <Navbar.Section grow>
        {props.special_tasks}
        <div
          onClick={() => setOpened((prev) => !prev)}
          className={props.cx(props.classes.link)}
        >
          <ChevronIcon />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box ml="md" style={{ color: "white", margin: "10px" }}>
              <Text fz="md">Projects</Text>
            </Box>
          </Box>
          <Flex
            className="addProject"
            onClick={() => setAddProjectModal(true)}
            style={{ marginRight: "10px" }}
          >
            <AiOutlinePlus size={15} style={{ margin: "0 0 0 auto " }} />
          </Flex>
          {user && (
            <AddProjectModal
              closer={() => setAddProjectModal(false)}
              project={newProject(user!.uid)}
              opened={addProjectModal}
              setOpened={() => setAddProjectModal(false)}
            />
          )}
        </div>
        <Collapse in={opened}>{props.project_items}</Collapse>
      </Navbar.Section>
    </>
  );
};
