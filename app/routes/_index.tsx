import { auth } from "../config/firebase.config";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Form, useNavigate } from "@remix-run/react";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Laden...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-8 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Familien-ToDo-App</h1>

        {user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600">Eingeloggt als: {user.email}</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Zum Dashboard
              </button>
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
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Anmelden
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Registrieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
