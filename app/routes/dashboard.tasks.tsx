import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { requireAuth } from "../utils/auth.server";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  assignTask,
} from "../models/task.server";
import type { Task, NewTask } from "../models/task.server";

type LoaderData = {
  tasks: Task[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuth(request);
  const tasks = await getTasks(user.uid);
  return json<LoaderData>({ tasks });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const action = formData.get("_action");

  switch (action) {
    case "create": {
      const newTask: NewTask = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        points: Number(formData.get("points")),
        createdBy: user.uid,
      };

      await createTask(newTask);
      break;
    }
    case "assign": {
      const taskId = formData.get("taskId") as string;
      await assignTask(taskId, user.uid);
      break;
    }
    case "complete": {
      const taskId = formData.get("taskId") as string;
      await updateTaskStatus(taskId, "erledigt");
      break;
    }
  }

  return null;
};

export default function Tasks() {
  const { tasks } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Neue Aufgabe erstellen</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="create" />
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Titel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Beschreibung
            </label>
            <textarea
              id="description"
              name="description"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="points"
              className="block text-sm font-medium text-gray-700"
            >
              Punkte
            </label>
            <input
              type="number"
              id="points"
              name="points"
              required
              min="1"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Aufgabe erstellen
          </button>
        </Form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Offene Aufgaben</h2>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4">
              <h3 className="font-bold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {task.points} Punkte
                </span>
                {!task.assignedTo ? (
                  <Form method="post">
                    <input type="hidden" name="_action" value="assign" />
                    <input type="hidden" name="taskId" value={task.id} />
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Übernehmen
                    </button>
                  </Form>
                ) : task.assignedTo === task.createdBy ? (
                  <Form method="post">
                    <input type="hidden" name="_action" value="complete" />
                    <input type="hidden" name="taskId" value={task.id} />
                    <button
                      type="submit"
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                    >
                      Als erledigt markieren
                    </button>
                  </Form>
                ) : (
                  <span className="text-sm text-gray-500">In Bearbeitung</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
