import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { requireAuth } from "../utils/auth.server";
import { getTasks } from "../models/task.server";
import type { Task } from "../models/task.server";

type LoaderData = {
  tasks: Task[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuth(request);
  const tasks = await getTasks(user.uid);
  return json<LoaderData>({ tasks });
};

export default function DashboardIndex() {
  const { tasks } = useLoaderData<LoaderData>();

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Noch keine Aufgaben vorhanden</p>
          <Link
            to="/dashboard/tasks/new"
            className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Erste Aufgabe erstellen
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="text-gray-600 mt-1">{task.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {task.points} Punkte
                </span>
                <span className="text-sm text-gray-500">
                  Status: {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
