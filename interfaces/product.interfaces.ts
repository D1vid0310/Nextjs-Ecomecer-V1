import { Timestamp } from "firebase/firestore";
import { ItemImage } from "./item-img.interface";

export interface Productos {
  id?: string;
  img: ItemImage;
  nombre: string;
  precio: number;
  unidades: number;
  fecha?: Timestamp;
}
