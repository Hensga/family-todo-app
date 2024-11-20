import { Form, useActionData } from "@remix-run/react";
import { auth } from "../config/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const user = await new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });

  if (user) {
    return redirect("/dashboard");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!userCredential.user) {
      throw new Error("Login fehlgeschlagen");
    }
    return redirect("/dashboard");
  } catch (error) {
    return json(
      {
        error: "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.",
      },
      { status: 400 }
    );
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">Anmelden</h1>

        {actionData?.error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Anmelden
          </button>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Noch kein Konto?{" "}
            <a href="/register" className="text-blue-500 hover:text-blue-700">
              Registrieren
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
