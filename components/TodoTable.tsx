import { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  Container,
  Input,
  Button,
} from "@mantine/core";
import { dataType } from "./Get";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { firebaseApp, TARGET_COLLECTION_NAME } from "../libs/firebase";
import Set from "./Set";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export interface TodoRowType {
  id: string;
  taskname: string;
  done: boolean;
}

export const TodoTable = () => {
  const [data, setData] = useState<TodoRowType[]>();
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    const firebase = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const col = collection(db, TARGET_COLLECTION_NAME);
        const querySnapshot = await getDocs(col);
        const ret: any = [];
        querySnapshot.forEach((doc) => {
          ret.push(doc.data());
        });
        setData(ret);
        console.log(ret);
      } catch (error) {
        console.log("error");
      }
    };
    firebase();
  }, [clicked]);
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(["1"]);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection(() => (data === undefined ? [] : data.map((item) => item.id)));
  const rows =
    data === undefined
      ? []
      : data.map((item) => {
          const selected = selection.includes(item.id);
          return (
            <tr
              key={item.id}
              className={cx({ [classes.rowSelected]: selected })}
            >
              <td>
                <Checkbox
                  checked={selection.includes(item.id)}
                  onChange={() => toggleRow(item.id)}
                  transitionDuration={0}
                />
              </td>
              <td style={{ fontSize: "24px" }}>{item.taskname}</td>
            </tr>
          );
        });

  const [inputtask, setTask] = useState<string>();
  const setValue = (e: string) => {
    setTask(e);
  };
  const addTask = async () => {
    try {
      const db = getFirestore(firebaseApp);
      const col = collection(db, TARGET_COLLECTION_NAME);
      await addDoc(col, {
        taskname: inputtask,
        done: false,
        id: rows === undefined ? "0" : rows.length.toString(),
      });
      console.log("success!" + data + "(please reload)");
      setClicked(!clicked);
    } catch (error) {
      console.log("error");
    }
  };

  // const deleteTask = async () => {
  //   try {
  //     const db = getFirestore(firebaseApp);
  //     const col = collection(db, TARGET_COLLECTION_NAME);
  //     await deleteDoc(col, {
  //       taskname: inputtask,
  //       done: false,
  //       id: rows === undefined ? "0" : rows.length.toString(),
  //     });
  //     console.log("success!" + data + "(please reload)");
  //     setClicked(!clicked);
  //   } catch (error) {
  //     console.log("error");
  //   }
  // };

  return (
    <ScrollArea>
      <Table sx={{ minWidth: 800 }} verticalSpacing="lg">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <Checkbox
                onChange={toggleAll}
                checked={data !== undefined}
                indeterminate={data !== undefined}
                transitionDuration={0}
              />
            </th>
            <th style={{ fontSize: "24px" }}>Task</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <div>
        <Container>
          <Input type="text" onChange={(e: any) => setValue(e.target.value)} />
          <Button onClick={() => addTask()}>set Task</Button>
        </Container>
      </div>
    </ScrollArea>
  );
};
