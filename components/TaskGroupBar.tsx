import { Box, Navbar, Text, Flex, Collapse, Group } from "@mantine/core";
import { useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { AddProjectModal } from "./AddProjectModal";
import { UserContext } from "./context/user";
import { newProject } from "./data/project";
import { RxChevronDown, RxChevronRight } from "react-icons/rx";

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
        <Flex
          onClick={() => setOpened((prev) => !prev)}
          className={props.cx(props.classes.link)}
          style={{ paddingTop: "30px", paddingBottom: "0px" }}
        >
          <Group>
            {opened ? <RxChevronDown /> : <RxChevronRight />}
            <Box ml="md" style={{ color: "white", margin: "10px" }}>
              <Text fz="md">Projects</Text>
            </Box>
          </Group>
          <AiOutlinePlus
            onClick={() => setAddProjectModal(true)}
            size={15}
            style={{ position: "absolute", right: "25px" }}
          />
          {user && (
            <AddProjectModal
              closer={() => setAddProjectModal(false)}
              project={newProject(user!.uid)}
              opened={addProjectModal}
              setOpened={() => setAddProjectModal(false)}
            />
          )}
        </Flex>
        <Collapse in={opened}>{props.project_items}</Collapse>
      </Navbar.Section>
    </>
  );
};
