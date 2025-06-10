import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

type UserData = {
  nome: string;
  email: string;
};

type UserContextType = {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarUsuario = async (uid: string, email: string) => {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const dados = snapshot.data();
      setUser({ nome: dados.nome, email });
    }
  };

  const refreshUser = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await carregarUsuario(currentUser.uid, currentUser.email || "");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await carregarUsuario(firebaseUser.uid, firebaseUser.email || "");
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
};
