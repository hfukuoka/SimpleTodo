import React, { useState } from "react";
import styled from "styled-components";

import type { Task } from "./data/task";

import CalendarIcon from "./svg/calendar";
import { Checkbox, Container, Flex, Menu } from "@mantine/core";
import { BsThreeDots } from "react-icons/bs";
import { useMediaQuery } from "@mantine/hooks";

type Props = {
  task: Task;
  onCheckMarkClick: () => void;
  onCenterClick: () => void;
  onMenuEditClick: () => void;
  onMenuDeleteClick: () => void;
};

export const TaskItemView: React.FC<Props> = (props) => {
  const task = props.task;

  return (
    <>
      <Flex mih={50} gap="md" direction="row" wrap="wrap" align="center">
        <Flex style={{ position: "absolute" }}>
          <Container>
            <Checkbox
              checked={task.done}
              label={task.name}
              onClick={props.onCheckMarkClick}
              size="sm"
            />
          </Container>
          <Container size="xs">
            {task.scheduledAt && (
              <>
                <CalendarIcon />
                {`${
                  task.scheduledAt.getMonth() + 1
                }/${task.scheduledAt.getDate()}`}
              </>
            )}
          </Container>
        </Flex>
        <Container
          style={{
            position: "absolute",
            right: "0px",
          }}
        >
          <Menu
            trigger="hover"
            width={200}
            transition="rotate-left"
            transitionDuration={300}
            offset={9}
          >
            <Menu.Target>
              <span style={{ margin: "0 0 0 auto" }}>
                <BsThreeDots />
              </span>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={props.onMenuEditClick}>Edit</Menu.Item>
              <Menu.Item onClick={props.onMenuDeleteClick}>Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {/* </Flex> */}
        </Container>
      </Flex>
    </>
  );
};