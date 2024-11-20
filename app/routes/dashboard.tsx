import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { auth } from "../config/firebase.config";
import { signOut } from "firebase/auth";
import type { LoaderFunction } from "@remix-run/node";
import type { User } from "firebase/auth";

type LoaderData = {
  email: string | null;
  displayName: string | null;
};

export const loader: LoaderFunction = async () => {
  // Strikte Auth-Prüfung
  const user = await new Promise<User | null>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

  if (!user) {
    throw redirect("/login");
  }

  return json<LoaderData>({
    email: user.email,
    displayName: user.displayName,
  });
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { email } = useLoaderData<LoaderData>();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Fehler beim Ausloggen:", error);
    }
  };

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
              <Form action="/logout" method="post">
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
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Aufgaben-Übersicht</h2>
            <Link
              to="/dashboard/tasks/new"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Neue Aufgabe
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
