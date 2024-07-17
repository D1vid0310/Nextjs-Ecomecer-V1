"use client";
import { eliminarDoc, getCollection } from "@/lib/firebase";
import { CrearProductos } from "./anadir-productos";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { TableDemo } from "./table";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { orderBy } from "firebase/firestore";
import toast from "react-hot-toast";
import type {
  Productos,
  Productos as ProductosType,
} from "@/interfaces/product.interfaces";

const Productos = () => {
  const user = useUser();
  const [Productos, setProductos] = useState<Productos[]>([]);
  const [cargando, setCargando] = useState<Boolean>(false);

  const getItems = async () => {
    const path = `users/${user?.uid}/products`;
    const query = [orderBy("dia", "desc")];
    try {
      const res = (await getCollection(path, query)) as Productos[];
      console.log(res);
      setProductos(res);
    } catch (error) {}
  };

  const eliminarProduDb = async (item: Productos) => {
    const path = `users/${user?.uid}/products/${item.id}`;
    setCargando(true);
    try {
      await eliminarDoc(path);
      toast.success(`Se elimino correctamente su producto `);
      const newItems = Productos.filter((i) => i.id !== item.id);
      setProductos(newItems);
      2;
      await getItems();
    } catch (error: any) {
      toast.error(error.message, { duration: 21900 });
      console.log(error);
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    if (user) getItems();
  }, [user]);

  return (
    <>
      <div className=" flex justify-between items-center m-4 mb-8 ">
        <h1 className="text-2xl ml-1">Mis Productos</h1>
        <CrearProductos getItems={getItems}>
          <Button className="px-6">
            Crear
            <CirclePlus className="ml-2 w-[20px]" />
          </Button>
        </CrearProductos>
      </div>
      <TableDemo
        productos={Productos}
        getItems={getItems}
        eliminarProduDb={eliminarProduDb}
      />
    </>
  );
};

export default Productos;
