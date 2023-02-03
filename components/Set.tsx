import { useState, FC } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { firebaseApp, TARGET_COLLECTION_NAME } from "../libs/firebase";
import { Button, Container, Flex, Input } from "@mantine/core";
import { TodoRowType } from "./TodoTable";

const Set = (rows: JSX.Element[]) => {
  const [data, setData] = useState<string>();
  const setValue = (e: string) => {
    setData(e);
  };
  const firebase = async () => {
    try {
      const db = getFirestore(firebaseApp);
      const col = collection(db, TARGET_COLLECTION_NAME);
      await addDoc(col, {
        taskname: data,
        done: false,
        id: rows === undefined ? "0" : `{rows.length}`,
      });
      console.log("success!" + data + "(please reload)");
    } catch (error) {
      console.log("error");
    }
  };
  return (
    <div>
      <Container>
        <Input
          type="text"
          onChange={(e: any) => setValue(e.target.value)}
          rightSectionWidth={100}
        />
        <Button onClick={() => firebase()}>set Task</Button>
      </Container>
    </div>
  );
};

export default Set;
