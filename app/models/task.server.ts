import { db } from "../config/firebase.config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export type Task = {
  id?: string;
  title: string;
  description: string;
  points: number;
  status: "offen" | "in_bearbeitung" | "erledigt";
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  dueDate?: Date;
};

export type NewTask = Omit<Task, "id" | "createdAt" | "status">;

export async function createTask(task: NewTask) {
  const tasksRef = collection(db, "tasks");
  const newTask = {
    ...task,
    createdAt: new Date(),
    status: "offen" as const,
  };

  const docRef = await addDoc(tasksRef, newTask);
  return { id: docRef.id, ...newTask };
}

export async function getTasks(userId: string) {
  const tasksRef = collection(db, "tasks");
  const q = query(
    tasksRef,
    where("createdBy", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    dueDate: doc.data().dueDate?.toDate(),
  })) as Task[];
}

export async function updateTaskStatus(taskId: string, status: Task["status"]) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { status });
}

export async function assignTask(taskId: string, userId: string) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    assignedTo: userId,
    status: "in_bearbeitung",
  });
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
}
