import { Form, useNavigate } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireAuth } from "../utils/auth.server";
import { createTask } from "../models/task.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuth(request);
  const formData = await request.formData();

  const newTask = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    points: Number(formData.get("points")),
    createdBy: user.uid,
  };

  await createTask(newTask);
  return redirect("/dashboard");
};

export default function NewTask() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Neue Aufgabe erstellen</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Zurück zur Übersicht
        </button>
      </div>

      <Form method="post" className="space-y-4">
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
            rows={4}
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
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Aufgabe erstellen
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Abbrechen
          </button>
        </div>
      </Form>
    </div>
  );
}
