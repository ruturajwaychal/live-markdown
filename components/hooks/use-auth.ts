import { useState } from "react";

export type UserRole = "USER" | "ADMIN";

export function useAuth() {
  const [role, setRole] = useState<UserRole>("USER");

  const toggleRole = () => {
    setRole((prev) => (prev === "USER" ? "ADMIN" : "USER"));
  };

  return { role, isAdmin: role === "ADMIN", toggleRole };
}