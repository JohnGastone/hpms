"use client";

// Flutter parallel:
// Context = InheritedWidget / Provider at the root of the widget tree.
// Any widget ANYWHERE in the tree can call useAuth() to get the
// logged-in user — without it being passed down as a constructor parameter.
//
// Flutter with Provider:
//   context.read<AuthProvider>().currentUser
//
// React with Context:
//   const { user } = useAuth()  ← same idea, no BuildContext needed

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthUser {
  id: string;
  name: string;
  role: "doctor" | "nurse" | "admin";
  ward: string;
  initials: string;
}

interface AuthContextType {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
}

// createContext() — Flutter: define your InheritedWidget or ChangeNotifier
const AuthContext = createContext<AuthContextType | null>(null);

// Default logged-in user — on Day 3 this would come from a real auth system
const DEFAULT_USER: AuthUser = {
  id: "U001",
  name: "Dr. Okello",
  role: "doctor",
  ward: "cardiology",
  initials: "DO",
};

// AuthProvider — Flutter: wrap your MaterialApp with ChangeNotifierProvider
// This goes in layout.tsx so it wraps the entire app — same as Provider at root
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(DEFAULT_USER);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth() — Flutter: context.read<AuthProvider>()
// Call this hook in any component to get the logged-in user
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}