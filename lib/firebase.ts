// Import the functions you need from the SDKs you need
import { sign } from "crypto";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  uploadString,
  getDownloadURL,
  ref,
} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlCd9qpvVFLXzzGWN6TAnlDC056UFzyW8",
  authDomain: "administrador-nextjs.firebaseapp.com",
  projectId: "administrador-nextjs",
  storageBucket: "administrador-nextjs.appspot.com",
  messagingSenderId: "1095331643952",
  appId: "1:1095331643952:web:fc54eafd412f50685c63f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

//Servicio de autenticacion, ingreso y crear usuario.
export const auth = getAuth(app);

//Function para la autenticacion

//funcion para recuperar contraseña
export const enviodeGmal = (email: string) => {
  //Enviamos un correo para poder cambiar la contraseña
  return sendPasswordResetEmail(auth, email);
};

//funcion para cerrar sesion
export const salirDelaCuenta = () => {
  localStorage.removeItem("user");
  return auth.signOut();
};

//Registrara un usuario
export const registro = async (user: { email: string; contraseña: string }) => {
  return await createUserWithEmailAndPassword(
    auth,
    user.email,
    user.contraseña
  );
};

//Acceder con el correo y contraseña

export const ingreso = async (user: { email: string; contraseña: string }) => {
  return await signInWithEmailAndPassword(auth, user.email, user.contraseña);
};

//Actualizar nombre y foto del usuario
export const actualizarName = (user: {
  displayName?: string | null | undefined;
  photoURL?: string | null | undefined;
}) => {
  if (auth.currentUser) return updateProfile(auth.currentUser, user);
};

//Servicio de base de datos
export const db = getFirestore(app);

//

//Eliminar un producto

export const eliminarDoc = (path: string) => {
  return deleteDoc(doc(db, path));
};

export const getCollection = async (
  collectionName: string,
  queryArray?: any
) => {
  const ref = collection(db, collectionName);
  const q = queryArray ? query(ref, ...queryArray) : query(ref);

  return (await getDocs(q)).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

//AñADIR un docuemnto A la base de datos
export const addDoct = (path: string, data: any) => {
  data.dia = serverTimestamp();
  return addDoc(collection(db, path), data);
};

//Setiar un docuemnto
export const setDoct = (path: string, data: any) => {
  data.dia = serverTimestamp();
  return setDoc(doc(db, path), data);
};

//obtener informacion de la base de datos
export const getDocument = async (path: string) => {
  return (await getDoc(doc(db, path))).data();
};

//Servicio para subir img al storage
export const storage = getStorage(app);

//Storage Function
export const subirArchivo = async (path: string, base64: string) => {
  //Subimos img al almacenamiento
  return uploadString(ref(storage, path), base64, "data_url").then(() => {
    return getDownloadURL(ref(storage, path));
  });
};

//Funcion para actualizar/ se actualiza y se carga la img
export const actualizarDoc = (path: string, data: any) => {
  return updateDoc(doc(db, path), data);
};
