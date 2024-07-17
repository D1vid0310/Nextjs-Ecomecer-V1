import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  img?: string;
  name: string;
  email: string;
  contraseña?: string;
  dia: Timestamp;
}
