import Logo from "@/components/logo";
import { Metadata } from "next";
import Formulario from "./componentes/IngresoForm";

export const metadata: Metadata = {
  title: "Acceder",
  description: "Accede para ver la lista de productos",
};

const AuthPage = () => {
  return (
    <div className="flex justify-center items-center md:h-[95vh] md:px-10 lg:px-26">
      <div className="container h-[85vh] flex-col justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/*=== Imagen del formulario para la autenticacion*/}
        <div className="relative hidden h-full flex-col   p-10 text-white lg:flex">
          <div className="bg-auth absolute inset-0"></div>
          <Logo />
          <div className="relative <-20 mt-auto">
            <p className="text-lg">
              {
                "Esta aplicacion web me ayuda a que mi vida sea mucho mas facil!:D"
              }
            </p>
            <footer className="text-sm">David Chirinos</footer>
          </div>
        </div>
        {/*=== Formulario*/}
        <div className="pt-10 lg:p-8 flex items.center md:h-[70vh]">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[454px]">
            <Formulario />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
