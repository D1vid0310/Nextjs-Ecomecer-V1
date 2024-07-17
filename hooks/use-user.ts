import { getInLocalstorage } from "@/actions/get-localstore";
import { setInLocalstorage } from "@/actions/set-localstore";
import { auth, getDocument } from "@/lib/firebase";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user.interfaces"; // Asegúrate de importar la interfaz

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();
  const pathName = usePathname();
  const protegerRutas = ["/dasboard"];
  const isInPRutas = protegerRutas.includes(pathName);

  const getUserFromBD = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      const res = await getDocument(path);
      const userData = res as User;
      setUser(userData);
      setInLocalstorage("user", userData);
    } catch (error) {
      console.error("Error getting user from database:", error);
    }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser: FirebaseUser | null) => {
      if (authUser) {
        const userInLocal = getInLocalstorage("user") as User | undefined;
        if (userInLocal) {
          setUser(userInLocal);
        } else {
          getUserFromBD(authUser.uid);
        }
      } else {
        if (isInPRutas) router.push("/");
      }
    });
  }, [isInPRutas, pathName, router]);

  return user;
};
