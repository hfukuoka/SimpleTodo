import { FC, useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebaseApp, TARGET_COLLECTION_NAME } from "../libs/firebase";

export type dataType = {
  done: boolean;
  taskname: string;
};

const Get: FC = () => {
  const [data, setData] = useState<dataType[]>();
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
      } catch (error) {
        console.log("error");
      }
    };
    firebase();
  }, []);

  return (
    <div>
      {data !== undefined && (
        <>
          {data.map((item: dataType, i: number) => (
            <div key={i}>{item.taskname}</div>
          ))}
        </>
      )}
    </div>
  );
};

export default Get;
