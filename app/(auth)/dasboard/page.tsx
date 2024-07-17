import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { salirDelaCuenta } from "@/lib/firebase";
import { Metadata } from "next";
import Productos from "./componentes/productos";

export const metadata: Metadata = {
  title: "Dasboard",
  description: "lista de productos",
};

const dasboard = () => {
  return (
    <>
      <Navbar />
      <div className="md:border border-solid border-gray-300 rounded-3xl p-3 md_m-6 lg:mx-36">
        <Productos />
      </div>
    </>
  );
};

export default dasboard;
