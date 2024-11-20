import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { auth } from "../config/firebase.config";
import { signOut } from "firebase/auth";

export const action: ActionFunction = async () => {
  try {
    await signOut(auth);

    // Warten auf die Aktualisierung des Auth-Status
    await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged(() => {
        unsubscribe();
        resolve(true);
      });
    });

    // Browser-Cache löschen für die Auth-Status
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }

    // Zur Homepage statt Login-Seite weiterleiten
    return redirect("/", {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, post-check=0, pre-check=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return redirect("/");
  }
};

// Verhindere direkten Zugriff auf /logout
export const loader = () => redirect("/");
