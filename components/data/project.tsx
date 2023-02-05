import {
  Timestamp,
  FirestoreDataConverter,
  serverTimestamp,
} from "firebase/firestore";

export type Project = {
  __type: "project";
  id?: string;
  userId: string;
  name: string;
  createdAt?: Date;
  color: string;
};

export const Project: Project = {
  __type: "project",
  // id: "__id__",
  userId: "__userId__",
  name: "__project__",
  // createdAt: new Date(),
  color: "__color__",
};

export const newProject: (userId: string) => Project = (userId) => {
  return {
    __type: "project",
    userId: userId,
    name: "",
    color: "#757575",
  };
};

export const ProjectConverter: FirestoreDataConverter<Project> = {
  toFirestore: (project) => {
    return {
      __type: "project",
      userId: project.userId,
      name: project.name,
      createdAt: project.createdAt
        ? Timestamp.fromDate(project.createdAt as Date)
        : serverTimestamp(),
      color: project.color,
    };
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    const project = {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
    } as Project;
    project.id = snapshot.id;
    return project;
  },
};
