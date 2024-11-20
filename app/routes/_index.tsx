import { auth } from "../config/firebase.config";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Form } from "@remix-run/react";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
              <a
                href="/dashboard"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Zum Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Ausloggen
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <a
              href="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Anmelden
            </a>
            <a
              href="/register"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Registrieren
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
