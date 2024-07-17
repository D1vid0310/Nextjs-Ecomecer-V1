import { formaPrecio, valorDolar } from "@/actions/forma-precio";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Productos as ProductosType } from "@/interfaces/product.interfaces";
import { Calculator, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { CrearProductos } from "./anadir-productos";
import { AlertDialogDemo } from "./eliminar";
import { useState } from "react";
import ReactModal from "react-modal";

interface TableDemoProps {
  productos: ProductosType[];
  getItems: () => Promise<void>;
  eliminarProduDb: (item: ProductosType) => Promise<void>;
}

export function TableDemo({
  productos,
  getItems,
  eliminarProduDb,
}: TableDemoProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [resultadoModal, setResultadoModal] = useState(0);

  const handleValorDolar = (precio: any) => {
    const resultado = valorDolar(precio);
    setResultadoModal(resultado);
    setModalVisible(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Imagen Producto</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Unidades Vendidas</TableHead>
            <TableHead>Ganancias</TableHead>
            <TableHead className="text-center w-[250px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => {
            const resultado = formaPrecio(producto.precio * producto.unidades);
            return (
              <TableRow key={producto.id}>
                <TableCell>
                  <Image
                    width={1000}
                    height={1000}
                    src={producto.img.url}
                    alt={producto.nombre}
                    className="object-cover w-16 h-16"
                  />
                </TableCell>
                <TableCell className="font-semibold w-[150px] ">
                  {producto.nombre}
                </TableCell>

                <TableCell className="text-left">
                  {formaPrecio(producto.precio)}
                </TableCell>
                <TableCell className="text-left">{producto.unidades}</TableCell>
                <TableCell className="text-left">{resultado}</TableCell>
                <TableCell className="flex text-center">
                  <CrearProductos productoActu={producto} getItems={getItems}>
                    <Button>
                      <SquarePen className="mr-1" />
                    </Button>
                  </CrearProductos>
                  <AlertDialogDemo
                    eliminarProduDb={eliminarProduDb}
                    item={producto}
                  >
                    <Button className="ml-4" variant={"destructive"}>
                      <Trash2 className="mr-1" />
                    </Button>
                  </AlertDialogDemo>
                  <Button
                    className="ml-4"
                    onClick={() => handleValorDolar(resultado)}
                  >
                    <Calculator className="mr-1" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <ReactModal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        contentLabel="Resultado en Dólares"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Resultado en Bolivares
          </h2>
          <p className="mb-4 text-center">
            El resultado es: {resultadoModal} BS
          </p>
          <Button
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setModalVisible(false)}
          >
            Cerrar
          </Button>
        </div>
      </ReactModal>
    </>
  );
}

export default TableDemo;
