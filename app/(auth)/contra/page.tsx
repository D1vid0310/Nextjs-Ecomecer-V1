import Logo from "@/components/logo";
import { Metadata } from "next";
import Formulario from "./componentes/RecuperarForm";

export const metadata: Metadata = {
  title: "Recuperar Tu Contraseña",
  description: "Accede para ver la lista de productos",
};

const Contra = () => {
  return (
    <div className="pt-10 lg:p-8 flex items.center md:h-[70vh]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[454px]">
        <Formulario />
      </div>
    </div>
  );
};

export default Contra;
