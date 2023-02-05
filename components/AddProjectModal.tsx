import {
  Button,
  ColorInput,
  Divider,
  Flex,
  Modal,
  TextInput,
  Title,
} from "@mantine/core";
import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FirestoreContext } from "./context/firestore";
import { UserContext } from "./context/user";
import { Text } from "@mantine/core";

import { Project, ProjectConverter } from "./data/project";

type Props = {
  project: Project;
  closer: () => void;
  opened: boolean;
  setOpened: () => void;
};

export const AddProjectModal: React.FC<Props> = (props) => {
  const user = useContext(UserContext);
  const db = useContext(FirestoreContext);
  const [project, setProject] = useState<Project>(props.project);

  const canSubmit = project.name.length > 0;

  const submitHandler = (e: any) => {
    e.preventDefault();
    const col = collection(db, `users/${user!.uid}/projects`).withConverter(
      ProjectConverter
    );
    addDoc(col, project)
      .then((_project) => props.closer())
      .catch((e) => console.error(e));
  };

  return (
    <Modal centered opened={props.opened} onClose={props.setOpened}>
      <Title fz="xl" style={{ marginBottom: "20px" }}>
        Add Project
      </Title>
      <TextInput
        label="Name"
        onChange={(e) => setProject({ ...project, name: e.target.value })}
      ></TextInput>
      <ColorInput
        label="Color"
        onChange={(e) => setProject({ ...project, color: e })}
      />
      <Divider style={{ margin: "20px" }} />
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "sm", sm: "lg" }}
        justify={{ sm: "center" }}
      >
        <Button type="reset" onClick={props.closer}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} onClick={submitHandler}>
          Add
        </Button>
      </Flex>
    </Modal>
  );
};

const DivName = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 7px;
  }

  input {
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ddd;
    padding: 5px;
    width: 100%;
    box-sizing: border-box;
  }
`;

const DivColor = styled.div`
  label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 7px;
  }

  input {
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ddd;
    width: 100px;
    box-sizing: border-box;
  }
`;

const DivFooter = styled.div`
  border-top: 1px solid #ddd;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  text-align: right;

  button {
    margin: 12px;
    padding: 6px 10px;
    border-radius: 5px;
    border: 1px solid;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    -webkit-font-smoothing: antialiased;
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo,
      sans-serif;
    &:hover {
      cursor: pointer;
    }
  }
  button[type="submit"] {
    background-color: #ff9000;
    border-color: #ff9000;
    color: white;
  }
  button[type="submit"]:disabled {
    background-color: #ffce99;
    border-color: #ffce99;
  }

  button[type="reset"] {
    background-color: transparent;
    border-color: #d6d6d6;
    color: rgba(0, 0, 0, 0.88);
    margin-right: 0px;
  }
`;
