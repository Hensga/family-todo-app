import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { auth } from "../config/firebase.config";
import { signOut } from "firebase/auth";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { requireAuth, logout } from "../utils/auth.server";
import type { User } from "firebase/auth";

type LoaderData = {
  email: string | null;
  displayName: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = (await requireAuth(request)) as User;

  if (!user) {
    throw redirect("/login");
  }

  return json<LoaderData>({
    email: user.email,
    displayName: user.displayName,
  });
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    await signOut(auth); // Firebase Logout
    return redirect("/"); // Zur Homepage statt Login
  } catch (error) {
    console.error("Logout error:", error);
    return redirect("/");
  }
};

export default function Dashboard() {
  const { email, displayName } = useLoaderData<LoaderData>();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Familien-ToDo-App</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Eingeloggt als: {email}</span>
              <Form method="post">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Ausloggen
                </button>
              </Form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 text-slate-900">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-lg">Willkommen {displayName || email}!</p>
            {/* Hier können später die ToDo-Listen und andere Features hinzugefügt werden */}
          </div>
        </div>
      </main>
    </div>
  );
}
