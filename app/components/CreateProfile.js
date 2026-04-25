"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function CreateProfile() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/create-profile", {
        method: "POST"
      });
    }
  }, [isSignedIn, user]);

  return null;
}
