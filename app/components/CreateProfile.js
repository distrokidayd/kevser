"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function CreateProfile() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      console.log("CREATE PROFILE TRIGGERED");

      fetch("/api/create-profile", {
        method: "POST"
      })
        .then(res => res.json())
        .then(data => console.log("API RESPONSE:", data))
        .catch(err => console.error("API ERROR:", err));
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
